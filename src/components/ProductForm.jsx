import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductForm({
  onSubmit,
  initialData,
  buttonText = 'Guardar',
  isUpdate = false,
}) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUpdate && initialData) {
      setValue('name', initialData.name);
      setValue('brand', initialData.brand);
      setValue('model', initialData.model);
      setValue('sizes', initialData.sizes);
      setValue('description', initialData.description);
      setValue('price', parseFloat(initialData.price));
      setValue('stock', parseInt(initialData.stock));

    }
  }, [isUpdate, initialData, setValue])

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
    navigate('/products');
  });

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mb-20 border border-gray-200 dark:border-gray-700">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-6 items-center text-gray-700"
      >
        <input
          type="text"
          placeholder="Nombre"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          {...register('name', { required: 'El nombre es obligatorio' })}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        <input
          type="text"
          placeholder="Marca"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          {...register('brand', { required: 'La marca es obligatoria' })}
        />
        {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}

        <input
          type="text"
          placeholder="Modelo"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          {...register('model')}
        />

        <input
          type="text"
          placeholder="Medidas"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          {...register('sizes')}
        />

        {errors.price && <span className="text-red-500">{errors.price.message}</span>}

        <textarea
          placeholder="Descripción"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows="4"
          {...register('description')}
        />
        <input
          type="number"
          placeholder="Precio"
          step="0.01"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          {...register('price', {
            required: 'El precio es obligatorio',
            valueAsNumber: true
          })}
        />

        <input
          type="number"
          placeholder="Stock"
          step="0.01"
          className="w-full md:w-1/2 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          {...register('stock', {
            required: 'El stock es obligatorio',
            valueAsNumber: true
          })}
        />
        <div className="w-full md:w-1/2 flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-linear-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {buttonText}
          </button>
          <button
            type="button"
            className="flex-1 bg-linear-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white font-semibold py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => navigate('/products')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
