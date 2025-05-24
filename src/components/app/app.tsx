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

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path='*' element={<NotFound404 />} />
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed'>
        <Route index element={<Feed />} />
        <Route
          path=':number'
          element={
            <Modal title='' onClose={() => {}}>
              <OrderInfo />
            </Modal>
          }
        />
      </Route>
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
          <Route path='orders'>
            <Route index element={<ProfileOrders />} />
            <Route
              path=':number'
              element={
                <Modal title='' onClose={() => {}}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Route>
      </Route>
      <Route
        path='/ingredients/:id'
        element={
          <Modal title='' onClose={() => {}}>
            <IngredientDetails />
          </Modal>
        }
      />
    </Routes>
  </div>
);

export default App;
