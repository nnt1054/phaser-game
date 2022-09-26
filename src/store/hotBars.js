import { createSlice } from '@reduxjs/toolkit';

const hotBarsSlice = createSlice({
  name: 'hotBars',
  initialState: {
    1: {
        left: 50,
        bottom: 8,
        slots: [
            'decrementHP10',
            'incrementHP10',
            'HP0',
            'HP100',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
        ]
    },
    2: {
        left: 50,
        bottom: 13,
        slots: [
            'decrementMP10',
            'incrementMP10',
            'MP0',
            'MP100',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
        ]
    },
    3: {
        left: 96,
        bottom: 5,
        slots: [
            'frameIndex00',
            'frameIndex01',
            'frameIndex02',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'resume',
            'pause',
        ]
    },
    4: {
        left: 92,
        bottom: 5,
        slots: [
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
        ]
    },
  },
  reducers: {
    doNothing: (state) => {},
  }
})

export const {
    doNothing,
} = hotBarsSlice.actions;

export default hotBarsSlice;
