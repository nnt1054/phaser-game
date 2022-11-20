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

    // how does jumping work?
    // 1. detect onclick and dispatches jump=True
    // 2. observeStore listens for change
    // 3. observeStore sets player.jumpOnNextUpdate=True
    // 4. observeStore dispatches jump=False
    // 5. next update loop we check for player.jumpOnNextUpdate
    // 6. player executes jump logic and sets jumpOnNextUpdate=False
    // 7. easy and epic
    jump: 0,

    gcd: 0,
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
} = playerStateSlice.actions;

export default playerStateSlice;
