import { createSlice } from '@reduxjs/toolkit';
 
export const menus = {
    default: 'default',
    inventory: 'inventory',
    gameMenu: 'gameMenu',
    dialogue: 'dialogue',
    skills: 'skills',
}

const menuStatesSlice = createSlice({
  name: 'menus',
  initialState: {
    activeMenu: menus.default,

    activeIndex: 0,
    gameMenuOptions: [
        'inventory',
        'skills',
    ],

    chatInputIsActive: false,

    // deprecating everything underneath here
    activeMenus: [],
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


    openMenu: (state, action) => {
        const menu = action.payload;
        if (state.activeMenu !== menu) {
            state.activeMenu = menu;
            state.activeIndex = 0;
        }
    },

    closeMenu: (state) => {
        state.activeMenu = menus.default;
        state.activeIndex = 0;
    },

    setActiveIndex: (state, action) => {
        state.activeIndex = action.payload;
    },

    setChatInputIsActive: (state, action) => {
        if (state.chatInputIsActive !== action.payload) {
            state.chatInputIsActive = action.payload;
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

    openMenu,
    closeMenu,
    navigateUp,
    navigateLeft,
    navigateRight,
    navigateDown,

    setActiveIndex,
    setChatInputIsActive,
} = menuStatesSlice.actions;

export default menuStatesSlice;
