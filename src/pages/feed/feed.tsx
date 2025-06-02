import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectFeedsLoading
} from '../../features/slices/feeds-slice/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);
  const isLoading = useSelector(selectFeedsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
    // Устанавливаем интервал для периодического обновления заказов
    const interval = setInterval(() => {
      dispatch(fetchFeeds());
    }, 15000); // Обновляем каждые 15 секунд

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
