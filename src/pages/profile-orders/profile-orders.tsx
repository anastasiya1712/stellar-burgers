import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectOrders,
  selectOrdersLoading
} from '../../features/slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    // Первоначальная загрузка заказов
    dispatch(fetchUserOrders());

    // Создаем WebSocket соединение для получения обновлений
    const ws = new WebSocket('wss://norma.nomoreparties.space/orders');

    ws.onopen = () => {
      const token = localStorage.getItem('accessToken')?.replace('Bearer ', '');
      if (token) {
        ws.send(
          JSON.stringify({
            token
          })
        );
      }
    };

    ws.onmessage = (event) => {
      const { orders } = JSON.parse(event.data);
      if (orders) {
        // Обновляем заказы в сторе
        dispatch({ type: 'orders/updateOrders', payload: orders });
      }
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
