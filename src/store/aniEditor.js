import { createSlice } from '@reduxjs/toolkit';

const _calculatePlayerHealthState = (state) => {
    state.currentHealth = Math.max(state.currentHealth, 0);
    state.maxHealth = Math.max(state.maxHealth, 1);
    state.currentHealth = Math.min(state.currentHealth, state.maxHealth);

    const previousPercentHealth = state.percentHealth;
    state.percentHealth = state.currentHealth / state.maxHealth;
    state.increasing = (previousPercentHealth <= state.percentHealth);
}

const aniEditorSlice = createSlice({
  name: 'aniEditor',
  initialState: {
    frameIndex: 1,
    compositeKeys: [],
  },
  reducers: {
    setFrameIndex: (state, action) => {
        const index = action.payload;
        state.frameIndex = index;
    },
  }
})

export const {
    setFrameIndex,
} = aniEditorSlice.actions;

export default aniEditorSlice;
