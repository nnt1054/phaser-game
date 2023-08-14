const CombatMixin = {

    inCombat() {
        if (this.hasEnemyList) {
            if (this.enemyList.length > 0) {
                return true;
            }
        }
        if (this.hasCasting && this.casting) return true;
        return false;
    },

    calculateDamageFromPotency(potency, type) {
        let damage = 0;
        if (type == 'physical') {
            const STR = this.getStrengthStat();
            damage = STR * potency;
        } else if (type == 'magical') {
            const INT = this.getIntelligenceStat();
            damage = INT * potency;
        }
        return damage
    },

    dealDamage(target, potency, type, delay) {
        const isPhysical = type == 'physical';
        const isMagical = type == 'magical';

        let damage = this.calculateDamageFromPotency(potency, type);
        for (const buff of this._buffs) {
            if (buff.modifyDamage) {
                damage = buff.modifyDamage(damage);
            }

            if (isPhysical && buff.modifyPhysicalDamage) {
                damage = buff.modifyPhysicalDamage(damage);
            }

            if (isMagical && buff.modifyMagicalDamage) {
                damage = buff.modifyMagicalDamage(damage);
            }
        };

        target.receiveDamage(this, damage, type, delay);
    },

    calculateDotDamage(potency, type, delay) {
        const isPhysical = type == 'physical';
        const isMagical = type == 'magical';

        let damage = this.calculateDamageFromPotency(potency, type);
        for (const buff of this._buffs) {
            if (buff.modifyDamage) {
                damage = buff.modifyDamage(damage);
            }

            if (isPhysical && buff.modifyPhysicalDamage) {
                damage = buff.modifyPhysicalDamage(damage);
            }

            if (isMagical && buff.modifyMagicalDamage) {
                damage = buff.modifyMagicalDamage(damage);
            }
        };
        return damage;
    },

    dealDotDamage(target, damage, type) {
        target.receiveDamage(this, damage, type);
    },
};

export default CombatMixin;
