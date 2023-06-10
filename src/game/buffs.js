

const temp = (target, source) => {
    return {
        key: 'temp',

        target: target, // game object to apply buff
        source: source, // game object applying buff

        timer: 12000, // todo: buff duration should be calculated before apply
        icon: 'temp',

        apply() {}, // on buff apply
        unapply() {}, // on buff unapply
        update(delta) {}, // on update loop

        modifyCastTime(castTime, ability) {}, // run before cast

        modifyDamage(damage) {}, // on dealing damage
        modifyMagicalDamage(damage) {}, // on dealing magical damage
        modifyPhysicalDamage(damage) {}, // on dealing physical damage

        modifyDamageReceived(damage) {}, // on receiving damage
        modifyMagicalDamageReceived(damage) {}, // on receiving magical damage
        modifyPhysicalDamageReceived(damage) {}, // on receiving physical damage
    }
}


const regen = (target, source) => {
    return {
        key: 'regen',
        target: target,
        source: source,
        timer: 12000,
        icon: 'vercure',
        apply() {
            this.tickTimer = 3000;
            this.target.increaseHealth(10);
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.target.increaseHealth(10);
            }
        },
    }
}


const dot = (target, source) => {
    return {
        key: 'dot',
        target: target,
        source: source,
        timer: 30000,
        icon: 'verthunder',
        apply() {
            this.tickTimer = 3000;
            this.source.dealDamage(this.target, 'magical', 5);
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.source.dealDamage(this.target, 'magical', 5);
            }
        },
    }
}

const acceleration = (target, source) => {
    return {
        key: 'acceleration',
        target: target,
        source: source,
        timer: 30000,
        icon: 'acceleration',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyCastTime(castTime, ability) {
            if (castTime > 0) {
                this.target.removeBuff(this);
                return 0;
            }
            return castTime;
        },
    }
}

const embolden = (target, source) => {
    return {
        key: 'embolden',
        target: target,
        source: source,
        timer: 30000,
        icon: 'embolden',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyMagicalDamage(damage) {
            return damage * 1.15;
        },
    }
}

const aero = (target, source) => {
    return {
        key: 'aero',
        target: target,
        source: source,
        timer: 30000,
        icon: 'verthunder',
        apply() {
            this.tickTimer = 3000;
            this.source.dealDamage(this.target, 'magical', 5);
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.source.dealDamage(this.target, 'magical', 5);
            }
        },
    }
}

const buffMap = {
	'regen': regen,
	'miasma': dot,
    'aero': aero,
    'acceleration': acceleration,
    'embolden': embolden,
}

export default buffMap
