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
    [KeyCodes.I]: {
      type: 'simple',
      key: 'inventory',
    },
    [KeyCodes.K]: {
      type: 'simple',
      key: 'skills',
    },
    [KeyCodes.ESC]: {
      type: 'simple',
      key: 'close',
    },
    [KeyCodes.ENTER]: {
      type: 'simple',
      key: 'confirm',
    },
    [KeyCodes.TAB]: {
      type: 'simple',
      key: 'cycleTarget',
    },

    // navigation keys
    [KeyCodes.UP]: {
      type: 'simple',
      key: 'navUp',
    },
    [KeyCodes.LEFT]: {
      type: 'simple',
      key: 'navLeft',
    },
    [KeyCodes.DOWN]: {
      type: 'simple',
      key: 'navDown',
    },
    [KeyCodes.RIGHT]: {
      type: 'simple',
      key: 'navRight',
    },

    // basic keybinds
    [KeyCodes.ONE]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 0,
    },
    [KeyCodes.TWO]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 1,
    },
    [KeyCodes.THREE]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 2,
    },
    [KeyCodes.FOUR]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 3,
    },
    [KeyCodes.FIVE]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 4,
    },
    [KeyCodes.Q]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 5,
    },
    [KeyCodes.E]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 6,
    },
    [KeyCodes.R]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 7,
    },
    [KeyCodes.F]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 8,
    },
    [KeyCodes.G]: {
      type: 'hotbar',
      hotbar: 3,
      slot: 9,
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
      [KeyCodes.ONE]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 0,
      },
      [KeyCodes.TWO]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 1,
      },
      [KeyCodes.THREE]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 2,
      },
      [KeyCodes.FOUR]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 3,
      },
      [KeyCodes.FIVE]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 4,
      },
      [KeyCodes.Q]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 5,
      },
      [KeyCodes.E]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 6,
      },
      [KeyCodes.R]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 7,
      },
      [KeyCodes.F]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 8,
      },
      [KeyCodes.G]: {
        type: 'hotbar',
        hotbar: 4,
        slot: 9,
      },
      [KeyCodes.TAB]: {
        type: 'simple',
        key: 'cycleTargetReverse',
      },
      [KeyCodes.ENTER]: {
        type: 'simple',
        key: 'focusChatInput',
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


    // [KeyCodes.UP]: {
    //   type: 'cursor',
    //   cursor: 'up',
    // },
    // [KeyCodes.LEFT]: {
    //   type: 'cursor',
    //   cursor: 'left',
    // },
    // [KeyCodes.DOWN]: {
    //   type: 'cursor',
    //   cursor: 'down',
    // },
    // [KeyCodes.RIGHT]: {
    //   type: 'cursor',
    //   cursor: 'right',
    // },