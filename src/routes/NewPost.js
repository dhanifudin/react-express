import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/postSlice';

export default function NewPost() {
  const [form, setForm] = useState({ title: '', body: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.posts);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost(form)).unwrap()
      .then((post) => navigate(`/posts/${post._id}`))
      .catch((err) => {
        if (err?.expired) navigate('/login', { state: { expired: true } });
      });
  };

  return (
    <div>
      <p><Link to="/posts">← Back to Posts</Link></p>
      <h2>New Post</h2>

      {error && !error.expired && (
        <p style={{ color: 'red' }}>Error: {typeof error === 'string' ? error : 'Failed to create post.'}</p>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={form.title} onChange={set('title')} placeholder="Post title" required />
        <label>Body</label>
        <textarea value={form.body} onChange={set('body')} placeholder="Write your post…" rows={6} required />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Publishing…' : 'Publish'}
          </button>
          <Link to="/posts">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
