import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectOrders,
  selectOrdersLoading,
  updateOrders
} from '../../features/slices/orders-slice/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    // Первоначальная загрузка заказов
    dispatch(fetchUserOrders());

    // Создаем WebSocket соединение для получения обновлений
    const token = localStorage.getItem('accessToken')?.replace('Bearer ', '');
    if (!token) return;

    const ws = new WebSocket(
      `wss://norma.nomoreparties.space/orders?token=${token}`
    );

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.orders) {
        dispatch(updateOrders(data.orders.reverse()));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
