import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from '../constants';

const animationToggle = CONSTANTS.animationToggle;

const hotBarsSlice = createSlice({
  name: 'hotBars',
  initialState: {
    dragging: null,
    1: {
        visible: animationToggle,
        left: 50,
        bottom: 8,
        slots: [
            'frameIndex0',
            'frameIndex1',
            'frameIndex2',
            'frameIndex3',
            'frameIndex4',
            'frameIndex5',
            'frameIndex6',
            'frameIndex7',
            'frameIndex8',
            'frameIndex9',
            'frameIndex10',
            'frameIndex11',
            'resume',
            'pause',
            'copy_anim_to_clipboard',
            'decrementTranslateX',
            'decrementTranslateY',
            'incrementTranslateX',
            'decrementFrameKey',
            'empty',
        ]
    },
    2: {
        visible: animationToggle,
        left: 50,
        bottom: 13,
        slots: [
            'composite_hair_back',
            'composite_legs',
            'composite_arm_back',
            'composite_armor_body_back_sleeve',
            'composite_torso',
            'composite_armor_body',
            'composite_arm_front',
            'composite_armor_body_front_sleeve',
            'composite_armor_body_collar',
            'composite_head',
            'composite_ears',
            'composite_face',
            'composite_hair_front',
            'select_all_composite_state',
            'unselect_all_composite_state',
            'decrementRotate',
            'incrementTranslateY',
            'incrementRotate',
            'incrementFrameKey',
            'empty',
        ]
    },
    3: {
        visible: !animationToggle,
        left: 50,
        bottom: 8,
        slots: [
            { name: 'floss', active: false, keybind: 'Q', charges: 1, timer: 10},
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
        ]
    },
    4: {
        visible: !animationToggle,
        left: 50,
        bottom: 13,
        slots: [
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
            { name: 'empty', active: false, },
        ]
    },
  },
  reducers: {
    doNothing: (state) => {},
    setPosition: (state, action) => {
        const hotbar = state[action.payload.key];
        hotbar.left = action.payload.x;
        hotbar.bottom = action.payload.y;
    },
    setSlotActive: (state, action) => {
        const hotbar = state[action.payload.key]
        const slot = hotbar.slots[action.payload.index]
        slot.active = action.payload.active;
    },
    setDragging: (state, action) => {
        state.dragging = action.payload.name;
    },
    setSlot: (state, action) => {
        const hotbar = state[action.payload.key];
        const slot = hotbar.slots[action.payload.index];
        slot.name = action.payload.name;
        state.dragging = null;
    },
  }
})

export const {
    doNothing,
    setPosition,
    setSlotActive,
    setSlot,
    setDragging,
} = hotBarsSlice.actions;

export default hotBarsSlice;
