import { createSlice } from '@reduxjs/toolkit';

const _calculateTargetHealthState = (state) => {
    state.currentHealth = Math.max(state.currentHealth, 0);
    state.maxHealth = Math.max(state.maxHealth, 1);
    state.currentHealth = Math.min(state.currentHealth, state.maxHealth);

    const previousPercentHealth = state.percentHealth;
    state.percentHealth = state.currentHealth / state.maxHealth;
    state.increasing = (previousPercentHealth <= state.percentHealth);
}

const targetInfoSlice = createSlice({
  name: 'targetInfo',
  initialState: {
    targetName: 'Lamb Seel',
    currentHealth: 50,
    maxHealth: 100,
    percentHealth: 0.5,
    increasing: false,
  },
  reducers: {
    setTargetCurrentHealth: (state, action) => {
        state.currentHealth = action.payload;
        _calculatePlayerHealthState(state);
    },
    setTargetMaxHealth: (state, action) => {
        state.maxHealth = action.payload;
        _calculatePlayerHealthState(state);
    },
    setTargetHealth: (state, action) => {
        state.currentHealth = action.payload.currentHealth;
        state.maxHealth = action.payload.maxHealth;
        _calculatePlayerHealthState(state);
    },
  }
})

export const {
    setTargetCurrentHealth,
    setTargetMaxHealth,
    setTargetHealth,
} = targetInfoSlice.actions;

export default targetInfoSlice;
