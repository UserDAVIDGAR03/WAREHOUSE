using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Agregar servicios al contenedor y configurar JSON para evitar ciclos de referencias infinitas (Error 500)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Configurar PostgreSQL con EF Core
builder.Services.AddDbContext<WarehouseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar AutenticaciÃ³n JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretEnterpriseSecurityKeyForWarehouseApi2026!";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "WarehouseAPI",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "WarehouseClient",
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

builder.Services.AddAuthorization();

// Configurar PolÃ­ticas de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 2. Configurar el pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// --- ENDPOINTS EMPRESARIALES ---

// A. Estado del Sistema
app.MapGet("/api/health", async (WarehouseContext context) =>
{
    try
    {
        await context.Database.CanConnectAsync();
        return Results.Ok(new { status = "Healthy", database = "Connected", timestamp = DateTime.UtcNow });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500, title: "Database Connection Failed");
    }
});

// B. AutenticaciÃ³n (Register y Login)
app.MapPost("/api/auth/register", async (RegisterDto dto, WarehouseContext context) =>
{
    if (await context.Users.AnyAsync(u => u.Email == dto.Email))
        return Results.BadRequest(new { message = "El correo ya estÃ¡ registrado." });

    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

    var user = new User
    {
        Username = dto.Username,
        Email = dto.Email,
        PasswordHash = hashedPassword
    };

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return Results.Created($"/api/auth/user/{user.Id}", new { message = "Usuario registrado con Ã©xito" });
});

app.MapPost("/api/auth/login", async (LoginDto dto, WarehouseContext context, IConfiguration config) =>
{
    var user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
    
    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        return Results.BadRequest(new { message = "Credenciales invÃ¡lidas." });

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? "SuperSecretEnterpriseSecurityKeyForWarehouseApi2026!");
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Email), new Claim(ClaimTypes.Role, user.Role) }),
        Expires = DateTime.UtcNow.AddHours(8),
        Issuer = config["Jwt:Issuer"] ?? "WarehouseAPI",
        Audience = config["Jwt:Audience"] ?? "WarehouseClient",
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    return Results.Ok(new { token = tokenString, username = user.Username, role = user.Role });
});

// C. GestiÃ³n de Proveedores
app.MapGet("/api/suppliers", async (WarehouseContext context) => 
    await context.Suppliers.Include(s => s.Products).ToListAsync()).RequireAuthorization();

app.MapPost("/api/suppliers", async (Supplier supplier, WarehouseContext context) =>
{
    context.Suppliers.Add(supplier);
    await context.SaveChangesAsync();
    return Results.Created($"/api/suppliers/{supplier.Id}", supplier);
}).RequireAuthorization();

// D. GestiÃ³n de Productos e Inventario
app.MapGet("/api/products", async (WarehouseContext context) =>
{
    var products = await context.Products.Include(p => p.Supplier).ToListAsync();
    return Results.Ok(products);
}).RequireAuthorization();

app.MapGet("/api/products/by-sku/{sku}", async (string sku, WarehouseContext context) =>
{
    var normalizedSku = sku.Trim();
    var product = await context.Products
        .Include(p => p.Supplier)
        .FirstOrDefaultAsync(p => p.SKU.ToLower() == normalizedSku.ToLower());

    if (product == null)
        return Results.NotFound(new { message = $"No se encontrÃ³ producto con SKU '{normalizedSku}'." });

    return Results.Ok(product);
}).RequireAuthorization();

app.MapGet("/api/products/low-stock", async (WarehouseContext context) =>
{
    var lowStockProducts = await context.Products
        .Where(p => p.StockQuantity <= p.MinimumStockAlert)
        .ToListAsync();
    return Results.Ok(lowStockProducts);
}).RequireAuthorization();

app.MapPost("/api/products", async (Product product, WarehouseContext context) =>
{
    if (await context.Products.AnyAsync(p => p.SKU == product.SKU))
        return Results.BadRequest(new { message = "El SKU del producto ya existe." });

    context.Products.Add(product);
    await context.SaveChangesAsync();
    return Results.Created($"/api/products/{product.Id}", product);
}).RequireAuthorization();

app.MapPut("/api/products/{id}/stock", async (int id, int quantityChange, WarehouseContext context) =>
{
    var product = await context.Products.FindAsync(id);
    if (product == null) return Results.NotFound(new { message = "Producto no encontrado." });

    product.StockQuantity += quantityChange;
    if (product.StockQuantity < 0) product.StockQuantity = 0;

    await context.SaveChangesAsync();
    return Results.Ok(new { message = "Stock actualizado con Ã©xito", product });
}).RequireAuthorization();

// E. Procesamiento de Ã“rdenes Empresariales
app.MapGet("/api/orders", async (WarehouseContext context) =>
{
    var orders = await context.Orders
        .Include(o => o.Items)
        .ThenInclude(i => i.Product)
        .OrderByDescending(o => o.Id)
        .ToListAsync();

    return Results.Ok(orders);
}).RequireAuthorization();

app.MapPost("/api/orders", async (CreateOrderDto dto, WarehouseContext context) =>
{
    using var transaction = await context.Database.BeginTransactionAsync();
    try
    {
        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
            Status = "Completed",
            Items = new List<OrderItem>()
        };

        decimal totalAmount = 0;

        foreach (var itemDto in dto.Items)
        {
            var product = await context.Products.FindAsync(itemDto.ProductId);
            if (product == null)
                return Results.BadRequest(new { message = $"Producto con ID {itemDto.ProductId} no existe." });

            if (product.StockQuantity < itemDto.Quantity)
                return Results.BadRequest(new { message = $"Stock insuficiente para el producto: {product.Name}. Stock actual: {product.StockQuantity}" });

            product.StockQuantity -= itemDto.Quantity;

            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                Quantity = itemDto.Quantity,
                UnitPrice = product.UnitPrice
            };

            totalAmount += product.UnitPrice * itemDto.Quantity;
            order.Items.Add(orderItem);
        }

        order.TotalAmount = totalAmount;
        context.Orders.Add(order);
        await context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Results.Created($"/api/orders/{order.Id}", order);
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
}).RequireAuthorization();

app.MapPost("/api/stock-entries", async (CreateStockEntryDto dto, WarehouseContext context) =>
{
    if (dto.Items is null || dto.Items.Count == 0)
        return Results.BadRequest(new { message = "Debes incluir al menos un producto." });

    await using var transaction = await context.Database.BeginTransactionAsync();
    try
    {
        var updatedProducts = new List<object>();

        foreach (var itemDto in dto.Items)
        {
            if (itemDto.Quantity <= 0)
                return Results.BadRequest(new { message = "La cantidad de entrada debe ser mayor a 0." });

            var product = await context.Products.FindAsync(itemDto.ProductId);
            if (product is null)
                return Results.BadRequest(new { message = $"Producto con ID {itemDto.ProductId} no existe." });

            var previousStock = product.StockQuantity;
            product.StockQuantity += itemDto.Quantity;

            updatedProducts.Add(new
            {
                product.Id,
                product.SKU,
                product.Name,
                previousStock,
                addedQuantity = itemDto.Quantity,
                newStock = product.StockQuantity
            });
        }

        await context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Results.Ok(new
        {
            message = "Entrada de stock registrada con Ã©xito.",
            reference = string.IsNullOrWhiteSpace(dto.Reference) ? null : dto.Reference.Trim(),
            items = updatedProducts
        });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        return Results.Problem(
            title: "Error al registrar entrada de stock",
            detail: ex.InnerException?.Message ?? ex.Message,
            statusCode: StatusCodes.Status500InternalServerError
        );
    }
}).RequireAuthorization();

app.Run();

// DTOs auxiliares
public record RegisterDto(string Username, string Email, string Password);
public record LoginDto(string Email, string Password);
public record CreateOrderDto(List<OrderItemDto> Items);
public record OrderItemDto(int ProductId, int Quantity);
public record CreateStockEntryDto(string? Reference, List<OrderItemDto> Items);
