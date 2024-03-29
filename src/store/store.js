import { configureStore, createSlice } from '@reduxjs/toolkit';
import EventEmitter from 'events';

import playerHealthSlice from './playerHealth';
import playerManaSlice from './playerMana';
import playerStateSlice from './playerState';
import hotBarsSlice from './hotBars';
import aniEditorSlice from './aniEditor';
import inputManagerSlice from './inputManager';
import menuStatesSlice from './menuStates';
import characterPreviewSlice from './characterPreview';
import inventorySlice from './inventory';
import targetInfoSlice from './targetInfo';
import dialogueBoxSlice from './dialogueBox';
import alertSlice from './alert';
import skillsMenuSlice from './skillsMenu';
import enemyListSlice from './enemyList';
import chatBoxSlice from './chatBox';
import statusInfoSlice from './statusInfo';


export default configureStore({
    reducer: {
        playerHealth: playerHealthSlice.reducer,
        playerMana: playerManaSlice.reducer,
        playerState: playerStateSlice.reducer,
        hotBars: hotBarsSlice.reducer,
        aniEditor: aniEditorSlice.reducer,
        inputManager: inputManagerSlice.reducer,
        menuStates: menuStatesSlice.reducer,
        characterPreview: characterPreviewSlice.reducer,
        inventory: inventorySlice.reducer,
        targetInfo: targetInfoSlice.reducer,
        dialogueBox: dialogueBoxSlice.reducer,
        alert: alertSlice.reducer,
        skills: skillsMenuSlice.reducer,
        enemyList: enemyListSlice.reducer,
        chatBox: chatBoxSlice.reducer,
        statusInfo: statusInfoSlice.reducer,
    },
})
