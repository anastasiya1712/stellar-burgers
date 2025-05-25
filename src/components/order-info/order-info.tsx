import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectOrderLoading
} from '../../features/slices/ordersSlice';
import { selectIngredients } from '../../features/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

interface TIngredientsWithCount {
  [key: string]: TIngredient & { count: number };
}

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const orderData = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectOrderLoading);

  useEffect(() => {
    // Загружаем данные заказа только если у нас нет номера заказа
    // или если текущий заказ отличается от запрашиваемого
    if (number && (!orderData || orderData.number.toString() !== number)) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const values = Object.values(ingredientsInfo) as Array<
      TIngredient & { count: number }
    >;
    const total = values.reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
