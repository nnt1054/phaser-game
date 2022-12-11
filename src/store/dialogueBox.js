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

    options: [],
    currentOption: 0,
  },
  reducers: {
    setDialogue: (state, action) => {
        state.display = true;
        state.name = action.payload.name;
        state.messageIndex = 0;
        state.messages = action.payload.messages;
        state.complete = false;
        state.options = action.payload.options ?? [];
    },
    clearDialogue: (state) => {
        state.display = false;
        state.name = '';
        state.messageIndex = 0;
        state.messages = [];
        state.complete = true;
        state.options = [];
    },
    getNextMessage: (state) => {
        if (state.options.length > 0) {
            console.log('dont advance');
        } else {
            state.messageIndex += 1;
            if (state.messageIndex >= state.messages.length) {
                state.display = false;
                state.complete = true;
                state.messageIndex = 0;
                state.messages = [];
                state.options = [];
            }
        }
    },
    setCurrentOption: (state, action) => {
        state.currentOption = action.payload;
    },
    submitCurrentOption: (state) => {
        // signal completed dialogue
        // read state.currentOption as submission
        state.display = false;
        state.complete = true;
        state.messageIndex = 0;
        state.messages = [];
        state.options = [];
    },
  }
})

export const {
    setDialogue,
    clearDialogue,
    getNextMessage,
    setCurrentOption,
    submitCurrentOption,
} = dialogueBoxSlice.actions;

export default dialogueBoxSlice;
