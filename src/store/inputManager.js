import { createSlice } from '@reduxjs/toolkit';

import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const movementOnly = {

    // cursors
    [KeyCodes.SPACE]: {
      type: 'cursor',
      cursor: 'jumpCursor',
    },
    [KeyCodes.W]: {
      type: 'cursor',
      cursor: 'up',
    },
    [KeyCodes.A]: {
      type: 'cursor',
      cursor: 'left',
    },
    [KeyCodes.S]: {
      type: 'cursor',
      cursor: 'down',
    },
    [KeyCodes.D]: {
      type: 'cursor',
      cursor: 'right',
    },

    // menus
    [KeyCodes.C]: {
      type: 'simple',
      key: 'characterMenu',
    },

    // keybinds
    [KeyCodes.Q]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 0,
    },
    [KeyCodes.E]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 1,
    },
    [KeyCodes.R]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 2,
    },
    [KeyCodes.F]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 3,
    },
    [KeyCodes.G]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 4,
    },
}

const inputManagerSlice = createSlice({
  name: 'inputManagerState',
  initialState: {
    queuedAbility: null,

    // cursors
    up: 0,
    down: 0,
    left: 0,
    right: 0,

    keymap: movementOnly,
    shiftKeymap: {
      [KeyCodes.Q]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 0,
      },
      [KeyCodes.E]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 1,
      },
      [KeyCodes.R]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 2,
      },
      [KeyCodes.F]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 3,
      },
      [KeyCodes.G]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 4,
    },
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
