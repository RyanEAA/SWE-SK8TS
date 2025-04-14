

import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProductManagement.css';
import '../css/admin/Admin.css';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(null); // Track which product is being edited
    const [editedProduct, setEditedProduct] = useState({}); // Store the edited product details
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const userRole = Cookies.get('user_role');
                
                if (!userRole || (userRole !== 'admin')) {
                    navigate('/profile');
                    return;
                }

                setIsLoading(true);

                const response = await axios.get(`https://sk8ts-shop.com/api/products`);
                
                if (response.status === 200 && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllProducts();
    }, [navigate]);

    const handleEditClick = (product) => {
        console.log('Editing product:', product);
        setIsEditing(product.product_id); // Set the product ID being edited
        setEditedProduct({
            name: product.name,
            price: product.price,
            stock: product.stock_quantity, // Map stock_quantity to stock
        }); // Populate the form with the product's current details
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value }); // Update the edited product details
    };

    const handleSaveClick = async () => {
        editedProduct.stock = parseInt(editedProduct.stock, 10); // Ensure stock is an integer
        console.log('Saving product:', isEditing);
        console.log('Saving product:', editedProduct);
        try {
            const response = await axios.put(
                `https://sk8ts-shop.com/api/products/${isEditing}`,
                editedProduct,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert('Product updated successfully');
                setProducts(products.map((product) =>
                    product.product_id === isEditing
                        ? { ...product, ...editedProduct, stock_quantity: editedProduct.stock } // Update stock_quantity
                        : product
                ));
                setIsEditing(null); // Exit edit mode
                window.location.reload()
            } else {
                alert('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again later.');
        }
    };

    return (
        <>
            <div className='admin-section top-left claimed-orders-container'>
                <h1>Product Management</h1>
                {isLoading ? (
                    <p>Loading products...</p>
                ) : (
                    <>
                        <div className='products-headers'>
                            <div className='product-name'>Name</div>
                            <div className='product-price'>Price</div>
                            <div className='product-stock'>Stock Quantity</div>
                            <div className='product-actions'>Actions</div>
                        </div>
                        <div className='scrollable-list'>
                            {products.map((product) => (
                                <div key={product.product_id} className='products-container'>
                                    {isEditing === product.product_id ? (
                                        <>
                                            <input
                                                type='text'
                                                name='name'
                                                value={editedProduct.name}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type='number'
                                                name='price'
                                                value={editedProduct.price}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type='number'
                                                name='stock'
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