import { createSlice } from '@reduxjs/toolkit';
import store from './store';

const dialogueBoxSlice = createSlice({
  name: 'dialogueBox',
  initialState: {
    display: false,
    left: 50,
    bottom: 10,
    zIndex: 10000,

    name: '',
    messageIndex: 0,
    messages: [],
    complete: true,
  },
  reducers: {
    setDialogue: (state, action) => {
        state.display = true;
        state.name = action.payload.name;
        state.messageIndex = 0;
        state.messages = action.payload.messages;
        state.complete = false;
    },
    clearDialogue: (state) => {
        state.display = false;
        state.name = '';
        state.messageIndex = 0;
        state.messages = [];
        state.complete = true;
    },
    getNextMessage: (state) => {
        state.messageIndex += 1;
        if (state.messageIndex >= state.messages.length) {
            state.display = false;
            state.complete = true;
        }
    },
  }
})

export const {
    setDialogue,
    clearDialogue,
    getNextMessage,
} = dialogueBoxSlice.actions;

export default dialogueBoxSlice;
