import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import apiClient from '../axiosClient';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchPosts = createAsyncThunk(
  'posts/fetchAll',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/posts', {
        headers: authHeaders(getState().auth.token),
      });
      return data;
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchOne',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/posts/${id}`, {
        headers: authHeaders(getState().auth.token),
      });
      return data;
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (formData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/posts', formData, {
        headers: authHeaders(getState().auth.token),
      });
      return data;
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/posts/${id}`, formData, {
        headers: authHeaders(getState().auth.token),
      });
      return data;
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      await apiClient.delete(`/posts/${id}`, {
        headers: authHeaders(getState().auth.token),
      });
      return id;
    } catch (err) {
      if (err.response?.status === 401) { dispatch(logout()); return rejectWithValue({ expired: true }); }
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPost(state) {
      state.currentPost = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPosts
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // fetchPost
    builder
      .addCase(fetchPost.pending, (state) => { state.loading = true; state.error = null; state.currentPost = null; })
      .addCase(fetchPost.fulfilled, (state, action) => { state.loading = false; state.currentPost = action.payload; })
      .addCase(fetchPost.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // createPost
    builder
      .addCase(createPost.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPost.fulfilled, (state, action) => { state.loading = false; state.posts.unshift(action.payload); })
      .addCase(createPost.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // updatePost
    builder
      .addCase(updatePost.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        const idx = state.posts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.posts[idx] = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // deletePost
    builder
      .addCase(deletePost.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((p) => p._id !== action.payload);
        state.currentPost = null;
      })
      .addCase(deletePost.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrentPost, clearError } = postSlice.actions;
export default postSlice.reducer;
