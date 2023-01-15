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

export const activeStates = {
    default: 'default',
    actions: 'actions',
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    state: activeStates.default,
    activeIndex: 0,
    activeActionsIndex: 0,

    actionOptions: [],

    items: [
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
        { name: 'empty', count: 0 },

        // hey
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
    weapon: null,
    helmet: 'foxears',
    armor: null,
    pants: null,
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
    updateEquipment: (state, action) => {
        state.weapon = action.payload.weapon;
        state.helmet = action.payload.helmet;
        state.armor = action.payload.armor;
        state.pants = action.payload.payload;
    },
    setEquipment: (state, action) => {
        const type = action.payload.type;
        const name = action.payload.name;
        state[type] = name;
    },
    setInventoryActiveIndex: (state, action) => {
        state.activeIndex = action.payload;
    },
    setInventoryActiveActionsIndex: (state, action) => {
        state.activeActionsIndex = action.payload;
    },
    setInventoryState: (state, action) => {
        state.state = action.payload;
    },
    openActionsMenu: (state) => {
        state.state = activeStates.actions;
        state.activeActionsIndex = 0;
    },
    closeActionsMenu: (state) => {
        state.state = activeStates.default;
        state.activeActionsIndex = 0;
    },
    setActionOptions: (state, action) => {
        state.actionOptions = action.payload;
        state.activeActionsIndex = 0;
    },
  }
})

export const {
    setItemCount,
    subractItemCount,
    addItemCount,
    updateEquipment,
    setEquipment,
    setInventoryActiveIndex,
    setInventoryActiveActionsIndex,
    setInventoryState,

    openActionsMenu,
    closeActionsMenu,

    setActionOptions,
} = inventorySlice.actions;
export default inventorySlice;
