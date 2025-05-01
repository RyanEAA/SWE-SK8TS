// CreateProductPopup.jsx
import React, { useState } from 'react';
import '../../../css/admin/CreateUserPopup.css'; // reuse same modal styles

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
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('https://sk8ts-shop.com/api/createproduct', {
        // const response = await fetch('http://localhost:3636/createproduct', {

        method: 'POST',
        body: formData
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
            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="popup-buttons">
            <button type="submit" className="btn btn-green">Create</button>
            <button type="button" className="btn btn-red" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductPopup;