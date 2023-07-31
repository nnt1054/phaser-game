

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
        icon: 'regen',
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

const aero = (target, source) => {
    return {
        key: 'aero',
        target: target,
        source: source,
        timer: 30000,
        icon: 'aero',
        apply() {
            this.tickTimer = 3000;
            this.source.dealDamage(this.target, 5, 'magical');
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.source.dealDamage(this.target, 5, 'magical');
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

const flow = (target, source) => {
    return {
        key: 'flow',
        target: target,
        source: source,
        timer: 45000,
        icon: 'redondo',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamage(damage) {
            return damage * 1.10;
        },
    }
}

const cortoManoReady = (target, source) => {
    return {
        key: 'cortoManoReady',
        target: target,
        source: source,
        timer: 15000,
        icon: 'corto_mano_dash',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const earthlyWeaveReady = (target, source) => {
    return {
        key: 'earthlyWeaveReady',
        target: target,
        source: source,
        timer: 30000,
        icon: 'earthly_weave',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const heavenlyWeaveReady = (target, source) => {
    return {
        key: 'heavenlyWeaveReady',
        target: target,
        source: source,
        timer: 30000,
        icon: 'heavenly_weave',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const earthAligned = (target, source) => {
    return {
        key: 'earthAligned',
        target: target,
        source: source,
        timer: 30000,
        icon: 'earthly_strike',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const heavenAligned = (target, source) => {
    return {
        key: 'heavenAligned',
        target: target,
        source: source,
        timer: 30000,
        icon: 'heavenly_strike',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const enlightenment = (target, source) => {
    return {
        key: 'enlightenment',
        target: target,
        source: source,
        timer: 21000,
        icon: 'enlightenment',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamage(damage) {
            return damage * 1.15;
        },
    }
}

const chakra = (target, source) => {
    return {
        key: 'chakra',
        target: target,
        source: source,
        timer: 120000,
        icon: 'chakra',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const blighted = (target, source) => {
    return {
        key: 'blighted',
        target: target,
        source: source,
        timer: 45000,
        icon: 'blighted',
        apply() {
            this.damage = this.source.calculateDotDamage(5, 'physical');

            this.source.dealDotDamage(this.target, this.damage, 'physical', 5);

            this.tickTimer = 3000;
        },
        reapply() {
            this.damage = this.source.calculateDotDamage(5, 'physical');
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.source.dealDotDamage(this.target, this.damage, 'physical', 5);
            }
        },
    }
}

const contrada = (target, source) => {
    return {
        key: 'contrada',
        target: target,
        source: source,
        timer: 15000,
        icon: 'contrada',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamageReceived(damage) {
            return damage * 0.8;
        },
    }
}

const fireProc = (target, source) => {
    return {
        key: 'fireProc',
        target: target,
        source: source,
        timer: 21000,
        icon: 'fire_ii',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const iceProc = (target, source) => {
    return {
        key: 'iceProc',
        target: target,
        source: source,
        timer: 21000,
        icon: 'ice_ii',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const earthProc = (target, source) => {
    return {
        key: 'earthProc',
        target: target,
        source: source,
        timer: 15000,
        icon: 'earth_ii',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}


const triplecastProc = (target, source) => {
    return {
        key: 'triplecastProc',
        target: target,
        source: source,
        timer: 120000,
        icon: 'triplecast',
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

const shocked = (target, source) => {
    return {
        key: 'shocked',
        target: target,
        source: source,
        timer: 30000,
        icon: 'thunder',
        apply() {
            this.damage = this.source.calculateDotDamage(5, 'magical');

            this.source.dealDotDamage(this.target, this.damage, 'magical', 5);

            this.tickTimer = 3000;
        },
        reapply() {
            this.damage = this.source.calculateDotDamage(5, 'magical');
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.source.dealDotDamage(this.target, this.damage, 'magical', 5);
            }
        },
    }
}

const manaStack = (target, source) => {
    return {
        key: 'manaStack',
        target: target,
        source: source,
        timer: 120000,
        icon: 'mana_stack',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}

const swiftcast = (target, source) => {
    return {
        key: 'swiftcast',
        target: target,
        source: source,
        timer: 30000,
        icon: 'swiftcast',
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

// const ascendance = (target, source) => {
//     return {
//         key: 'ascendance',
//         target: target,
//         source: source,
//         timer: 12000,
//         icon: 'ascendance',
//         apply() {},
//         unapply() {},
//         update(delta) {
//             if (this.target.isMoving()) {
//                 this.target.removeBuff(this);
//             };
//         },
//         modifyCastTime(castTime, ability) {
//             return 0;
//         },
//     }
// }


const manafont = (target, source) => {
    return {
        key: 'manafont',
        target: target,
        source: source,
        timer: 240000,
        icon: 'manafont',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyMagicalDamage(damage) {
            if (this.target.getBuffCount('manaStack') >= 5) {
                return damage * 1.2;
            }
            return damage;
        },
    }
}


const arrowStock = (target, source) => {
    return {
        key: 'arrowStock',
        target: target,
        source: source,
        timer: 60000,
        icon: 'quick_draw',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}


const wounded = (target, source) => {
    return {
        key: 'wounded',
        target: target,
        source: source,
        timer: 60000,
        icon: 'wounded',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}


const precisionBlock = (target, source) => {
    return {
        key: 'precisionBlock',
        target: target,
        source: source,
        timer: 15000,
        icon: 'knight',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamageReceived(damage) {
            if (damage > 0) {
                target.removeBuff(this);
                target.applyBuff('precisionCounter', target);
                return damage * 0.8;
            } else {
                return damage;
            }
        },
    }
}


const precisionCounter = (target, source) => {
    return {
        key: 'precisionCounter',
        target: target,
        source: source,
        timer: 15000,
        icon: 'knight',
        apply() {},
        unapply() {},
        update(delta) {},
    }
}


const rampart = (target, source) => {
    return {
        key: 'rampart',
        target: target,
        source: source,
        timer: 15000,
        icon: 'rampart',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamageReceived(damage) {
            return damage * 0.8;
        },
    }
}


const reprisal = (target, source) => {
    return {
        key: 'rampart',
        target: target,
        source: source,
        timer: 15000,
        icon: 'rampart',
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamage(damage) {
            return damage * 0.8;
        },
    }
}


const simpleDomain = (target, source) => {
    return {
        key: 'simpleDomain',
        target: target,
        source: source,
        timer: 8000,
        icon: 'ascendance', // change later
        apply() {},
        unapply() {},
        update(delta) {
            if (this.target.isMoving()) {
                this.target.removeBuff(this);
            };
        },
    }
}


const simpleDomainProtected = (target, source) => {
     return {
        key: 'simpleDomainProtected',
        target: target,
        source: source,
        timer: 8000,
        icon: 'ascendance', // change later
        apply() {},
        unapply() {},
        update(delta) {},
        modifyDamageReceived(damage) {
            if (damage > 0) {
                if (this.source.getBuff('simpleDomain') && this.source.getBuffCount('superCounterStack') < 4) {
                    this.source.applyBuff('superCounterStack', this.source)
                }
            }
            return damage * 0.8;
        },
    }   
}


const superCounterStack = (target, source) => {
    return {
        key: 'superCounterStack',
        target: target,
        source: source,
        timer: 15000,
        icon: 'rampart',
        apply() {},
        unapply() {},
        update(delta) {
            if (this.target.isMoving()) {
                this.target.removeBuff(this);
            };
        },
    }
}


const superCounterReady = (target, source) => {
    return {
        key: 'superCounterReady',
        target: target,
        source: source,
        timer: 15000,
        icon: 'rampart',
        apply() {},
        unapply() {},
        update(delta) {
            if (this.target.isMoving()) {
                this.target.removeBuff(this);
            };
        },
    }
}


const buffMap = {
	'regen': regen,
	'miasma': dot,
    'aero': aero,
    'acceleration': acceleration,
    'embolden': embolden,
    'flow': flow,
    'cortoManoReady': cortoManoReady,
    'earthlyWeaveReady': earthlyWeaveReady,
    'heavenlyWeaveReady': heavenlyWeaveReady,
    'earthAligned': earthAligned,
    'heavenAligned': heavenAligned,
    'enlightenment': enlightenment,
    'chakra': chakra,
    'blighted': blighted,
    'contrada': contrada,
    'fireProc': fireProc,
    'iceProc': iceProc,
    'earthProc': earthProc,
    'triplecastProc': triplecastProc,
    'shocked': shocked,
    'manaStack': manaStack,
    'swiftcast': swiftcast,
    // 'ascendance': ascendance,
    'manafont': manafont,
    'arrowStock': arrowStock,
    'wounded': wounded,
    'precisionBlock': precisionBlock,
    'precisionCounter': precisionCounter,

    'rampart': rampart,
    'reprisal': reprisal,

    'simpleDomain': simpleDomain,
    'simpleDomainProtected': simpleDomainProtected,
    'superCounterStack': superCounterStack,
}

export default buffMap
