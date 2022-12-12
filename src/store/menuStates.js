import { createSlice } from '@reduxjs/toolkit';

const menuStatesSlice = createSlice({
  name: 'menus',
  initialState: {
    activeMenus: [],
    character: {
        visible: false,
        left: 40,
        bottom: 25,
        zIndex: 10,
    },
    inventory: {
        visible: false,
        left: 60,
        bottom: 25,
        zIndex: 10,
    },
    zIndexCounter: 10,
  },
  reducers: {
    toggleMenuVisible: (state, action) => {
        const key = action.payload;
        const menu = state[action.payload];
        menu.visible = !menu.visible;
        if (menu.visible) {
            state.activeMenus.push(action.payload);
            menu.zIndex = state.zIndexCounter
            state.zIndexCounter += 10
        } else {
            state.activeMenus = state.activeMenus.filter(menuKey => {
                return menuKey !== action.payload;
            });
        }
    },
    pushToFront: (state, action) => {
        const key = action.payload;
        const menu = state[action.payload];
        menu.zIndex = state.zIndexCounter;
        state.zIndexCounter += 10;
    },
    setMenuPosition: (state, action) => {
        const menu = state[action.payload.key];
        menu.left = action.payload.x;
        menu.bottom = action.payload.y;
    },
    incrementZIndex: (state) => {
        state.zIndexCounter += 10;
    },
    closeMenus: (state) => {
        const key = state.activeMenus.pop()
        if (key && state[key]) {
            state[key].visible = false;
        }
    },
  }
})

export const {
    toggleMenuVisible,
    pushToFront,
    setMenuPosition,
    incrementZIndex,
    closeMenus,
} = menuStatesSlice.actions;

export default menuStatesSlice;
