import { createSlice } from '@reduxjs/toolkit';


const enemyListSlice = createSlice({
  name: 'enemyList',
  initialState: {
    activeIndex: null,
    enemies: [],
  },
  reducers: {
    updateEnemyList: (state, action) => {
        state.enemies = action.payload;
    }
  }
})

export const {
    updateEnemyList,
} = enemyListSlice.actions;

export default enemyListSlice;
