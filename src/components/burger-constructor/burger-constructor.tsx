import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../features/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  placeOrder,
  selectPostOrderLoading
} from '../../features/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectPostOrderLoading);

  /** TODO: взять переменные constructorItems и orderModalData из стора */
  const constructorItems = {
    bun: {
      price: 0
    },
    ingredients: []
  };

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // const ingredients = [
    //   constructorItems.bun.price,
    //   ...constructorItems.ingredients,
    //   constructorItems.bun.price
    // ];

    // dispatch(placeOrder({ ingredients }));
  };

  const closeOrderModal = () => {
    // TODO: Clear constructor and close modal
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
