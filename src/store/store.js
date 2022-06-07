import { configureStore } from '@reduxjs/toolkit';

import playerHealthSlice from './playerHealth';
import playerManaSlice from './playerMana';

export default configureStore({
    reducer: {
        playerHealth: playerHealthSlice.reducer,
        playerMana: playerManaSlice.reducer,
    }
})
