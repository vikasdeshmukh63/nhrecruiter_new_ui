import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

const initialState = {
  cartItems: [],
  discounts: null,
  orderInfo:null,
  error: null,
};

const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // to set cart item
    addCartItems(state, action) {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.cartItems.push(action.payload);
      }
    },

    // to remove specific cart item
    removeCartItem(state, action) {
      const itemsRemain = state.cartItems.filter((item) => item.id !== action.payload);
      state.cartItems = itemsRemain;
    },

    // to empty cart
    emptyCart(state, action) {
      state.cartItems = [];
    },

    // to change the quantity
    changeExistingItemQty(state, action) {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (action.payload.type === 'minus') {
        existingItem.qty -= 1;
        if (existingItem.qty < 1) {
          existingItem.qty = 1;
        }
      }
      if (action.payload.type === 'add') {
        existingItem.qty += 1;
      }
    },

    // to set discounts
    setDiscounts(state, action) {
      state.discounts = action.payload;
    },

    // to set order id 
    setOrderInfo(state,action){
      state.orderInfo = action.payload;
    },

    // to set error
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  addCartItems,
  removeCartItem,
  emptyCart,
  changeExistingItemQty,
  setDiscounts,
  setOrderInfo,
  hasError,
} = cart.actions;

export default cart.reducer;

// ! function to get discounts
export function fetchDiscounts(code) {
  return async function fetchDiscountsThunk(dispatch, getState) {
    if (!code) {
      dispatch(setDiscounts(null));
      dispatch(hasError('Discount Code is not Valid'));
      return;
    }
    try {
      const response = await axiosInstance.get(`${endpoints.credit.discounts}/${code}`);
      if (response.status === 200) {
        if (response.data.status === 'RECORD_NOT_FOUND') {
          dispatch(setDiscounts(null));
          dispatch(hasError('Discount Code is not Valid'));
          return;
        }
        dispatch(setDiscounts(response.data.data));
        dispatch(hasError(null));
      }
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
