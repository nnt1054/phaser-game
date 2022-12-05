import store from '../store/store';
import {
    setPlayerCurrentHealth
} from '../store/playerHealth';
import {
    setTarget,
    removeTarget,
    setTargetCurrentHealth,
    setCotarget,
    removeCotarget,
    setCotargetCurrentHealth,
} from '../store/targetInfo';


export const HealthMixin = {

    health: 50,
    maxHealth: 100,

    setCurrentHealth: function(value) {
        let health = Math.max(value, 0);
        health = Math.min(health, this.maxHealth);
        this.health = health;
        this.updateStore();
    },

    increaseHealth: function(value) {
        this.health = Math.min(this.health + value, this.maxHealth);
        this.updateStore();
    },

    reduceHealth: function(value) {
        this.health = Math.max(this.health - value, 0);
        this.updateStore();
    },

    updateStore: function() {
        if (this.isPlayer) {
            store.dispatch(
                setPlayerCurrentHealth(this.health)
            )
        }

        if (this.isTargeted) {
            store.dispatch(
                setTargetCurrentHealth(this.health)
            )
        }

        if (this.isCotargeted) {
            store.dispatch(
                setCotargetCurrentHealth(this.health)
            )
        }
    },
}


// TargetMixin defines clientside behavior when targeted by the Player
// note: methods are NOT meant to be used when NPC targets a gameObject
export const TargetMixin = {

    currentTarget: null,
    isTargetable: true,

    // isTargeted and isCotargeted are in relation to the Player
    isTargeted: false,
    isCotargeted: false,

    target: function() {
        this.isTargeted = true;
        if (this.currentTarget) {
            this.currentTarget.isCotargeted = true;
        }
        this.name.text = `> ${ this.displayName } <`;
        this.name.style.setFontSize('18px');
        this.name.style.setFill('yellow');
    },

    untarget: function() {
        this.isTargeted = false;
        if (this.currentTarget) {
            this.currentTarget.isCotargeted = false;
        }
        this.name.text = this.displayName;
        this.name.style.setFontSize('16px');
        this.name.style.setFill('white');
    },


    targetObject: function(gameObject) {
        if (gameObject.isTargetable) {
            if (this.isPlayer) {
                if (this.currentTarget) this.currentTarget.untarget();
                this.currentTarget = gameObject;
                gameObject.target();

                if ('health' in gameObject) {
                    store.dispatch(
                        setTarget({
                            targetName: gameObject.displayName,
                            currentHealth: gameObject.health,
                            maxHealth: gameObject.maxHealth,
                        })
                    )
                } else {
                    store.dispatch(
                        setTarget({
                            targetName: gameObject.displayName,
                            currentHealth: null,
                            maxHealth: null,
                        })
                    )
                }

                const cotarget = gameObject.currentTarget;
                if (cotarget) {
                    if ('health' in cotarget) {
                        store.dispatch(
                            setCotarget({
                                targetName: cotarget.displayName,
                                currentHealth: cotarget.health,
                                maxHealth: cotarget.maxHealth,
                            })
                        )
                    } else {
                        store.dispatch(
                            setCotarget({
                                targetName: cotarget.displayName,
                                currentHealth: null,
                                maxHealth: null,
                            })
                        )
                    }
                }

            } else {
                this.currentTarget = gameObject;
            }
        }
    },

    untargetObject: function(gameObject) {
        if (this.currentTarget) {
            if (this.isPlayer) {
                this.currentTarget.untarget();
                store.dispatch(
                    removeTarget()
                )
            }
            this.currentTarget = null;
        }
    },
}
