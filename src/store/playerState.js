import { createSlice } from '@reduxjs/toolkit';

const playerStateSlice = createSlice({
  name: 'playerState',
  initialState: {
    queuedAbility: null,
  },
  reducers: {
    setQueuedAbility: (state, action) => {
        if (!state.queuedAbility) {
            state.queuedAbility = action.payload;
        }
    },
    clearQueuedAbility: (state) => {
        state.queuedAbility = null;
    }
  }
})

export const {
    setQueuedAbility,
    clearQueuedAbility
} = playerStateSlice.actions;

export default playerStateSlice;
