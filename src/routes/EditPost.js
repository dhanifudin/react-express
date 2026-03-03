import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost, updatePost, clearCurrentPost } from '../store/postSlice';

export default function EditPost() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', body: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost: post, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPost(id)).unwrap()
      .then((data) => setForm({ title: data.title, body: data.body }))
      .catch((err) => {
        if (err?.expired) navigate('/login', { state: { expired: true } });
      });
    return () => dispatch(clearCurrentPost());
  }, [dispatch, id, navigate]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePost({ id, formData: form })).unwrap()
      .then(() => navigate(`/posts/${id}`))
      .catch((err) => {
        if (err?.expired) navigate('/login', { state: { expired: true } });
      });
  };

  return (
    <div>
      <p><Link to={`/posts/${id}`}>← Back to Post</Link></p>
      <h2>Edit Post</h2>

      {error && !error.expired && (
        <p style={{ color: 'red' }}>Error: {typeof error === 'string' ? error : 'Failed to update post.'}</p>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={form.title} onChange={set('title')} placeholder="Post title" required />
        <label>Body</label>
        <textarea value={form.body} onChange={set('body')} placeholder="Post body" rows={6} required />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to={`/posts/${id}`}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
