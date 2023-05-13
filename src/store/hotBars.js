import { createSlice } from '@reduxjs/toolkit';

const hotBarsSlice = createSlice({
  name: 'hotBars',
  initialState: {
    isSetting: false,
    settingKey: null,

    dragging: null,
    draggingSource: {
        type: null,
        hotbar: null,
        index: null,
    },

    hoverKey: null,

    3: {
        visible: true,
        left: 50,
        bottom: 9,
        slots: [
            { name: 'potion', active: false, keybind: '1'},
            { name: 'empty', active: false, keybind: '2'},
            { name: 'empty', active: false, keybind: '3'},
            { name: 'empty', active: false, keybind: '4'},
            { name: 'empty', active: false, keybind: '5'},
            { name: 'combo1', active: false, keybind: 'Q'},
            { name: 'combo2', active: false, keybind: 'E'},
            { name: 'combo3', active: false, keybind: 'R'},
            { name: 'corps_a_corps', active: false, keybind: 'F'},
            { name: 'fleche', active: false, keybind: 'G'},

            // { name: 'combo1', active: false, keybind: '1'},
            // { name: 'combo2', active: false, keybind: '2'},
            // { name: 'combo3', active: false, keybind: '3'},
            // { name: 'empty', active: false, keybind: '4'},
            // { name: 'empty', active: false, keybind: '5'},
            // { name: 'jolt', active: false, keybind: 'Q'},
            // { name: 'slice', active: false, keybind: 'E'},
            // { name: 'vercure', active: false, keybind: 'R'},
            // { name: 'corps_a_corps', active: false, keybind: 'F'},
            // { name: 'fleche', active: false, keybind: 'G'},
        ]
    },
    4: {
        visible: true,
        left: 50,
        bottom: 15,
        slots: [
            { name: 'empty', active: false, keybind: '↑1'},
            { name: 'empty', active: false, keybind: '↑2'},
            { name: 'empty', active: false, keybind: '↑3'},
            { name: 'empty', active: false, keybind: '↑4'},
            { name: 'empty', active: false, keybind: '↑5'},
            { name: 'vercure', active: false, keybind: '↑Q'},
            { name: 'empty', active: false, keybind: '↑E'},
            { name: 'empty', active: false, keybind: '↑R'},
            { name: 'displacement', active: false, keybind: '↑F'},
            { name: 'empty', active: false, keybind: '↑G'},
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
        state.draggingSource.type = action.payload.type;
        state.draggingSource.hotbar = action.payload.hotbar;
        state.draggingSource.index = action.payload.index;
    },
    clearDragging: (state) => {
        state.dragging = null;
        state.draggingSource.type = null;
        state.draggingSource.hotbar = null;
        state.draggingSource.index = null;
    },
    setSlot: (state, action) => {
        const hotbar = state[action.payload.hotbar];
        const slot = hotbar.slots[action.payload.slot];
        slot.name = action.payload.name;
    },
    setHoverKey: (state, action) => {
        state.hoverKey = action.payload;
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
    setHoverKey,
} = hotBarsSlice.actions;

export default hotBarsSlice;


// import CONSTANTS from '../constants';
// const animationToggle = CONSTANTS.animationToggle;
// leftover anim code
    // 1: {
    //     visible: animationToggle,
    //     left: 50,
    //     bottom: 8,
    //     slots: animationToggle ? [
    //         { name: 'frameIndex0', active: false, },
    //         { name: 'frameIndex1', active: false, },
    //         { name: 'frameIndex2', active: false, },
    //         { name: 'frameIndex3', active: false, },
    //         { name: 'frameIndex4', active: false, },
    //         { name: 'frameIndex5', active: false, },
    //         { name: 'frameIndex6', active: false, },
    //         { name: 'frameIndex7', active: false, },
    //         { name: 'frameIndex8', active: false, },
    //         { name: 'frameIndex9', active: false, },
    //         { name: 'frameIndex10', active: false, },
    //         { name: 'frameIndex11', active: false, },
    //         { name: 'resume', active: false, },
    //         { name: 'pause', active: false, },
    //         { name: 'copy_anim_to_clipboard', active: false, },
    //         { name: 'decrementTranslateX', active: false, },
    //         { name: 'decrementTranslateY', active: false, },
    //         { name: 'incrementTranslateX', active: false, },
    //         { name: 'decrementFrameKey', active: false, },
    //         { name: 'empty', active: false, },
    //     ] : [],
    // },
    // 2: {
    //     visible: animationToggle,
    //     left: 50,
    //     bottom: 13,
    //     slots: animationToggle ? [
    //         { name: 'composite_hair_back', active: false, },
    //         { name: 'composite_legs', active: false, },
    //         { name: 'composite_arm_back', active: false, },
    //         { name: 'composite_armor_body_back_sleeve', active: false, },
    //         { name: 'composite_torso', active: false, },
    //         { name: 'composite_armor_body', active: false, },
    //         { name: 'composite_arm_front', active: false, },
    //         { name: 'composite_armor_body_front_sleeve', active: false, },
    //         { name: 'composite_armor_body_collar', active: false, },
    //         { name: 'composite_head', active: false, },
    //         { name: 'composite_ears', active: false, },
    //         { name: 'composite_face', active: false, },
    //         { name: 'composite_hair_front', active: false, },
    //         { name: 'select_all_composite_state', active: false, },
    //         { name: 'unselect_all_composite_state', active: false, },
    //         { name: 'decrementRotate', active: false, },
    //         { name: 'incrementTranslateY', active: false, },
    //         { name: 'incrementRotate', active: false, },
    //         { name: 'incrementFrameKey', active: false, },
    //         { name: 'empty', active: false, },
    //     ] : [],
    // },
