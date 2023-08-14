import store from '../../store/store';

import {
    setGCD,
    setCast,
} from '../../store/playerState';

import {
    setTargetCast,
    cancelTargetCast,
} from '../../store/targetInfo';


const CastingMixin = {

    hasCasting: true,
    casting: null,
    castTarget: null,
    castProgress: 0,
    castingTimer: 0,

    canCast: function(ability, target) {
        if (ability.canCast) {
            return ability.canCast(this, target);
        } else if (ability.canExecute) {
            return ability.canExecute(this, target);
        }
        return true;
    },

    startCast: function(ability, target) {
        this.casting = ability;
        this.castTarget = target;
        this.castingTimer = ability.castTime;

        if (this.isPlayer) this.faceTarget(this.gcdTarget);

        if (ability.startCast) ability.startCast(this, target);

        if (this.isClientPlayer) {
            store.dispatch(setCast({
                key: ability.name,
                duration: ability.castTime,
            }));
        }

        if (this.isTargeted) {
            store.dispatch(setTargetCast({
                label: ability.name,
                progress: ability.castTime,
                duration: ability.castTime,
            }));
        }
    },

    cancelCast: function() {
        if (this.casting && this.casting.cancelCast) {
            this.casting.cancelCast(this, this.castTarget);
        }

        this.casting = null;
        this.castTarget = null;
        this.castingTimer = 0;


        if (this.isPlayer) {
            // todo figure out what to do with this
            this.directionLockTimer = 0;
            this.gcdTimer = 0;
        }

        if (this.isClientPlayer) {
            store.dispatch(setGCD(0));
            store.dispatch(setCast({
                key: '',
                duration: 0,
            }));
        }

        if (this.isTargeted) {
            store.dispatch(cancelTargetCast());
        }
    },

    updateCast(delta) {
        this.castingTimer = Math.max(0, this.castingTimer - delta);

        if (this.isMoving() && this.casting && this.castingTimer > 750) {
            this.cancelCast();
        }

        if (this.casting && this.castingTimer === 0) {
            this.executeAbility(this.casting, this.castTarget);
            this.casting = null;
            this.castTarget = null;

            if (this.isClientPlayer) {
                store.dispatch(setCast({
                    key: '',
                    duration: 0,
                }));
            }

            if (this.isTargeted) {
                store.dispatch(setTargetCast({
                    label: '',
                    progress: 0,
                    duration: 0,
                }));
            }
        }
    },

    executeAbility(ability, target) {
        if (this.isPlayer) {
            this.faceTarget(target);
        }

        ability.execute(this, target);

        if (this.isPlayer) {
            this.faceTarget(target);

            const duration = ability.gcd ? 350 : 750;
            this.abilityTimer += duration;
            this.directionLockTimer += 500;
            if (ability.gcd && !ability.isComboAction) {
                this.setPlayerComboAction(ability.name);
            }
        }
    },

    calculateCastTime(ability) {
        let castTime = ability.castTime || 0;
        for (const buff of this._buffs) {
            if (buff.modifyCastTime) {
                castTime = buff.modifyCastTime(castTime, buff);
            }
        };
        return Math.max(0, castTime);
    },
};

export default CastingMixin;
