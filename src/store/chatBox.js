import { createSlice } from '@reduxjs/toolkit';

const chatBoxSlice = createSlice({
	name: 'chatBox',
	initialState: {
		messages: [],
	},
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload);
		},
	}
});

export const {
	addMessage,
} = chatBoxSlice.actions

export default chatBoxSlice;
