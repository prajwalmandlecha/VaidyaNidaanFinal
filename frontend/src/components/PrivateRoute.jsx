import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // Check for authentication and render the Element or redirect to login
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
