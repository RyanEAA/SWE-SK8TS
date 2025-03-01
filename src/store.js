import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './CartSlice.js';

// create store (aka database for rest of app)
export const store = configureStore({
    reducer: {
        cart: cartReducer,
    }
});
// export store
export default store;