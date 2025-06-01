import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectGetUserLoading
} from '../../features/slices/user-slice/userSlice';
import { FC } from 'react';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false
}) => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectGetUserLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    // Если роут только для неавторизованных и пользователь авторизован
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    // Если роут для авторизованных и пользователь не авторизован
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
