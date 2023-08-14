import store from '../../store/store';

import {
    setCooldowns,
} from '../../store/playerState';


const CooldownMixin = {
    hasCooldowns: true,
    cooldowns: null,

    initializeCooldowns: function() {
        this.cooldowns = new Map();
    },

    getCooldown: function(key) {
        return this.cooldowns.get(key) || [0, 0]
    },

    startCooldown: function(key, duration) {
        this.cooldowns.set(key, [duration, duration]);
        if (this.isClientPlayer) {
            this.updateCooldownsStore();
        }
    },

    updateCooldowns(delta) {
        let shouldUpdateStore = false
        for (var [key, value] of this.cooldowns.entries()) {
            const [current, duration] = value;
            const timeLeft = Math.max(0, current - delta);
            if (timeLeft <= 0) {
                shouldUpdateStore = true;
                this.cooldowns.delete(key);
            } else {
                this.cooldowns.set(key, [timeLeft, duration]);
            }
        }
        if (shouldUpdateStore) {
            this.updateCooldownsStore(); 
        }
    },

    updateCooldownsStore() {
        if (this.isClientPlayer) {
            store.dispatch(
                setCooldowns(
                    Object.fromEntries(this.cooldowns)
                )
            );
        }
    },
};

export default CooldownMixin;
