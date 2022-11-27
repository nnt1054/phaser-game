import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [
      { name: 'jolt', count: 1 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
    ],
  },
  reducers: {}
})

export const {} = inventorySlice.actions;
export default inventorySlice;
