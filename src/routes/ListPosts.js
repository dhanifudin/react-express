import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, deletePost } from '../store/postSlice';

export default function ListPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPosts()).unwrap().catch((err) => {
      if (err?.expired) navigate('/login', { state: { expired: true } });
    });
  }, [dispatch, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    dispatch(deletePost(id)).unwrap().catch((err) => {
      if (err?.expired) navigate('/login', { state: { expired: true } });
      else alert(err || 'Failed to delete post.');
    });
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>Posts</h2>

      {error && !error.expired && <p>Error: {typeof error === 'string' ? error : 'Something went wrong.'}</p>}

      {posts.length === 0 && !error && (
        <p>
          No posts yet.{' '}
          {isAuthenticated
            ? <Link to="/posts/new">Create one.</Link>
            : <Link to="/login">Sign in to create one.</Link>}
        </p>
      )}

      {posts.map((post) => {
        const isOwner = isAuthenticated && post.author?._id === user?._id;
        return (
          <div key={post._id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
            <h3>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </h3>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>
              by {post.author?.name || post.author}
            </p>
            <p style={{ marginTop: '4px' }}>{post.body}</p>
            {isOwner && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className="btn-secondary" onClick={() => navigate(`/posts/${post._id}/edit`)}>Edit</button>
                <button className="btn-danger" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
