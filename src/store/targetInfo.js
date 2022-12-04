import { createSlice } from '@reduxjs/toolkit';

const _calculateTargetHealthState = (state) => {
    state.currentHealth = Math.max(state.currentHealth, 0);
    state.maxHealth = Math.max(state.maxHealth, 1);
    state.currentHealth = Math.min(state.currentHealth, state.maxHealth);

    const previousPercentHealth = state.percentHealth;
    state.percentHealth = state.currentHealth / state.maxHealth;
    state.increasing = (previousPercentHealth <= state.percentHealth);
}

const _calculateCotargetHealthState = (state) => {
    state.cotargetCurrentHealth = Math.max(state.cotargetCurrentHealth, 0);
    state.cotargetMaxHealth = Math.max(state.cotargetMaxHealth, 1);
    state.cotargetCurrentHealth = Math.min(state.cotargetCurrentHealth, state.cotargetMaxHealth);

    const previousPercentHealth = state.cotargetPercentHealth;
    state.cotargetPercentHealth = state.cotargetCurrentHealth / state.cotargetMaxHealth;
    state.cotargetIncreasing = (previousPercentHealth <= state.cotargetPercentHealth);
}

const targetInfoSlice = createSlice({
  name: 'targetInfo',
  initialState: {
    display: false,
    targetName: 'Lamb Seel',
    currentHealth: 50,
    maxHealth: 100,
    percentHealth: 0.5,
    increasing: false,

    cotargetDisplay: true,
    cotargetName: 'HELLO',
    cotargetCurrentHealth: 50,
    cotargetMaxHealth: 150,
    cotargetPercentHealth: 0.33,
    cotargetIncreasing: false,
  },
  reducers: {
    setTarget: (state, action) => {
        state.display = true;
        state.targetName = action.payload.targetName;
        state.currentHealth = action.payload.currentHealth;
        state.maxHealth = action.payload.maxHealth;
        _calculateTargetHealthState(state);
        state.increasing = null;

        // cotarget state
        state.cotargetDisplay = false;
        state.cotargetName = '';
        state.cotargetCurrentHealth = 0;
        state.cotargetMaxHealth = 0;
        state.cotargetpercentHealth = 0;
    },
    removeTarget: (state) => {
        state.display = false;
        state.targetName = '';
        state.currentHealth = 0;
        state.maxHealth = 0;
        state.percentHealth = 0;
        state.increasing = null;

        // cotarget state
        state.cotargetDisplay = false;
        state.cotargetName = '';
        state.cotargetCurrentHealth = 0;
        state.cotargetMaxHealth = 0;
        state.cotargetpercentHealth = 0;
    },
    setTargetCurrentHealth: (state, action) => {
        state.currentHealth = action.payload;
        _calculateTargetHealthState(state);
    },
    setTargetMaxHealth: (state, action) => {
        state.maxHealth = action.payload;
        _calculateTargetHealthState(state);
    },
    setTargetHealth: (state, action) => {
        state.currentHealth = action.payload.currentHealth;
        state.maxHealth = action.payload.maxHealth;
        _calculateTargetHealthState(state);
    },

    // cotarget
    setCotarget: (state, action) => {
        state.cotargetDisplay = true;
        state.cotargetName = action.payload.targetName;
        state.cotargetCurrentHealth = action.payload.currentHealth;
        state.cotargetMaxHealth = action.payload.maxHealth;
        _calculateCotargetHealthState(state);
        state.cotargetIncreasing = null;
    },
    removeCotarget: (state) => {
        state.cotargetDisplay = false;
        state.cotargetName = '';
        state.cotargetCurrentHealth = 0;
        state.cotargetMaxHealth = 0;
        state.percentHealth = 0;
        state.cotargetIncreasing = null;
    },
    setCotargetCurrentHealth: (state, action) => {
        state.cotargetCurrentHealth = action.payload;
        _calculateCotargetHealthState(state);
    },
  }
})

export const {
    setTarget,
    removeTarget,
    setTargetCurrentHealth,
    setTargetMaxHealth,
    setTargetHealth,
    setCotarget,
    removeCotarget,
    setCotargetCurrentHealth,
} = targetInfoSlice.actions;

export default targetInfoSlice;
