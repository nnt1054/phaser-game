import { configureStore, createSlice } from '@reduxjs/toolkit';

import playerHealthSlice from './playerHealth';
import playerManaSlice from './playerMana';
import playerStateSlice from './playerState';
import hotBarsSlice from './hotBars';
import aniEditorSlice from './aniEditor';
import inputManagerSlice from './inputManager';

export default configureStore({
    reducer: {
        playerHealth: playerHealthSlice.reducer,
        playerMana: playerManaSlice.reducer,
        playerState: playerStateSlice.reducer,
        hotBars: hotBarsSlice.reducer,
        aniEditor: aniEditorSlice.reducer,
        inputManager: inputManagerSlice.reducer,
    }
})
