import { createSlice } from '@reduxjs/toolkit';

const characterPreviewSlice = createSlice({
  name: 'characterPreview',
  initialState: {
    indexes: {
        'hair_back': 1,
        'legs': 1,
        'pants': 0,
        'arm_back': 1,
        'armor_body_back_sleeve': 1,
        'torso': 1,
        'armor_body': 1,
        'arm_front': 1,
        'armor_body_front_sleeve': 1,
        'armor_body_collar': 1,
        'head': 1,
        'ears': 1,
        'face': 0,
        'headband': 0,
        'hair_front': 1,
    },
    frames: {
        'hair_back': 1,
        'legs': 0,
        'pants': 0,
        'arm_back': 1,
        'armor_body_back_sleeve': 3,
        'torso': 0,
        'armor_body': 0,
        'arm_front': 0,
        'armor_body_front_sleeve': 2,
        'armor_body_collar': 1,
        'head': 0,
        'ears': 0,
        'face': 0,
        'headband': 0,
        'hair_front': 0,
    }
  },
  reducers: {
    updatePreview: (state, action) => {
        Object.entries(action.payload).forEach(([key, index]) => {
            state.indexes[key] = index;
        })
    },
  }
})

export const {
  updatePreview,
} = characterPreviewSlice.actions;

export default characterPreviewSlice;
