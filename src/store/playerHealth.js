import { createSlice } from '@reduxjs/toolkit';

const _calculatePlayerHealthState = (state) => {
    state.currentHealth = Math.max(state.currentHealth, 0);
    state.maxHealth = Math.max(state.maxHealth, 1);
    state.currentHealth = Math.min(state.currentHealth, state.maxHealth);

    const previousPercentHealth = state.percentHealth;
    state.percentHealth = state.currentHealth / state.maxHealth;
    state.increasing = (previousPercentHealth <= state.percentHealth);
}

const playerHealthSlice = createSlice({
  name: 'playerHealth',
  initialState: {
    currentHealth: 50,
    maxHealth: 100,
    percentHealth: 0.5,
    increasing: false,
  },
  reducers: {
    incrementHealth: (state) => {
        state.currentHealth += 10;
        _calculatePlayerHealthState(state);
    },
    decrementHealth: (state) => {
        state.currentHealth -= 10;
        _calculatePlayerHealthState(state);
    },
    setPlayerCurrentHealth: (state, action) => {
        state.currentHealth = action.payload;
        _calculatePlayerHealthState(state);
    },
    setPlayerMaxHealth: (state, action) => {
        state.maxHealth = action.payload;
        _calculatePlayerHealthState(state);
    },
    setPlayerHealth: (state, action) => {
        state.currentHealth = action.payload.currentHealth;
        state.maxHealth = action.payload.maxHealth;
        _calculatePlayerHealthState(state);
    },
  }
})

export const {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
    setPlayerMaxHealth,
    setPlayerHealth,
} = playerHealthSlice.actions;

export default playerHealthSlice;
