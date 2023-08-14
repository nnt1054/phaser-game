import store from '../../store/store';

import {
    setAlert,
} from '../../store/alert';

import {
    setGCD,
    setComboAction,
} from '../../store/playerState';

import {
    systemActionMap,
    itemActionMap,
} from '../actions';


const ActionController = {

    gcdQueue: null,
    gcdTarget: null,
    gcdTimer: 0,
    abilityTimer: 0,
    systemAction: null,
    systemActionTarget: null,

    comboAction: null,
    comboActionTimer: 0,

    queueSystemAction(actionName, target) {
        if (!actionName) return;
        const action = systemActionMap[actionName];
        if (!action) return;
        if (this.systemAction) return;
        this.systemAction = action;
        this.systemActionTarget = target;
    },

    updateSystemAction(delta) {
        if (this.systemAction) {
            this.systemAction.execute(this, this.systemActionTarget);
            this.systemAction = null;
            this.systemActionTarget = null;
        }
    },

    queueAbility(abilityName, target) {
        if (!abilityName) return;

        let ability;
        if (abilityName in this.currentJob.abilities) {
            ability = this.currentJob.abilities[abilityName];
        } else if (abilityName in itemActionMap) {
            ability = itemActionMap[abilityName];
        };

        if (!ability) {
            if (this.isClientPlayer) {
                store.dispatch(setAlert('Invalid Action.'));
            }
            return;
        }

        // todo: do we still need this?
        // override
        if (ability.override) {
            const abilityNameOverride = ability.override(this);
            if (abilityNameOverride) {
                abilityName = abilityNameOverride;
                ability = this.currentJob.abilities[abilityName];
            }
        };

        if (!ability) {
            if (this.isClientPlayer) {
                store.dispatch(setAlert('Invalid Action.'));
            }
            return;
        }

        if (this.gcdQueue) return;
        if (ability.gcd && this.gcdTimer > 500) return;
        if (this.casting && this.castingTimer > 500) return;

        let targetObject;
        if (this.currentTarget && ability.canTarget(this, this.currentTarget)) {
            targetObject = this.currentTarget;
        } else if (ability.canTarget(this, this)) {
            targetObject = this;
        } else if (ability.canTarget(this, null)) {
            targetObject = null;
        } else if (this.currentTarget == null) {
            const isReverse = !this.facingRight;
            this.cycleTargets(isReverse);
            if (this.currentTarget == null) {
                if (this.isClientPlayer) {
                    store.dispatch(setAlert('Invalid Target.'));
                }
            }
            return;
        } else {
            if (this.isClientPlayer) {
                store.dispatch(setAlert('Invalid Target.'));
            }
            return;
        }

        if (ability.canExecute(this, targetObject)) {
            this.gcdQueue = ability;
            this.gcdTarget = targetObject;
        } else {
            return;
        }
    },

    updateAbilityState(delta) {
        this.comboActionTimer = Math.max(0, this.comboActionTimer - delta);
        if (this.comboAction && this.comboActionTimer <= 0) {
            this.setPlayerComboAction('');
        }

        const previousGcdTimer = this.gcdTimer;
        this.gcdTimer = Math.max(0, this.gcdTimer - delta);
        this.abilityTimer = Math.max(0, this.abilityTimer - delta);
        if (previousGcdTimer && this.gcdTimer == 0) {
            if (this.isClientPlayer) {
                store.dispatch(setGCD(0));
            }
        }

        // check if can execute
        const ability = this.gcdQueue;
        if (!ability) return;
        if (this.abilityTimer > 0) return;
        if (this.castingTimer > 0) return;
        if (ability.gcd && this.gcdTimer > 0) return;

        if (ability.canExecute(this, this.gcdTarget)) {
            const gcdCooldown = this.calculateGcdCooldown(ability);
            const castTime = this.calculateCastTime(ability);

            // ability execution
            if (castTime > 0) {
                this.startCast(ability, this.gcdTarget);
                this.directionLockTimer += ability.castTime;
            } else {
                this.executeAbility(ability, this.gcdTarget);
            }

            if (ability.gcd) {
                this.gcdTimer += gcdCooldown;
                if (this.isClientPlayer) {
                    store.dispatch(setGCD(gcdCooldown));
                }
            }
        }

        this.gcdQueue = null;
        this.gcdTarget = null;
    },

    calculateGcdCooldown(ability) {
        let gcdCooldown = ability.cooldown || 0;
        if (ability.overrideCooldown) {
            gcdCooldown = ability.overrideCooldown(this);
        }
        for (const buff of this._buffs) {
            if (buff.modifyGcdCooldown) {
                gcdCooldown = buff.modifyGcdCooldown(gcdCooldown, buff);
            }
        };
        return Math.max(0, gcdCooldown);
    },

    setPlayerComboAction(actionName) {
        this.comboAction = actionName;
        this.comboActionTimer = 15000;
        if (this.isClientPlayer) {
            store.dispatch(setComboAction(this.comboAction));
        }
    },
}

export default ActionController;
