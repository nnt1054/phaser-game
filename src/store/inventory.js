import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [
      { name: 'potion', count: 2 },
      { name: 'empty', count: 0 },
      { name: 'potion', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
    ],
  },
  reducers: {
    setItemCount: (state, action) => {
      const item = state.items.find(item => item.name === action.payload.name);
      item.count = action.payload.count;
    }
  }
})

export const {
  setItemCount,
} = inventorySlice.actions;
export default inventorySlice;
