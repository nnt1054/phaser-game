import { createSlice } from '@reduxjs/toolkit';
import CONSTANTS from '../constants';

const animationToggle = CONSTANTS.animationToggle;

const hotBarsSlice = createSlice({
  name: 'hotBars',
  initialState: {
    dragging: null,
    draggingSource: {
        hotbar: null,
        index: null,
    },
    1: {
        visible: animationToggle,
        left: 50,
        bottom: 8,
        slots: [
            { name: 'frameIndex0', active: false, },
            { name: 'frameIndex1', active: false, },
            { name: 'frameIndex2', active: false, },
            { name: 'frameIndex3', active: false, },
            { name: 'frameIndex4', active: false, },
            { name: 'frameIndex5', active: false, },
            { name: 'frameIndex6', active: false, },
            { name: 'frameIndex7', active: false, },
            { name: 'frameIndex8', active: false, },
            { name: 'frameIndex9', active: false, },
            { name: 'frameIndex10', active: false, },
            { name: 'frameIndex11', active: false, },
            { name: 'resume', active: false, },
            { name: 'pause', active: false, },
            { name: 'copy_anim_to_clipboard', active: false, },
            { name: 'decrementTranslateX', active: false, },
            { name: 'decrementTranslateY', active: false, },
            { name: 'incrementTranslateX', active: false, },
            { name: 'decrementFrameKey', active: false, },
            { name: 'empty', active: false, },
        ],
    },
    2: {
        visible: animationToggle,
        left: 50,
        bottom: 13,
        slots: [
            { name: 'composite_hair_back', active: false, },
            { name: 'composite_legs', active: false, },
            { name: 'composite_arm_back', active: false, },
            { name: 'composite_armor_body_back_sleeve', active: false, },
            { name: 'composite_torso', active: false, },
            { name: 'composite_armor_body', active: false, },
            { name: 'composite_arm_front', active: false, },
            { name: 'composite_armor_body_front_sleeve', active: false, },
            { name: 'composite_armor_body_collar', active: false, },
            { name: 'composite_head', active: false, },
            { name: 'composite_ears', active: false, },
            { name: 'composite_face', active: false, },
            { name: 'composite_hair_front', active: false, },
            { name: 'select_all_composite_state', active: false, },
            { name: 'unselect_all_composite_state', active: false, },
            { name: 'decrementRotate', active: false, },
            { name: 'incrementTranslateY', active: false, },
            { name: 'incrementRotate', active: false, },
            { name: 'incrementFrameKey', active: false, },
            { name: 'empty', active: false, },
        ]
    },
    3: {
        visible: !animationToggle,
        left: 50,
        bottom: 8,
        slots: [
            { name: 'floss', active: false, keybind: 'Q', timer: 10},
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
            { name: 'floss', active: false, keybind: 'Q', timer: 10},
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
        // const hotbarKey = action.payload.hotbar;
        // const hotbar = state[hotbarKey];
        // const index = action.payload.index
        // const slot = hotbar.slots[index]
        // slot.active = true;
        state.dragging = action.payload.name;
        state.draggingSource.hotbar = action.payload.hotbar;
        state.draggingSource.index = action.payload.index;
    },
    clearDragging: (state) => {
        // if (state.draggingSource.hotbar !== null && state.draggingSource.index !== null) {
        //     const hotbar = state[state.draggingSource.hotbar];
        //     const slot = hotbar.slots[state.draggingSource.index];
        //     slot.active = false;
        // }
        state.dragging = null;
        state.draggingSource.hotbar = null;
        state.draggingSource.index = null;
    },
    setSlot: (state, action) => {
        if (!state.dragging) return;
        const hotbar = state[action.payload.key];
        const slot = hotbar.slots[action.payload.index];
        const targetName = slot.name;
        slot.name = state.dragging;

        const sourceHotbarKey = state.draggingSource.hotbar;
        const sourceIndex = state.draggingSource.index;

        if (sourceHotbarKey !== null && sourceIndex !== null) {
            const sourceHotbar = state[sourceHotbarKey];
            const sourceSlot = sourceHotbar.slots[sourceIndex];
            sourceSlot.name = targetName;
            // sourceSlot.active = false;
        }

        state.dragging = null;
        state.draggingSource.hotbar = null;
        state.draggingSource.index = null;
    },
  }
})

export const {
    doNothing,
    setPosition,
    setSlotActive,
    setSlot,
    setDragging,
    clearDragging,
} = hotBarsSlice.actions;

export default hotBarsSlice;
