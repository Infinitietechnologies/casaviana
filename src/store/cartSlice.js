import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartId: null,
    finalTotal: 0,
    totalQuantity: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addItemToCart: (state, action) => {
      const { data, final_total } = action.payload;
      const existingItem = state.items.find(
        (item) => item.menu_item_id === data.menu_item_id
      );

      if (existingItem) {
        existingItem.quantity = parseInt(existingItem.quantity) + parseInt(data.quantity);
      } else {
        state.items.push(data);
      }

      state.cartId = data.cart_id;
      state.finalTotal = final_total || 0;
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + parseInt(item.quantity || 0),
        0
      );
    },
    setCart: (state, action) => {
      const { items, cart_id, final_total } = action.payload;
      state.items = items || [];
      state.cartId = cart_id || null;
      state.finalTotal = final_total || 0;
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + parseInt(item.quantity || 0),
        0
      );
    },
    updateItemQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === cartItemId);
      if (item) {
        item.quantity = quantity;
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + parseInt(item.quantity || 0),
          0
        );
      }
    },
    removeItemFromCart: (state, action) => {
      const cartItemId = action.payload;
      state.items = state.items.filter((item) => item.id !== cartItemId);
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + parseInt(item.quantity || 0),
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.cartId = null;
      state.finalTotal = 0;
      state.totalQuantity = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addItemToCart,
  setCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;


