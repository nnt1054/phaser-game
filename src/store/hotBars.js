import { createSlice } from '@reduxjs/toolkit';

const hotBarsSlice = createSlice({
  name: 'hotBars',
  initialState: {
    1: {
        left: 50,
        bottom: 10,
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
            'empty',
        ]
    },
    2: {
        left: 50,
        bottom: 16,
        slots: [
            'empty',
            'empty',
            'empty',
            'empty',
            'empty',
            'decrementMP10',
            'incrementMP10',
            'MP0',
            'MP100',
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
