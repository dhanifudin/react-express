import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';

import './App.css';
import { store } from './store';
import { logout } from './store/authSlice';
import ListPosts from './routes/ListPosts';
import NewPost   from './routes/NewPost';
import ViewPost  from './routes/ViewPost';
import EditPost  from './routes/EditPost';
import Login          from './routes/Login';
import Register       from './routes/Register';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword  from './routes/ResetPassword';

function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="app-nav">
      <div className="nav-links">
        <Link to="/posts"><strong>Posts</strong></Link>
        {isAuthenticated && <Link to="/posts/new">New Post</Link>}
      </div>
      <div className="nav-auth">
        {isAuthenticated ? (
          <>
            <span className="nav-user">Hi, {user?.name}</span>
            <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <>
      <Nav />
      <hr />
      <div style={{ padding: '24px' }}>
        <Routes>
          <Route path="/"               element={<ListPosts />} />
          <Route path="/posts"          element={<ListPosts />} />
          <Route path="/posts/new"      element={<NewPost />} />
          <Route path="/posts/:id"      element={<ViewPost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/login"                        element={<Login />} />
          <Route path="/register"                     element={<Register />} />
          <Route path="/forgot-password"              element={<ForgotPassword />} />
          <Route path="/users/reset-password/:token"   element={<ResetPassword />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
