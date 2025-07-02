'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProducto } from '../../../../lib/api';

// Iconos SVG
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const InventoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function CrearProducto() {
  const router = useRouter();
  const [form, setForm] = useState({ nomPro: '', precioProducto: '', stockProducto: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validación de campos
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nomPro.trim()) {
      newErrors.nomPro = 'El nombre del producto es obligatorio';
    } else if (form.nomPro.length < 2) {
      newErrors.nomPro = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!form.precioProducto) {
      newErrors.precioProducto = 'El precio es obligatorio';
    } else if (parseFloat(form.precioProducto) <= 0) {
      newErrors.precioProducto = 'El precio debe ser mayor a 0';
    }
    
    if (!form.stockProducto) {
      newErrors.stockProducto = 'El stock es obligatorio';
    } else if (parseInt(form.stockProducto) < 0) {
      newErrors.stockProducto = 'El stock no puede ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await createProducto({ 
        ...form, 
        precioProducto: parseFloat(form.precioProducto),
        stockProducto: parseInt(form.stockProducto)
      });
      
      // Pequeño delay para mostrar feedback positivo
      setTimeout(() => {
        router.push('/productos');
      }, 500);
      
    } catch (error) {
      console.error('Error al crear producto:', error);
      setErrors({ submit: 'Error al crear el producto. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/productos')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftIcon />
            <span className="text-sm font-medium">Volver a productos</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <PackageIcon className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
          </div>
          <p className="text-gray-600">Completa la información para agregar un nuevo producto al inventario</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            
            {/* Error general */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="text-red-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campo Nombre */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <TagIcon />
                Nombre del Producto
              </label>
              <input 
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.nomPro ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: Laptop Dell XPS 13"
                value={form.nomPro}
                onChange={e => handleInputChange('nomPro', e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              {errors.nomPro && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nomPro}
                </p>
              )}
            </div>

            {/* Campo Precio */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CurrencyIcon />
                Precio Unitario
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.precioProducto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  value={form.precioProducto}
                  onChange={e => handleInputChange('precioProducto', e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
              {errors.precioProducto && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.precioProducto}
                </p>
              )}
            </div>

            {/* Campo Stock */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <InventoryIcon />
                Stock Inicial
              </label>
              <input 
                type="number"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.stockProducto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Cantidad en inventario"
                value={form.stockProducto}
                onChange={e => handleInputChange('stockProducto', e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              {errors.stockProducto && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.stockProducto}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/productos')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingIcon />
                    Creando Producto...
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    Crear Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Consejos para crear productos
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <div>
                  • Usa nombres descriptivos y únicos para tus productos<br/>
                  • El precio puede tener hasta 2 decimales<br/>
                  • El stock inicial se puede modificar posteriormente<br/>
                  • Presiona Enter para crear el producto rápidamente
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}