import { createSlice } from '@reduxjs/toolkit';

const playerStateSlice = createSlice({
  name: 'playerState',
  initialState: {
    queuedAbility: null,

    // cursors
    up: 0,
    down: 0,
    left: 0,
    right: 0,

    // how does jumping work?
    // 1. detect onclick and dispatches jump=True
    // 2. observeStore listens for change
    // 3. observeStore sets player.jumpOnNextUpdate=True
    // 4. observeStore dispatches jump=False
    // 5. next update loop we check for player.jumpOnNextUpdate
    // 6. player executes jump logic and sets jumpOnNextUpdate=False
    // 7. easy and epic
    jump: false,

    // also only need 1 observer
    // we can declare this in Player code and later break it out into like
    // a Controller mixin idk we'll see

    // oh wait queued ability is already listening to the same slice
    // so observeStore listens for changes to the WHOLE store?
    // so on the react end, there's only really ONE subscriber (which is the <Provider>)
    // so for phaser/engine, we can also just work with one subscriber and build a
    // context handler
  },
  reducers: {
    setQueuedAbility: (state, action) => {
        if (!state.queuedAbility) {
            state.queuedAbility = action.payload;
        }
    },
    clearQueuedAbility: (state) => {
        state.queuedAbility = null;
    },
    clearInputQueues: (state) => {
        state.queuedAbility = null;
        state.jump = false;
    }
  }
})

export const {
    setQueuedAbility,
    clearQueuedAbility,
    clearInputQueues,
} = playerStateSlice.actions;

export default playerStateSlice;
