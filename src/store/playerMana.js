import { createSlice } from '@reduxjs/toolkit';

const _calculatePlayerManaState = (state) => {
    state.currentMana = Math.max(state.currentMana, 0);
    state.maxMana = Math.max(state.maxMana, 1);
    state.currentMana = Math.min(state.currentMana, state.maxMana);
    state.percentMana = state.currentMana / state.maxMana;
}

const playerManaSlice = createSlice({
  name: 'playerMana',
  initialState: {
    currentMana: 50,
    maxMana: 100,
    percentMana: 0.5,
  },
  reducers: {
    incrementMana: (state) => {
        state.currentMana += 10;
        _calculatePlayerManaState(state);
    },
    decrementMana: (state) => {
        state.currentMana -= 10;
        _calculatePlayerManaState(state);
    },
    setPlayerCurrentMana: (state, action) => {
        state.currentMana = action.payload;
        _calculatePlayerManaState(state);
    },
    setPlayerMaxMana: (state, action) => {
        state.maxMana = action.payload;
        _calculatePlayerManaState(state);
    },
    setPlayerMana: (state, action) => {
        state.currentMana = action.payload.currentMana;
        state.maxMana = action.payload.maxMana;
        _calculatePlayerManaState(state);
    },
  }
})

export const {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
    setPlayerMaxMana,
    setPlayerMana,
} = playerManaSlice.actions;

export default playerManaSlice;
