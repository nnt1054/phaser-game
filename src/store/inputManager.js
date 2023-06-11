import { createSlice } from '@reduxjs/toolkit';

import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

const defaultKeymap = {

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
      hotbar: 1,
      slot: 0,
    },
    [KeyCodes.TWO]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 1,
    },
    [KeyCodes.THREE]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 2,
    },
    [KeyCodes.FOUR]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 3,
    },
    [KeyCodes.FIVE]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 4,
    },
    [KeyCodes.Q]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 5,
    },
    [KeyCodes.E]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 6,
    },
    [KeyCodes.R]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 7,
    },
    [KeyCodes.F]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 8,
    },
    [KeyCodes.G]: {
      type: 'hotbar',
      hotbar: 1,
      slot: 9,
    },
};

const defaultShiftKeymap = {

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


    [KeyCodes.ONE]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 0,
    },
    [KeyCodes.TWO]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 1,
    },
    [KeyCodes.THREE]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 2,
    },
    [KeyCodes.FOUR]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 3,
    },
    [KeyCodes.FIVE]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 4,
    },
    [KeyCodes.Q]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 5,
    },
    [KeyCodes.E]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 6,
    },
    [KeyCodes.R]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 7,
    },
    [KeyCodes.F]: {
      type: 'hotbar',
      hotbar: 2,
      slot: 8,
    },
    [KeyCodes.G]: {
      type: 'hotbar',
      hotbar: 2,
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
};

const defaultHotbarLabelMap = {
  1: {
    0: '1',
    1: '2',
    2: '3',
    3: '4',
    4: '5',
    5: 'Q',
    6: 'E',
    7: 'R',
    8: 'F',
    9: 'G',
  },
  2: {
    0: '↑1',
    1: '↑2',
    2: '↑3',
    3: '↑4',
    4: '↑5',
    5: '↑Q',
    6: '↑E',
    7: '↑R',
    8: '↑F',
    9: '↑G',
  },
};

const generateHotbarLabelMap = (state) => {
  // TODO: fill this in when we add keybind remaps :)
}

const inputManagerSlice = createSlice({
  name: 'inputManagerState',
  initialState: {
    keymap: defaultKeymap,
    shiftKeymap: defaultShiftKeymap,
    ctrlKeymap: {},
    altKeymap: {},
    hotbarLabelMap: defaultHotbarLabelMap,
  },
  reducers: {},
})

export const {} = inputManagerSlice.actions;

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