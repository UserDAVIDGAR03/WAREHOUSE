import toast from 'react-hot-toast';

export const exportProductsToCSV = (products) => {
  if (!products || products.length === 0) {
    toast.error('No hay datos para exportar');
    return;
  }

  const headers = ['SKU', 'Nombre', 'Proveedor', 'Precio Unitario', 'Stock', 'Min Alerta'];
  const rows = products.map((p) => [
    p.sku,
    `"${p.name}"`,
    `"${p.supplier?.name || p.supplierId}"`,
    p.unitPrice,
    p.stockQuantity,
    p.minimumStockAlert,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `inventario_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success('Reporte CSV descargado');
};