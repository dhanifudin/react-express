import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost, deletePost, clearCurrentPost } from '../store/postSlice';

export default function ViewPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost: post, loading, error } = useSelector((state) => state.posts);
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPost(id)).unwrap().catch((err) => {
      if (err?.expired) navigate('/login', { state: { expired: true } });
    });
    return () => dispatch(clearCurrentPost());
  }, [dispatch, id, navigate]);

  const handleDelete = () => {
    if (!window.confirm('Delete this post?')) return;
    dispatch(deletePost(id)).unwrap()
      .then(() => navigate('/posts'))
      .catch((err) => {
        if (err?.expired) navigate('/login', { state: { expired: true } });
        else alert(err || 'Failed to delete post.');
      });
  };

  const isOwner = isAuthenticated && post?.author?._id === user?._id;

  if (loading) return <p>Loading…</p>;
  if (error)   return <div><p><Link to="/posts">← Back</Link></p><p>Error: {typeof error === 'string' ? error : 'Post not found.'}</p></div>;
  if (!post)   return null;

  return (
    <div>
      <p><Link to="/posts">← Back to Posts</Link></p>
      <h2>{post.title}</h2>
      <p style={{ color: '#888', fontSize: '0.85rem' }}>
        by {post.author?.name || post.author}
      </p>
      <p style={{ marginTop: '12px' }}>{post.body}</p>
      {isOwner && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button className="btn-warning" onClick={() => navigate(`/posts/${id}/edit`)}>Edit</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
