import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/authSlice';
import apiClient from './axiosClient';

export function useApi() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function apiFetch(path, { method = 'GET', data } = {}) {
    try {
      return await apiClient({
        url: path,
        method,
        data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(logout());
        navigate('/login', { state: { expired: true } });
        throw new Error('Session expired');
      }
      throw err;
    }
  }

  return { apiFetch };
}
