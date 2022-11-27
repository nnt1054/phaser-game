import { createSlice } from '@reduxjs/toolkit';

const menuStatesSlice = createSlice({
  name: 'hotBars',
  initialState: {
    character: {
        visible: false,
        left: 50,
        bottom: 25,
    },
    inventory: {
        visible: true,
        left: 50,
        bottom: 25,
    }
  },
  reducers: {
    toggleMenuVisible: (state, action) => {
        const menu = state[action.payload];
        menu.visible = !menu.visible;
    },
    setMenuPosition: (state, action) => {
        const menu = state[action.payload.key];
        menu.left = action.payload.x;
        menu.bottom = action.payload.y;
    },
  }
})

export const {
    toggleMenuVisible,
    setMenuPosition,
} = menuStatesSlice.actions;

export default menuStatesSlice;
