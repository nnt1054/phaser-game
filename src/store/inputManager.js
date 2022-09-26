import { createSlice } from '@reduxjs/toolkit';

import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;


const inputManagerSlice = createSlice({
  name: 'inputManagerState',
  initialState: {
    queuedAbility: null,

    // cursors
    up: 0,
    down: 0,
    left: 0,
    right: 0,

    // keymaps
    keymap: {
        [KeyCodes.Q]: {
          hotbar: 1,
          slot: 1,
        },
        [KeyCodes.E]: {
          hotbar: 1,
          slot: 2,
        },
        [KeyCodes.R]: {
          hotbar: 1,
          slot: 3,
        },
        [KeyCodes.ONE]: {
          hotbar: 3,
          slot: 0,
        },
        [KeyCodes.TWO]: {
          hotbar: 3,
          slot: 1,
        },
        [KeyCodes.THREE]: {
          hotbar: 3,
          slot: 2,
        },
    },
    shiftKeymap: {
        [KeyCodes.Q]: {
          hotbar: 2,
          slot: 1,
        },
        [KeyCodes.E]: {
          hotbar: 2,
          slot: 2,
        },
        [KeyCodes.R]: {
          hotbar: 2,
          slot: 3,
        }
    },
    ctrlKeymap: {},
    altKeymap: {},
  },
  reducers: {
    setQueuedAbility: (state, action) => {
        if (!state.queuedAbility) {
            state.queuedAbility = action.payload;
        }
    },
    clearQueuedAbility: (state) => {
        state.queuedAbility = null;
    },
    clearInputQueues: (state) => {
        state.queuedAbility = null;
        state.jump = false;
    }
  }
})

export const {
    setQueuedAbility,
    clearQueuedAbility,
    clearInputQueues,
} = inputManagerSlice.actions;

export default inputManagerSlice;
