import { createSlice } from '@reduxjs/toolkit';

export const activeStates = {
    default: 'default',
    actions: 'actions',
    setting: 'setting',
}

const skillsMenuSlice = createSlice({
  name: 'skills',
  initialState: {
    state: activeStates.default,
    activeIndex: 0,
    activeActionsIndex: 0,
    options: [
        'jolt',
        'verthunder',
        'fleche',
        'vercure',
        'slice',
    ],
    actionOptions: [
      'setActiveSkill',
    ],
  },
  reducers: {
    setActiveState: (state, action) => {
        state.state = action.payload;
    },
    setActiveIndex: (state, action) => {
        state.activeIndex = action.payload;
    },
    setActiveActionsIndex: (state, action) => {
        state.activeActionsIndex = action.payload;
    },
  }
})

export const {
    setActiveState,
    setActiveIndex,
    setActiveActionsIndex,
} = skillsMenuSlice.actions;

export default skillsMenuSlice;
