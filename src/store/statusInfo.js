import { createSlice } from '@reduxjs/toolkit';


const statusInfoSlice = createSlice({
  name: 'statusInfo',
  initialState: {
    statuses: [],
  },
  reducers: {
    updateStatuses: (state, action) => {
        state.statuses = action.payload;
    }
  }
})

export const {
    updateStatuses,
} = statusInfoSlice.actions;

export default statusInfoSlice;
