import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../features/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  placeOrder,
  selectPostOrderLoading,
  selectCurrentOrder,
  clearCurrentOrder
} from '../../features/slices/ordersSlice';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  clearConstructor
} from '../../features/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectPostOrderLoading);
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const currentOrder = useSelector(selectCurrentOrder);

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (item: TConstructorIngredient) => item._id
      ),
      constructorItems.bun._id
    ];

    dispatch(placeOrder({ ingredients: ingredientIds }));
  };

  useEffect(() => {
    if (currentOrder) {
      navigate(`/order/${currentOrder.number}`, {
        state: { background: location }
      });
    }
  }, [currentOrder, navigate, location]);

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
    dispatch(clearConstructor());
    navigate(-1);
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
