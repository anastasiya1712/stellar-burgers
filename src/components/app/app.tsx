import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path='*' element={<NotFound404 />} />
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/register' element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/reset-password' element={<ResetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/profile'>
          <Route index element={<Profile />} />
          <Route path='orders' element={<ProfileOrders />} />
        </Route>
      </Route>
    </Routes>
  </div>
);

export default App;
