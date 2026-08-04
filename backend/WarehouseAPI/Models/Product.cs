namespace WarehouseAPI.Models;

public class Product
{
    public int Id { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int StockQuantity { get; set; }
    public int MinimumStockAlert { get; set; } = 5; // Regla de negocio: Alerta de stock crítico
    
    public int SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
}