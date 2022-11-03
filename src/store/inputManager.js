import { createSlice } from '@reduxjs/toolkit';

import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const movementOnly = {
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
    shiftKeymap: {},

    // keymap: {
    //   // [KeyCodes.SPACE]: {
    //   //   type: 'simple',
    //   //   key: 'jump',
    //   // },
    //   [KeyCodes.SPACE]: {
    //     type: 'cursor',
    //     cursor: 'jumpCursor',
    //   },
    //   [KeyCodes.W]: {
    //     type: 'cursor',
    //     cursor: 'up',
    //   },
    //   [KeyCodes.A]: {
    //     type: 'cursor',
    //     cursor: 'left',
    //   },
    //   [KeyCodes.S]: {
    //     type: 'cursor',
    //     cursor: 'down',
    //   },
    //   [KeyCodes.D]: {
    //     type: 'cursor',
    //     cursor: 'right',
    //   },
    //   [KeyCodes.Q]: {
    //     type: 'hotbar',
    //     hotbar: 1,
    //     slot: 1,
    //   },
    //   [KeyCodes.E]: {
    //     type: 'hotbar',
    //     hotbar: 1,
    //     slot: 2,
    //   },
    //   [KeyCodes.R]: {
    //     type: 'hotbar',
    //     hotbar: 1,
    //     slot: 3,
    //   },
    //   [KeyCodes.ONE]: {
    //     type: 'hotbar',
    //     hotbar: 3,
    //     slot: 0,
    //   },
    //   [KeyCodes.TWO]: {
    //     type: 'hotbar',
    //     hotbar: 3,
    //     slot: 1,
    //   },
    //   [KeyCodes.THREE]: {
    //     type: 'hotbar',
    //     hotbar: 3,
    //     slot: 2,
    //   },
    //   [KeyCodes.UP]: {
    //     type: 'hotbar',
    //     hotbar: 2,
    //     slot: 16,
    //   },
    //   [KeyCodes.LEFT]: {
    //     type: 'hotbar',
    //     hotbar: 1,
    //     slot: 15,
    //   },
    //   [KeyCodes.DOWN]: {
    //     type: 'hotbar',
    //     hotbar: 1,
    //     slot: 16,
    //   },
    //   [KeyCodes.RIGHT]: {
    //     type: 'hotbar',
    //     hotbar: 1,
    //     slot: 17,
    //   },
    // },
    // shiftKeymap: {
    //   // cursors
    //   [KeyCodes.W]: {
    //     type: 'cursor',
    //     cursor: 'up',
    //   },
    //   [KeyCodes.A]: {
    //     type: 'cursor',
    //     cursor: 'left',
    //   },
    //   [KeyCodes.S]: {
    //     type: 'cursor',
    //     cursor: 'down',
    //   },
    //   [KeyCodes.D]: {
    //     type: 'hotbar',
    //     hotbar: 2,
    //     slot: 1,
    //   },

    //   [KeyCodes.Q]: {
    //     type: 'hotbar',
    //     hotbar: 2,
    //     slot: 1,
    //   },
    //   [KeyCodes.E]: {
    //     type: 'hotbar',
    //     hotbar: 2,
    //     slot: 2,
    //   },
    //   [KeyCodes.R]: {
    //     type: 'hotbar',
    //     hotbar: 2,
    //     slot: 3,
    //   }
    // },
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
