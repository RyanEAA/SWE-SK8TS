import React, { useState } from 'react';
import '../../../css/admin/CreateUserPopup.css';

function CreateProductPopup({ onClose, onProductCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    brand_id: '',
    sku: '',
    weight: '',
    dimensions: '',
    color: '',
    size: '',
    status: 'active',
    customizations: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [customizationInput, setCustomizationInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCustomization = () => {
    if (customizationInput.trim()) {
      setForm((prev) => ({
        ...prev,
        customizations: [...prev.customizations, customizationInput.trim()],
      }));
      setCustomizationInput('');
    }
  };

  const handleRemoveCustomization = (index) => {
    setForm((prev) => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      if (key === 'customizations') {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('https://sk8ts-shop.com/api/createproduct', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to create product.');
      } else {
        setMessage('Product created successfully!');
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview); // Clean up the preview URL
        }
        onProductCreated();
        onClose();
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setMessage('Error creating product');
    }
  };

  // Clean up image preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create New Product</h2>
        {message && <p className="popup-message">{message}</p>}
        <form onSubmit={handleSubmit} className="popup-form" encType="multipart/form-data">
          {[
            'name', 'description', 'price', 'stock_quantity', 'category_id',
            'brand_id', 'sku', 'weight', 'dimensions', 'color', 'size'
          ].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace('_', ' ')}:</label>
              <input
                type={field === 'description' ? 'textarea' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={field === 'name' || field === 'price' || field === 'stock_quantity'}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div className="form-group">
            <label>Customizations:</label>
            <div className="customizations-list">
              {form.customizations.map((customization, index) => (
                <div key={index} className="customization-item">
                  {customization}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCustomization(index)}
                    className="btn btn-red btn-small"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="customization-input-group">
              <input
                type="text"
                value={customizationInput}
                onChange={(e) => setCustomizationInput(e.target.value)}
                placeholder="Add a customization"
              />
              <button 
                type="button" 
                onClick={handleAddCustomization}
                className="btn btn-blue"
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', marginTop: '10px' }} 
                />
              </div>
            )}
          </div>

          <div className="popup-buttons">
            <button type="submit" className="btn btn-green">Create</button>
            <button 
              type="button" 
              className="btn btn-red" 
              onClick={() => {
                if (imagePreview) {
                  URL.revokeObjectURL(imagePreview);
                }
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductPopup;