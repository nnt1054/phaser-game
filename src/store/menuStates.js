import { createSlice } from '@reduxjs/toolkit';


const gameMenuConfig = {
    optionsKey: 'gameMenuOptions',
    actions: {
        inventory: (state) => {
            state.activeMenu = 'inventory';
            state.activeIndex = 0;
        },
        social: (state) => {
            console.log('social');
        },
    },
    navigation: {
        up: (state) => {
            const currentIndex = state.activeIndex;
            const maxIndex = state.gameMenuOptions.length - 1;
            if (currentIndex == 0) {
                state.activeIndex = maxIndex;
            } else {
                state.activeIndex = currentIndex - 1;
            }
        },
        down: (state) => {
            const currentIndex = state.activeIndex;
            const maxIndex = state.gameMenuOptions.length - 1;
            if (currentIndex == maxIndex) {
                state.activeIndex = 0;
            } else {
                state.activeIndex = currentIndex + 1;
            }
        },
        left: (state) => {
            const currentIndex = state.activeIndex;
            const maxIndex = state.gameMenuOptions.length - 1;
            if (currentIndex == 0) {
                state.activeIndex = maxIndex;
            } else {
                state.activeIndex = currentIndex - 1;
            }
        },
        right: (state) => {
            const currentIndex = state.activeIndex;
            const maxIndex = state.gameMenuOptions.length - 1;
            if (currentIndex == maxIndex) {
                state.activeIndex = 0;
            } else {
                state.activeIndex = currentIndex + 1;
            }
        },
    },
};


const inventoryConfig = {
    optionsKey: 'gameMenuOptions',
    actions: {
        item: (state) => {
            console.log('huh');
        },
    },
    navigation: {
        up: (state) => {
            const currentIndex = state.activeIndex;
            state.activeIndex = Math.max(0, currentIndex - 6);
        },
        down: (state) => {
            const currentIndex = state.activeIndex;
            const maxIndex = 47;
            state.activeIndex = Math.min(maxIndex, currentIndex + 6);
        },
        left: (state) => {
            const currentIndex = state.activeIndex;
            state.activeIndex = Math.max(0, currentIndex - 1);
        },
        right: (state) => {
            const currentIndex = state.activeIndex;
            const maxIndex = 47;
            state.activeIndex = Math.min(maxIndex, currentIndex + 1);
        },
    },
};

const configMap = {
    'gameMenu': gameMenuConfig,
    'inventory': inventoryConfig,
}

const menuStatesSlice = createSlice({
  name: 'menus',
  initialState: {
    activeMenu: null,
    activeIndex: 0,

    gameMenuOptions: [
        {label: 'Inventory', action: 'inventory'},
        {label: 'Social', action: 'social'},
        {label: 'Skills', action: ''},
        {label: 'Settings', action: ''},
        {label: 'Logout', action: ''},
    ],

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
        state.activeMenu = null;
        state.activeIndex = 0;
    },

    confirmMenu: (state) => {
        const config = configMap[state.activeMenu];
        if (!config) return;

        const options = state[config.optionsKey];
        if (!options) return;

        const option = options[state.activeIndex];
        if (!option) return;

        const action = config.actions[option.action];
        if (!action) return;

        action(state);
    },

    navigateUp: (state) => {
        const config = configMap[state.activeMenu];
        if (!config) return;

        const action = config.navigation.up;
        action(state);
    },
    navigateLeft: (state) => {
        const config = configMap[state.activeMenu];
        if (!config) return;

        const action = config.navigation.left;
        action(state);
    },
    navigateRight: (state) => {
        const config = configMap[state.activeMenu];
        if (!config) return;

        const action = config.navigation.right;
        action(state);
    },
    navigateDown: (state) => {
        const config = configMap[state.activeMenu];
        if (!config) return;

        const action = config.navigation.down;
        action(state);
    },

    setActiveIndex: (state, action) => {
        state.activeIndex = action.payload;
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
    confirmMenu,
    navigateUp,
    navigateLeft,
    navigateRight,
    navigateDown,

    setActiveIndex,

} = menuStatesSlice.actions;

export default menuStatesSlice;
