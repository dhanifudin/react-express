import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('jwt') || null,
    user: JSON.parse(localStorage.getItem('jwt_user') || 'null'),
  },
  reducers: {
    login(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem('jwt', token);
      localStorage.setItem('jwt_user', JSON.stringify(user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('jwt');
      localStorage.removeItem('jwt_user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
