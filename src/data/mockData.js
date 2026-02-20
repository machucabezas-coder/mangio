export const mockGastos = [
  { id: 1, monto: 15000, descripcion: 'Campaña Facebook Ads', categoria: 'Publicidad', fecha: '2024-01-10', registrado_por: 'Socio 1' },
  { id: 2, monto: 8500, descripcion: 'Compra de cajas y bolsas', categoria: 'Embalaje', fecha: '2024-01-15', registrado_por: 'Socio 2' },
  { id: 3, monto: 25000, descripcion: 'Diseño de logo y branding', categoria: 'Diseño', fecha: '2024-01-20', registrado_por: 'Socio 1' },
  { id: 4, monto: 12000, descripcion: 'Envíos enero', categoria: 'Logística', fecha: '2024-01-28', registrado_por: 'Socio 2' },
  { id: 5, monto: 3200, descripcion: 'Útiles de oficina', categoria: 'Microgastos', fecha: '2024-02-03', registrado_por: 'Socio 1' },
  { id: 6, monto: 18000, descripcion: 'Campaña Instagram Ads', categoria: 'Publicidad', fecha: '2024-02-10', registrado_por: 'Socio 2' },
  { id: 7, monto: 9800, descripcion: 'Cajas especiales', categoria: 'Embalaje', fecha: '2024-02-14', registrado_por: 'Socio 1' },
  { id: 8, monto: 14500, descripcion: 'Envíos febrero', categoria: 'Logística', fecha: '2024-02-25', registrado_por: 'Socio 2' },
  { id: 9, monto: 5000, descripcion: 'Suscripciones SaaS', categoria: 'Microgastos', fecha: '2024-03-01', registrado_por: 'Socio 1' },
  { id: 10, monto: 22000, descripcion: 'Rediseño web', categoria: 'Diseño', fecha: '2024-03-08', registrado_por: 'Socio 2' },
  { id: 11, monto: 16000, descripcion: 'Google Ads', categoria: 'Publicidad', fecha: '2024-03-15', registrado_por: 'Socio 1' },
  { id: 12, monto: 11000, descripcion: 'Envíos marzo', categoria: 'Logística', fecha: '2024-03-28', registrado_por: 'Socio 2' },
]

export const mockIngresos = [
  { id: 1, monto: 85000, descripcion: 'Ventas enero Shopify', categoria: 'Ventas online', fecha: '2024-01-31', fuente: 'Shopify' },
  { id: 2, monto: 42000, descripcion: 'Ventas enero ML', categoria: 'Marketplace', fecha: '2024-01-31', fuente: 'Mercado Libre' },
  { id: 3, monto: 15000, descripcion: 'Venta mayorista', categoria: 'Ventas B2B', fecha: '2024-01-25', fuente: 'Manual' },
  { id: 4, monto: 92000, descripcion: 'Ventas febrero Shopify', categoria: 'Ventas online', fecha: '2024-02-29', fuente: 'Shopify' },
  { id: 5, monto: 51000, descripcion: 'Ventas febrero ML', categoria: 'Marketplace', fecha: '2024-02-29', fuente: 'Mercado Libre' },
  { id: 6, monto: 8000, descripcion: 'Consultoría', categoria: 'Servicios', fecha: '2024-02-20', fuente: 'Manual' },
  { id: 7, monto: 78000, descripcion: 'Ventas marzo Shopify', categoria: 'Ventas online', fecha: '2024-03-31', fuente: 'Shopify' },
  { id: 8, monto: 63000, descripcion: 'Ventas marzo ML', categoria: 'Marketplace', fecha: '2024-03-31', fuente: 'Mercado Libre' },
  { id: 9, monto: 20000, descripcion: 'Venta mayorista', categoria: 'Ventas B2B', fecha: '2024-03-18', fuente: 'Manual' },
]

export const mockMonthlyData = [
  { mes: 'Oct', ingresos: 95000, gastos: 42000 },
  { mes: 'Nov', ingresos: 112000, gastos: 55000 },
  { mes: 'Dic', ingresos: 145000, gastos: 68000 },
  { mes: 'Ene', ingresos: 142000, gastos: 58700 },
  { mes: 'Feb', ingresos: 151000, gastos: 47300 },
  { mes: 'Mar', ingresos: 161000, gastos: 54000 },
]

export const categoryColors = {
  Publicidad: '#818cf8',
  Embalaje: '#34d399',
  Diseño: '#f59e0b',
  Logística: '#60a5fa',
  Microgastos: '#f87171',
}

export const fuenteColors = {
  Shopify: '#34d399',
  'Mercado Libre': '#60a5fa',
  Manual: '#f59e0b',
}
