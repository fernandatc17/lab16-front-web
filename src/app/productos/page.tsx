'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Iconos SVG simples
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ProductIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (codProducto) => {
    const confirmar = confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmar) return;

    try {
      setDeleting(codProducto);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos/${codProducto}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        alert('Producto eliminado exitosamente');
        fetchProductos();
      } else {
        const data = await res.json();
        alert('Error al eliminar: ' + data.message);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ProductIcon className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          </div>
          <p className="text-gray-600">Administra tu inventario de productos de manera eficiente</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{productos.length}</span>
            <span>productos registrados</span>
          </div>
          
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => router.push('/productos/new')}
          >
            <PlusIcon />
            Agregar Producto
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : productos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ProductIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
              <p className="text-gray-500 mb-6">Comienza agregando tu primer producto al inventario</p>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                onClick={() => router.push('/productos/new')}
              >
                <PlusIcon />
                Agregar Primer Producto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productos.map((prod, index) => (
                    <tr 
                      key={prod.codProducto} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-600">
                              {prod.codProducto}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {prod.codProducto}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prod.nomPro}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatPrice(prod.precioProducto)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prod.stockProducto > 10 
                            ? 'bg-green-100 text-green-800' 
                            : prod.stockProducto > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prod.stockProducto} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/productos/${prod.codProducto}/edit`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium rounded-md transition-colors duration-150"
                          >
                            <EditIcon />
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(prod.codProducto)}
                            disabled={deleting === prod.codProducto}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting === prod.codProducto ? (
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></div>
                            ) : (
                              <TrashIcon />
                            )}
                            {deleting === prod.codProducto ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        {productos.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
            <div>
              Mostrando {productos.length} productos
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Stock alto (+10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Stock bajo (1-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Sin stock</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}