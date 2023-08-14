import store from '../../store/store';

import {
    updateStatuses,
} from '../../store/statusInfo';

import {
    updateTargetStatuses,
} from '../../store/targetInfo';

import statusMap from '../buffs';


const BuffMixin = {
    hasBuffs: true,
    _buffs: [],
    _buffsApplied: [],

    initializeBuffMixin() {
        this._buffs = [];
        this._buffsApplied = [];
    },

    updateStatusInfoStore() {
        const buffs = this._buffs.map(buff => {
            return {
                key: buff.key,
                duration: buff.timer,
                icon: buff.icon,
            }
        })

        if (this.isClientPlayer) {
            store.dispatch(updateStatuses([]));
            store.dispatch(updateStatuses(buffs));
        }

        if (this.isTargeted) {
            store.dispatch(updateTargetStatuses([]));
            store.dispatch(updateTargetStatuses(buffs));
        }
    },

    getBuffCount: function(key) {
        return this._buffs.filter(x => x.key == key).length;
    },

    applyBuff: function(key, source) {
        const buffClass = statusMap[key];
        const buff = buffClass(this, source);
        buff.apply();
        this._buffs.push(buff);
        this.addBuffToSource(buff);
        this.updateStatusInfoStore();
    },

    removeBuff: function(buff, updateSource=true) {
        buff.unapply(this);
        this._buffs = this._buffs.filter((x) => (x !== buff));
        if (updateSource) {
            this.removeBuffFromSource(buff);
        }
        this.updateStatusInfoStore();
    },

    getBuff: function(key) {
        return this._buffs.find(x => x.key == key);
    },

    getAndRemoveBuff: function(key) {
        const buff = this.getBuff(key);
        this.removeBuff(buff);
    },

    updateOrApplyBuff: function(key, source, duration, maxDuration) {
        const buff = this._buffs.find(x => x.key == key && x.source == source);
        if (buff) {
            buff.timer = Math.min(buff.timer + duration, maxDuration);
            if (buff.reapply) buff.reapply();
            this.updateStatusInfoStore();
        } else {
            this.applyBuff(key, source);
        }
    },

    addBuffToSource(buff) {
        const source = buff.source;
        source._buffsApplied.push(buff);
    },

    removeBuffFromSource: function(buff) {
        const source = buff.source;
        source._buffsApplied = source._buffsApplied.filter((x) => (x !== buff));
    },

    unapplyAllBuffsFromSource: function() {
        for (const buff of this._buffsApplied) {
            buff.target.removeBuff(buff, false);
        }
    },

    updateBuffs: function(delta) {
        let shouldUpdate = false;

        for (const buff of this._buffs) {
            buff.timer = Math.max(0, buff.timer - delta);
            if (buff.timer <= 0) {
                buff.unapply(this);
                this.removeBuffFromSource(buff);
                shouldUpdate = true;
            }
        };
        this._buffs = this._buffs.filter((buff) => buff.timer > 0);

        if (shouldUpdate) {
            this.updateStatusInfoStore();
        }

        for (const buff of this._buffs) {
            buff.update(delta);
        };
    },

    clearBuffs: function() {
        this._buffs = [];
        this.updateStatusInfoStore();
    },
}

export default BuffMixin;
