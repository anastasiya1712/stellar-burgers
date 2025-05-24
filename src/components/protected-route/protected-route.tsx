import { Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  console.log('protected route');
  return <Outlet />;
};
