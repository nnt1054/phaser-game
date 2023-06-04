import { createSlice } from '@reduxjs/toolkit';

const _calculateTargetHealthState = (state) => {
    state.currentHealth = Math.max(state.currentHealth, 0);
    state.maxHealth = Math.max(state.maxHealth, 1);
    state.currentHealth = Math.min(state.currentHealth, state.maxHealth);

    const previousPercentHealth = state.percentHealth;
    state.percentHealth = Math.ceil((state.currentHealth / state.maxHealth) * 1000) / 10;
    state.increasing = (previousPercentHealth <= state.percentHealth);
}

const _calculateCotargetHealthState = (state) => {
    state.cotargetCurrentHealth = Math.max(state.cotargetCurrentHealth, 0);
    state.cotargetMaxHealth = Math.max(state.cotargetMaxHealth, 1);
    state.cotargetCurrentHealth = Math.min(state.cotargetCurrentHealth, state.cotargetMaxHealth);

    const previousPercentHealth = state.cotargetPercentHealth;
    state.cotargetPercentHealth = Math.ceil((state.cotargetCurrentHealth / state.cotargetMaxHealth) * 1000) / 10;
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
    color: 'lightblue',
    statuses: [],

    cotargetDisplay: true,
    cotargetName: 'HELLO',
    cotargetCurrentHealth: 50,
    cotargetMaxHealth: 150,
    cotargetPercentHealth: 0.33,
    cotargetIncreasing: false,
    cotargetColor: 'lightblue',


    castLabel: '',
    castProgress: 0,
    castDuration: 0,
  },
  reducers: {
    setTarget: (state, action) => {
        state.display = true;
        state.targetName = action.payload.targetName;
        state.currentHealth = action.payload.currentHealth;
        state.maxHealth = action.payload.maxHealth;
        if (state.maxHealth) {
            _calculateTargetHealthState(state);
        }
        state.increasing = null;
        state.color = action.payload.backgroundColor ?? 'lightblue';
        state.statuses = [];

        // cotarget state
        state.cotargetDisplay = false;
        state.cotargetName = '';
        state.cotargetCurrentHealth = 0;
        state.cotargetMaxHealth = 0;
        state.cotargetpercentHealth = 0;
        state.cotargetColor = 'lightblue';
    },
    removeTarget: (state) => {
        state.display = false;
        state.targetName = '';
        state.currentHealth = 0;
        state.maxHealth = 0;
        state.percentHealth = 0;
        state.increasing = null;
        state.statuses = [];

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
        if (state.cotargetCurrentHealth && state.cotargetMaxHealth) {
            _calculateCotargetHealthState(state);
        }
        state.cotargetIncreasing = null;
        state.cotargetColor = action.payload.backgroundColor ?? 'lightblue';
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
    updateTargetStatuses: (state, action) => {
        state.statuses = action.payload;
    },
    setTargetCast: (state, action) => {
        state.castLabel = action.payload.label;
        state.castProgress = action.payload.progress;
        state.castDuration = action.payload.duration;
    },
    cancelTargetCast: (state, action) => {
        state.castLabel = '';
        state.castProgress = 0;
        state.castDuration = 0;
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
    updateTargetStatuses,
    setTargetCast,
    cancelTargetCast,
} = targetInfoSlice.actions;

export default targetInfoSlice;
