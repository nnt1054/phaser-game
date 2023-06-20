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
        'linear_strike',
        'fanning_strike',
        'redondo',
        'exis_strike',
        'largo_mano_strike',
        'corto_mano_dash',
        'earthly_strike',
        'heavenly_strike',
        'earthly_combo',
        'heavenly_combo',
        'enlightenment',
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
