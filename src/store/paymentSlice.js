import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import apiClient from '../axiosClient';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createSnapToken = createAsyncThunk(
  'payment/createSnapToken',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/payments/snap/token', payload, {
        headers: authHeaders(getState().auth.token),
      });
      return data; // { token, redirect_url }
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchPaymentStatus = createAsyncThunk(
  'payment/fetchStatus',
  async (orderId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/payments/status/${orderId}`, {
        headers: authHeaders(getState().auth.token),
      });
      return data;
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    snapToken: null,
    redirectUrl: null,
    status: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPayment(state) {
      state.snapToken = null;
      state.redirectUrl = null;
      state.status = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSnapToken.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createSnapToken.fulfilled, (state, action) => {
        state.loading = false;
        state.snapToken = action.payload.token;
        state.redirectUrl = action.payload.redirect_url;
      })
      .addCase(createSnapToken.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(fetchPaymentStatus.pending, (state) => { state.loading = true; state.error = null; state.status = null; })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => { state.loading = false; state.status = action.payload; })
      .addCase(fetchPaymentStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
