import store from '../../store/store';

import {
    updateLevel,
} from '../../store/playerState';


const LevelMixin = {
    hasLevel: true,
    currentLevel: 1,

    setLevel(level) {
        this.currentLevel = level;
        this.updateBaseStats();
        this.updateLevelStore();
    },

    updateLevelStore() {
        if (this.isClientPlayer) {
            store.dispatch(updateLevel(this.currentLevel));
        }
    }
}

export default LevelMixin;
