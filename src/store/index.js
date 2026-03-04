import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import paymentReducer from './paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    payment: paymentReducer,
  },
});
