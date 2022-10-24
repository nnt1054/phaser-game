import { createSlice } from '@reduxjs/toolkit';

const aniEditorSlice = createSlice({
  name: 'aniEditor',
  initialState: {
    frameIndex: null,
    compositeStates: {
      'composite_hair_back': false,
      'composite_legs': false,
      'composite_arm_back': false,
      'composite_armor_body_back_sleeve': false,
      'composite_torso': false,
      'composite_armor_body': false,
      'composite_arm_front': false,
      'composite_armor_body_front_sleeve': false,
      'composite_armor_body_collar': false,
      'composite_head': false,
      'composite_ears': false,
      'composite_face': false,
      'composite_hair_front': false,
    },
  },
  reducers: {
    setFrameIndex: (state, action) => {
      const index = action.payload;
      state.frameIndex = index;
    },
    toggleCompositeState: (state, action) => {
      const compositeKey = action.payload;
      const currentState = state.compositeStates[compositeKey]
      state.compositeStates[compositeKey] = !currentState;
    },
    clearCompositeStates: (state, action) => {
      const value = action.payload;
      state.compositeStates = {
        'composite_hair_back': value,
        'composite_legs': value,
        'composite_arm_back': value,
        'composite_armor_body_back_sleeve': value,
        'composite_torso': value,
        'composite_armor_body': value,
        'composite_arm_front': value,
        'composite_armor_body_front_sleeve': value,
        'composite_armor_body_collar': value,
        'composite_head': value,
        'composite_ears': value,
        'composite_face': value,
        'composite_hair_front': value,
      }
    }
  }
})

export const {
    setFrameIndex,
    toggleCompositeState,
    clearCompositeStates,
} = aniEditorSlice.actions;

export default aniEditorSlice;
