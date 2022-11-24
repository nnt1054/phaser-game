import { createSlice } from '@reduxjs/toolkit';

const playerStateSlice = createSlice({
  name: 'playerState',
  initialState: {
    queuedAbility: null,

    // cursors
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    jump: 0,

    gcd: 0,
    castKey: '',
    castDuration: 0,
    cooldowns: {},
  },
  reducers: {
    setQueuedAbility: (state, action) => {
        if (!state.queuedAbility) {
            state.queuedAbility = action.payload;
        }
    },
    setJump: (state) => {
        state.jump = true;
    },
    clearQueuedAbility: (state) => {
        state.queuedAbility = null;
    },
    clearInputQueues: (state) => {
        state.queuedAbility = null;
        // state.jump = false;
    },
    setCursorState: (state, action) => {
        let cursor = action.payload.cursor
        let value = action.payload.value
        if (cursor in state) {
            state[cursor] = value;
        }
    },
    setCooldowns: (state, action) => {
        state.cooldowns = action.payload;
    },
    setGCD: (state, action) => {
        state.gcd = action.payload;
    },
    setCast: (state, action) => {
        state.castKey = action.payload.key;
        state.castDuration = action.payload.duration;
    }
  }
})

export const {
    setQueuedAbility,
    setJump,
    clearQueuedAbility,
    clearInputQueues,
    setCursorState,
    setCooldowns,
    setGCD,
    setCast,
} = playerStateSlice.actions;

export default playerStateSlice;
