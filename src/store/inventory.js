import { createSlice } from '@reduxjs/toolkit';

const _subractItemCount = (state, name, value) => {
      const item = state.items.find(item => item.name === name);
      if (item) {
        if (item.count > value) {
          item.count -= value;
        } else {
          value -= item.count;
          item.name = 'empty';
          item.count = 0; 
          _subractItemCount(state, name, value);
        }
      }
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [
      { name: 'potion', count: 1 },
      { name: 'empty', count: 0 },
      { name: 'potion', count: 2 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },

      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },

      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },

      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },

      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
      { name: 'empty', count: 0 },
    ],
  },
  reducers: {
    setItemCount: (state, action) => {
      const item = state.items.find(item => item.name === action.payload.name);
      item.count = action.payload.count;
    },
    subractItemCount: (state, action) => {
      const name = action.payload.name;
      const value = action.payload.value;
      _subractItemCount(state, name, value);
    },
    moveItem: (state, action) => {
        const name = action.payload.name;
        if (!name) return;

        const sourceItem = state.items[action.payload.sourceIndex];
        const targetItem = state.items[action.payload.index];

        const targetName = sourceItem.name;
        const targetCount = sourceItem.count;

        targetItem.name = sourceItem.name
        targetItem.count = sourceItem.count
    }
  }
})

export const {
  setItemCount,
  subractItemCount,
  moveItem,
} = inventorySlice.actions;
export default inventorySlice;
