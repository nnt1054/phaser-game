import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
	name: 'alert',
	initialState: {
		message: '',
		counter: 0,
	},
	reducers: {
		setAlert: (state, action) => {
			state.message = action.payload;
			state.counter += 1;
		},
		clearAlert: (state) => {
			state.message = '';
		},
	}
});

export const {
	setAlert,
	clearAlert,
} = alertSlice.actions

export default alertSlice;
