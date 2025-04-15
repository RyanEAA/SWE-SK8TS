// src/Pages/ProductManagement.jsx
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProductManagement.css';
import '../css/admin/Admin.css';
import CreateProductPopup from '../Components/AdminComponents/PopUps/CreateProductPopup';
import '../css/buttons.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateProductPopup, setShowCreateProductPopup] = useState(false);
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const userRole = Cookies.get('user_role');
      if (!userRole || userRole !== 'admin') {
        navigate('/profile');
        return;
      }

      const response = await axios.get(`https://sk8ts-shop.com/api/products`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [navigate]);

  const handleEditClick = (product) => {
    setIsEditing(product.product_id);
    setEditedProduct({
      name: product.name,
      price: product.price,
      stock: product.stock_quantity,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `https://sk8ts-shop.com/api/products/${isEditing}`,
        {
          name: editedProduct.name,
          price: parseFloat(editedProduct.price),
          stock: parseInt(editedProduct.stock),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        alert('✅ Product updated!');
        setProducts(products.map(p =>
          p.product_id === isEditing
            ? { ...p, ...editedProduct, stock_quantity: editedProduct.stock }
            : p
        ));
        setIsEditing(null);
      } else {
        alert('❌ Failed to update product');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating product');
    }
  };

  return (
    <>
      <div className='admin-section top-left claimed-orders-container'>
        <h1>Product Management</h1>
        <button className="btn btn-green" onClick={() => setShowCreateProductPopup(true)}>
          Create Product
        </button>

        {showCreateProductPopup && (
          <CreateProductPopup
            onClose={() => setShowCreateProductPopup(false)}
            onProductCreated={() => {
              fetchAllProducts();
              setShowCreateProductPopup(false);
            }}
          />
        )}

        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <>
            <div className='products-headers'>
              <div className='product-name'>Name</div>
              <div className='product-price'>Price</div>
              <div className='product-stock'>Stock</div>
              <div className='product-actions'>Actions</div>
            </div>

            <div className='scrollable-list'>
              {products.map(product => (
                <div key={product.product_id} className='products-container scrollable-list'>
                  {isEditing === product.product_id ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={editedProduct.name}
                        onChange={handleInputChange}
                      />
                      <input
                        type="number"
                        name="price"
                        value={editedProduct.price}
                        onChange={handleInputChange}
                      />
                      <input
                        type="number"
                        name="stock"
                        value={editedProduct.stock}
                        onChange={handleInputChange}
                      />
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={() => setIsEditing(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <div>{product.name}</div>
                      <div>${product.price.toFixed(2)}</div>
                      <div>{product.stock_quantity}</div>
                      <button onClick={() => handleEditClick(product)}>Edit</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProductManagement;
