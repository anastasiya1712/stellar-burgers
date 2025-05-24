import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser } from '../../features/slices/userSlice';
import { FC } from 'react';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false
}) => {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (onlyUnAuth && user) {
    // Если роут только для неавторизованных и пользователь авторизован
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    // Если роут для авторизованных и пользователь не авторизован
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <Outlet />;
};
