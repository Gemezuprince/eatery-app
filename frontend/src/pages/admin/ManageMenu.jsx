import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { uploadImage } from '../../utils/uploadImage';

const categories = [
  'Main meals',
  'Protein & sides',
  'Drinks & beverages',
  'Desserts & snacks',
];

function ManageMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/menu/admin');
      setItems(response.data.data.items);
    } catch (err) {
      setError('Could not load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddForm = () => {
    setEditingItem(null);
    reset({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true,
    });
    setImagePreview('');
    setImageUrl('');
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable,
    });
    setImagePreview(item.image || '');
    setImageUrl(item.image || '');
    setFormError('');
    setShowForm(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setFormError('');

    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setFormError('Image upload failed. Please try again.');
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setFormError('');
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        image: imageUrl,
        isAvailable: data.isAvailable === true || data.isAvailable === 'true',
      };

      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, payload);
      } else {
        await api.post('/menu', payload);
      }

      setShowForm(false);
      fetchItems();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save menu item.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Manage Menu</h1>
        <button
          onClick={openAddForm}
          className="bg-brand-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-brand-primary-100"
        >
          + Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-brand-dark mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>

          {formError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Price (₦)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">Description</label>
              <textarea
                rows="2"
                {...register('description', { required: 'Description is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Photo <span className="text-brand-dark-300">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 text-sm"
              />
              {uploading && <p className="text-xs text-brand-dark-300 mt-1">Uploading...</p>}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg mt-2"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                {...register('isAvailable')}
                className="w-4 h-4"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-brand-dark">
                Available for order
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="bg-brand-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white border border-brand-dark-400 text-brand-dark px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-brand-dark-200">Loading menu items...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-light-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-brand-dark">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-brand-dark">Category</th>
                <th className="px-4 py-3 text-sm font-semibold text-brand-dark">Price</th>
                <th className="px-4 py-3 text-sm font-semibold text-brand-dark">Available</th>
                <th className="px-4 py-3 text-sm font-semibold text-brand-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-brand-light-200">
                  <td className="px-4 py-3 font-medium text-brand-dark">{item.name}</td>
                  <td className="px-4 py-3 text-brand-dark-200">{item.category}</td>
                  <td className="px-4 py-3 text-brand-dark-200">₦{item.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isAvailable
                          ? 'bg-brand-secondary-400 text-brand-secondary'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.isAvailable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => openEditForm(item)}
                      className="text-brand-primary font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageMenu;
