import { createSlice } from '@reduxjs/toolkit';

// make api call to database to fetch product info

const initialState = {
    items: []
};

// an item has
// product_id
// pricePerUnit
// quantity

// define the cart slice
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.product_id === newItem.product_id);
            const maxQuantity = action.payload.maxQuantity;


            // if the item is not in the cart, add it
            if(!existingItem) {
                state.items.push({
                    ...newItem
                });
            }
            // if the item is in the cart, update the quantity
            else if (existingItem && (existingItem.quantity + newItem.quantity) < maxQuantity) {
                existingItem.quantity += newItem.quantity;
                existingItem.price = newItem.price;

            }
            else {
                existingItem.quantity = maxQuantity;
            }

        },
        removeItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.product_id === id);
          
            if (existingItem) {
              existingItem.quantity -= 1; // Always decrement the quantity
          
              // Remove the item if the quantity becomes 0
              if (existingItem.quantity === 0) {
                state.items = state.items.filter(item => item.product_id !== id);
              }
            }
          },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

// export actions
export const {addItem, removeItem, clearCart} = cartSlice.actions;

// export the reducer
export default cartSlice.reducer;