import React, { useState } from 'react';
import '../../../css/buttons.css';

function EditProductPopup({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name || '',
    price: product.price !== undefined ? parseFloat(product.price) : '',
    stock_quantity: parseInt(product.stock_quantity) || 0,
    description: product.description || '',
    category_id: product.category_id || '',
    brand_id: product.brand_id || '',
    sku: product.sku || '',
    weight: product.weight || '',
    dimensions: product.dimensions || '',
    color: product.color || '',
    size: product.size || '',
    status: product.status || 'active',
    customizations: Array.isArray(product.customizations) ? product.customizations : [],
  });

  const [errors, setErrors] = useState({});
  const [customizationInput, setCustomizationInput] = useState('');
  const [editingCustomizationIndex, setEditingCustomizationIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (form.price === '' || form.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (form.stock_quantity < 0) newErrors.stock_quantity = 'Stock cannot be negative';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      if (value === '' || !isNaN(value)) {
        setForm(prev => ({ 
          ...prev, 
          [name]: value === '' ? '' : parseFloat(value) 
        }));
      }
    } else if (name === 'stock_quantity') {
      setForm(prev => ({ 
        ...prev, 
        [name]: parseInt(value) || 0 
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddCustomization = () => {
    if (customizationInput.trim()) {
      setForm(prev => ({
        ...prev,
        customizations: [...prev.customizations, customizationInput.trim()],
      }));
      setCustomizationInput('');
    }
  };

  const handleEditCustomization = (index) => {
    setCustomizationInput(form.customizations[index]);
    setEditingCustomizationIndex(index);
  };

  const handleSaveCustomizationEdit = () => {
    if (customizationInput.trim()) {
      setForm(prev => {
        const updatedCustomizations = [...prev.customizations];
        updatedCustomizations[editingCustomizationIndex] = customizationInput.trim();
        return { ...prev, customizations: updatedCustomizations };
      });
      setCustomizationInput('');
      setEditingCustomizationIndex(null);
    }
  };

  const handleRemoveCustomization = (index) => {
    setForm(prev => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(form);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Deleting product:', product);
      const response = await fetch(`https://sk8ts-shop.com/api/products/${product.product_id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Product deleted successfully');
        setShowDeleteConfirm(false);
        onClose(); // Close the edit popup
        if (onProductDeleted) {
          onProductDeleted(); // Refresh the product list
        }
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const fields = [
    { label: 'Name*', name: 'name', type: 'text', required: true },
    { label: 'Price*', name: 'price', type: 'number', min: 0.01, step: 'any', required: true },
    { label: 'Stock Quantity*', name: 'stock_quantity', type: 'number', min: 0, required: true },
    { label: 'Description*', name: 'description', type: 'text', required: true },
    { label: 'Category ID', name: 'category_id', type: 'text' },
    { label: 'Brand ID', name: 'brand_id', type: 'text' },
    { label: 'SKU', name: 'sku', type: 'text' },
    { label: 'Weight', name: 'weight', type: 'text' },
    { label: 'Dimensions', name: 'dimensions', type: 'text' },
    { label: 'Color', name: 'color', type: 'text' },
    { label: 'Size', name: 'size', type: 'text' },
  ];

  return (
    <div className="product-edit-popup-overlay">
      <div className="product-edit-popup-content">
        <h2>Edit Product</h2>
        <div className="product-edit-form-columns">
          <div className="product-edit-form-left">
            {fields.map((field) => (
              <div className="product-edit-form-group" key={field.name}>
                <label>{field.label}</label>
                {field.name === 'status' ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                ) : field.name === 'description' ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleInputChange}
                    required={field.required}
                    className="product-edit-description-textarea"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleInputChange}
                    min={field.min}
                    step={field.step}
                    required={field.required}
                  />
                )}
                {errors[field.name] && (
                  <span className="product-edit-error-message">{errors[field.name]}</span>
                )}
              </div>
            ))}
          </div>
  
          <div className="product-edit-form-right">
            <div className="product-edit-customization-section">
              <h3>Customizations</h3>
              <div className="product-edit-customizations-list">
                {form.customizations.length > 0 ? (
                  form.customizations.map((customization, index) => (
                    <div key={index} className="product-edit-customization-item">
                      <span>{customization}</span>
                      <div className="product-edit-customization-actions">
                        <button
                          type="button"
                          className="btn btn-tab btn-small"
                          onClick={() => handleEditCustomization(index)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-red btn-small"
                          onClick={() => handleRemoveCustomization(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No customizations available.</p>
                )}
              </div>
              <div className="product-edit-customization-input">
                <input
                  type="text"
                  value={customizationInput}
                  onChange={(e) => setCustomizationInput(e.target.value)}
                  placeholder="Add or edit a customization"
                />
                {editingCustomizationIndex !== null ? (
                  <button
                    type="button"
                    className="btn btn-blue btn-small"
                    onClick={handleSaveCustomizationEdit}
                  >
                    Save Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-green btn-small"
                    onClick={handleAddCustomization}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
  
            <div className="product-edit-popup-buttons">
              <button type="button" className="btn btn-green" onClick={handleSave}>
                Save Changes
              </button>
              <button type="button" className="btn btn-red" onClick={handleDeleteClick}>
                Delete Product
              </button>
              <button type="button" className="btn btn-gray" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
  
        {showDeleteConfirm && (
          <div className="product-edit-confirm-popup">
            <div className="product-edit-confirm-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this product?</p>
              <div className="product-edit-confirm-buttons">
                <button className="btn btn-red" onClick={handleConfirmDelete}>
                  Yes, Delete
                </button>
                <button className="btn btn-gray" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProductPopup;