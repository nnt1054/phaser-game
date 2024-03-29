import { createSlice } from '@reduxjs/toolkit';

const TARGET_CONSTANTS = {
    CURRENT_TARGET: 'CURRENT_TARGET',
}

const playerStateSlice = createSlice({
  name: 'playerState',
  initialState: {
    queuedAbility: null,

    // 'currentTarget',
    queuedTarget: null,

    // cursors
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    jump: false,

    gcd: 0,
    castKey: '',
    castDuration: 0,
    cooldowns: {},

    systemAction: null,
    systemActionTarget: null,

    refreshCooldown: false,

    comboAction: '',

    currentLevel: '?',
    currentExp: '-',
    maxExp: '-',
    expProgress: 0,

    currentJob: 'TMP',
  },
  reducers: {
    setQueuedAbility: (state, action) => {
        if (!state.queuedAbility) {
            state.queuedAbility = action.payload;
            state.queuedTarget = null;
        }
    },
    setQueuedAbilityAndTarget: (state, action) => {
        const { CURRENT_TARGET } = TARGET_CONSTANTS
        if (!state.queuedAbility) {
            state.queuedAbility = action.payload.ability;
            state.queuedTarget = action.payload.target;
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
    },
    setSystemAction: (state, action) => {
        if (!state.systemAction) {
            state.systemAction = action.payload;
            state.systemActionTarget = null;
        }
    },
    setSystemActionAndTarget: (state, action) => {
        if (!state.systemAction) {
            state.systemAction = action.payload.action;
            state.systemActionTarget = action.payload.target;
        }
    },
    clearSystemAction: (state) => {
        state.systemAction = null;
        state.systemActionTarget = null;
    },
    setRefreshCooldown: (state, action) => {
        state.refreshCooldown = action.payload;
    },
    setComboAction: (state, action) => {
        state.comboAction = action.payload;
    },
    updateExperience: (state, action) => {
        state.currentExp = action.payload.currentExp;
        state.maxExp = action.payload.maxExp;
        state.expProgress = action.payload.expProgress;
    },
    updateLevel: (state, action) => {
        state.currentLevel = action.payload;
    },
    updateJob: (state, action) => {
        state.currentJob = action.payload;
    },
  }
})

export const {
    setQueuedAbility,
    setQueuedAbilityAndTarget,
    setJump,
    clearQueuedAbility,
    clearInputQueues,
    setCursorState,
    setCooldowns,
    setGCD,
    setCast,
    setSystemAction,
    setSystemActionAndTarget,
    clearSystemAction,
    setRefreshCooldown,
    setComboAction,
    updateExperience,
    updateLevel,
    updateJob,
} = playerStateSlice.actions;

export default playerStateSlice;
