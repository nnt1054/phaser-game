const AggroMixin = {
    hasAggro: true,

    highestAggro: null,
    aggroMap: new Map(),

    initializeAggroMixin() {
        this.aggroMap = new Map();
    },

    addAggro: function(gameObject, amount) {
        if (amount == null) amount = 1;
        const currentAggro = this.aggroMap.get(gameObject) || 0;
        const newAggro = currentAggro + amount;
        this.aggroMap.set(gameObject, newAggro);

        if (!this.highestAggro) {
            this.highestAggro = gameObject;
        } else {
            const currentHighestAggro = this.aggroMap.get(this.highestAggro) || 0;
            if (newAggro > currentHighestAggro) {
                this.highestAggro = gameObject;
            }
        }

        if (gameObject.hasEnemyList) {
            gameObject.addToEnemyList(this);
        }
    },

    resetAggro: function() {
        this.highestAggro = null;
        this.aggroMap = new Map();
    }
}

export default AggroMixin;
