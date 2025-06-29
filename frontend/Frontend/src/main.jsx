import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import { Provider } from "react-redux";
import store from "./redux/store";
import { RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import BlogHomePage from './pages/BlogHomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ViewPostPage from './pages/ViewPostPage.jsx'
import AdminPostListPage from './pages/AdminPostListPage.jsx'
import CreatePostPage from './pages/CreatePostPage.jsx'
import EditPostPage from './pages/EditPostPage.jsx'
import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoute.jsx';
import './index.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public Routes
      { path: "/", element: <BlogHomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/blog/:slug", element: <ViewPostPage /> },

      // Admin Routes (Protected)
      {
        path: "/admin/dashboard",
        element: (
          <PrivateRoute adminOnly>
            <AdminPostListPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/posts/create",
        element: (
          <PrivateRoute adminOnly>
            <CreatePostPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/posts/edit/:slug",
        element: (
          <PrivateRoute adminOnly>
            <EditPostPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);