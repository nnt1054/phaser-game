
const regen = (target, source) => {
    return {
        key: 'regen',
        target: target,
        source: source,
        timer: 12000,
        tickTimer: 3000,
        icon: 'vercure',
        apply() {
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
        tickTimer: 3000,
        icon: 'verthunder',
        apply() {
            this.target.reduceHealth(5);
            if (this.target.hasAggro) {
        		this.target.addAggro(this.source, 10);
    		}
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.target.reduceHealth(5);
                if (this.target.hasAggro) {
            		this.target.addAggro(this.source, 10);
        		}
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
        tickTimer: 3000,
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

const buffMap = {
	'regen': regen,
	'miasma': dot,
    'acceleration': acceleration,
}

export default buffMap
