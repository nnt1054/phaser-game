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
    'Hotbar 1': {
        visible: true,
        left: 50,
        bottom: 11,
        slots: [
            { name: 'potion', active: false },
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'combo1', active: false },
            { name: 'combo2', active: false },
            { name: 'combo3', active: false },
            { name: 'corps_a_corps', active: false },
            { name: 'fleche', active: false },
        ],
        slotsMap: {
            'TMP': [
                { name: 'potion' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'combo1' },
                { name: 'combo2' },
                { name: 'combo3' },
                { name: 'corps_a_corps' },
                { name: 'fleche' },
            ],
            'HEAL': [
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'stone' },
                { name: 'aero' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
            ],
            'MELEE': [
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'combo1' },
                { name: 'combo2' },
                { name: 'combo3' },
                { name: 'combo4' },
                { name: 'empty' },
            ],
        },
    },
    'Hotbar 2': {
        visible: true,
        left: 50,
        bottom: 17,
        slots: [
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'empty', active: false },
            { name: 'vercure', active: false },
            { name: 'jolt', active: false },
            { name: 'slice', active: false },
            { name: 'displacement', active: false },
            { name: 'acceleration', active: false },
        ],
        slotsMap: {
            'TMP': [
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'vercure' },
                { name: 'jolt' },
                { name: 'slice' },
                { name: 'displacement' },
                { name: 'acceleration' },
            ],
            'HEAL': [
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
                { name: 'regen' },
            ],
            'MELEE': [
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'potion' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
                { name: 'empty' },
            ],
        },
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
        const job = action.payload.job;
        const hotbar = state[action.payload.hotbar];
        const slots = hotbar.slotsMap[job];
        const slot = slots[action.payload.slot];
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
