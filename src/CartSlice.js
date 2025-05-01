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
            const existingItem = state.items.find(
                item => item.product_id === newItem.product_id && item.customizations === newItem.customizations
            );
            const maxQuantity = newItem.maxQuantity;
        
            if (!existingItem) {
                state.items.push({ ...newItem });
            } else if (existingItem.quantity + newItem.quantity <= maxQuantity) {
                existingItem.quantity += newItem.quantity;
            } else {
                existingItem.quantity = maxQuantity;
            }
        },
        removeItem: (state, action) => {
            const { product_id, customizations } = action.payload;
            const existingItem = state.items.find(
                item => item.product_id === product_id && item.customizations === customizations
            );
        
            if (existingItem) {
                existingItem.quantity -= 1;
                if (existingItem.quantity === 0) {
                    state.items = state.items.filter(
                        item => !(item.product_id === product_id && item.customizations === customizations)
                    );
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