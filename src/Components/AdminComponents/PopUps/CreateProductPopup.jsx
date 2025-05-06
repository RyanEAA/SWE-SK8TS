import React, { useState } from 'react';
import '../../../css/admin/Admin.css'; // Reuse styles from Admin.css

function CreateProductPopup({ onClose, onProductCreated }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    description: '',
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
  const [message, setMessage] = useState('');
  const [customizationInput, setCustomizationInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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
        onProductCreated();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setMessage('Error creating product');
    }
  };

  return (
    <div className="product-edit-popup-overlay">
      <div className="product-edit-popup-content">
        <h2>Create Product</h2>
        {message && <p className="popup-message">{message}</p>}
        <form onSubmit={handleSubmit} className="popup-form" encType="multipart/form-data">
          <div className="product-edit-form-columns">
            <div className="product-edit-form-left">
              {[
                { label: 'Name*', name: 'name', type: 'text', required: true },
                { label: 'Price*', name: 'price', type: 'number', min: 0.01, step: 'any', required: true },
                { label: 'Stock Quantity*', name: 'stock_quantity', type: 'number', min: 0, required: true },
                { label: 'Description*', name: 'description', type: 'textarea', required: true },
                { label: 'Category ID', name: 'category_id', type: 'text' },
                { label: 'Brand ID', name: 'brand_id', type: 'text' },
                { label: 'SKU', name: 'sku', type: 'text' },
                { label: 'Weight', name: 'weight', type: 'text' },
                { label: 'Dimensions', name: 'dimensions', type: 'text' },
                { label: 'Color', name: 'color', type: 'text' },
                { label: 'Size', name: 'size', type: 'text' },
              ].map((field) => (
                <div className="product-edit-form-group" key={field.name}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      min={field.min}
                      step={field.step}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="product-edit-form-right">
              <div className="product-edit-customization-section">
                <h3>Customizations</h3>
                <div className="product-edit-customizations-list">
                  {form.customizations.map((customization, index) => (
                    <div key={index} className="product-edit-customization-item">
                      <span>{customization}</span>
                      <button
                        type="button"
                        className="btn btn-red btn-small"
                        onClick={() => handleRemoveCustomization(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="product-edit-customization-input">
                  <input
                    type="text"
                    value={customizationInput}
                    onChange={(e) => setCustomizationInput(e.target.value)}
                    placeholder="Add a customization"
                  />
                  <button
                    type="button"
                    className="btn btn-green btn-small"
                    onClick={handleAddCustomization}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>

              <div className="form-group">
                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <div className="product-edit-popup-buttons">
            <button type="submit" className="btn btn-green">
              Create
            </button>
            <button type="button" className="btn btn-red" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductPopup;