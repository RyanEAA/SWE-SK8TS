import React, { useState } from 'react';
import '../../../css/buttons.css'; // Ensure the CSS file is imported

function EditProductPopup({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock_quantity: product.stock_quantity,
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

  const [customizationInput, setCustomizationInput] = useState('');
  const [editingCustomizationIndex, setEditingCustomizationIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const handleEditCustomization = (index) => {
    setCustomizationInput(form.customizations[index]);
    setEditingCustomizationIndex(index);
  };

  const handleSaveCustomizationEdit = () => {
    if (customizationInput.trim()) {
      setForm((prev) => {
        const updatedCustomizations = [...prev.customizations];
        updatedCustomizations[editingCustomizationIndex] = customizationInput.trim();
        return { ...prev, customizations: updatedCustomizations };
      });
      setCustomizationInput('');
      setEditingCustomizationIndex(null);
    }
  };

  const handleRemoveCustomization = (index) => {
    setForm((prev) => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Product</h2>
        <form className="popup-form">
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Price', name: 'price', type: 'number' },
            { label: 'Stock Quantity', name: 'stock_quantity', type: 'number' },
            { label: 'Description', name: 'description', type: 'text' },
            { label: 'Category ID', name: 'category_id', type: 'text' },
            { label: 'Brand ID', name: 'brand_id', type: 'text' },
            { label: 'SKU', name: 'sku', type: 'text' },
            { label: 'Weight', name: 'weight', type: 'text' },
            { label: 'Dimensions', name: 'dimensions', type: 'text' },
            { label: 'Color', name: 'color', type: 'text' },
            { label: 'Size', name: 'size', type: 'text' },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div className="form-group">
            <label>Customizations:</label>
            <div className="customizations-list">
              {form.customizations.length > 0 ? (
                form.customizations.map((customization, index) => (
                  <div key={index} className="customization-item">
                    <span>{customization}</span>
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
                ))
              ) : (
                <p>No customizations available.</p>
              )}
            </div>
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

          <div className="popup-buttons">
            <button type="button" className="btn btn-green" onClick={handleSave}>
              Save
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

export default EditProductPopup;