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
    draggingIndex: null,
    items: [
      { name: 'halo', count: 1 },
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
    addItemCount: (state, action) => {
      const name = action.payload.name;
      const value = action.payload.value;
      let item = state.items.find(item => item.name === name);
      if (item) {
        item.count += value;
      } else {
        item = state.items.find(item => item.name === 'empty');
        item.name = name;
        item.count = value;
      }
    },
    moveItem: (state, action) => {
      if (state.draggingIndex === null) return;
      if (state.draggingIndex === action.payload.index) return;
      const sourceItem = state.items[state.draggingIndex];
      const targetItem = state.items[action.payload.index];

      const targetName = targetItem.name;
      const targetCount = targetItem.count;

      if (sourceItem.name == targetItem.name) {
        targetItem.count += sourceItem.count;
        sourceItem.name = 'empty';
        sourceItem.count = 0;
      } else {
        targetItem.name = sourceItem.name;
        targetItem.count = sourceItem.count;

        sourceItem.name = targetName;
        sourceItem.count = targetCount;
      }
      state.draggingIndex = null;
    },
    setDraggingIndex: (state, action) => {
      state.draggingIndex = action.payload;
    }
  }
})

export const {
  setItemCount,
  subractItemCount,
  addItemCount,
  moveItem,
  setItemDragging,
  setDraggingIndex,
} = inventorySlice.actions;
export default inventorySlice;
