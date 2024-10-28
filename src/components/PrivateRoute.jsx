import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Aquí puedes comprobar si el usuario está autenticado
  // Por ejemplo, verificando si hay un token en el localStorage o en el estado
  const isAuthenticated = localStorage.getItem('token'); // Verificamos si existe un token en localStorage

  if (!isAuthenticated) {
    // Si el usuario no está autenticado, redirigir al login
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, mostrar el contenido protegido
  return children;
};

export default PrivateRoute;
