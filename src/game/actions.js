import store from '../store/store';
import {
    incrementHealth,
    setPlayerCurrentHealth,
} from '../store/playerHealth';
import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
} from '../store/playerMana';
import {
    setItemCount,
    subractItemCount,
} from '../store/inventory';
import {
    setAlert,
} from '../store/alert';

const isAny = (player, target) => { return true };
const isEnemy = (player, target) => { return target && target.isEnemy && target.visible };
const isFriendly = (player, target) => { return target && target.hasHealth && !target.isEnemy && target.visible };

const untarget = {
    type: 'system',
    execute: (player) => {
        player.untargetObject();
    },
};

const confirm = {
    type: 'system',
    execute: (player) => {
        if (player.currentTarget) {
            if (player.currentTarget.handleConfirm) {
                player.currentTarget.handleConfirm();
            }
        } else {
            const isReverse = !player.facingRight;
            player.cycleTargets(isReverse);
        }
    },
};

const cycleTarget = {
    type: 'system',
    execute: (player) => {
        player.cycleTargets();
    },
}
const cycleTargetReverse = {
    type: 'system',
    execute: (player) => {
        player.cycleTargets(true);
    },
}

const jolt = {
    name: 'jolt',
    type: 'spell',
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        if (player.isMoving()) return false;
        return true;
    },
    execute: (player, target) => {
        target.reduceHealth(25);
    },
}


const verthunder = {
    name: 'verthunder',
    type: 'ability',
    gcd: true,
    castTime: 0,
    cooldown: 2500,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        // TODO: move to player logic; if castTime > 0; then check if player.isMoving
        // if (player.isMoving()) return false;
        return true;
    },
    execute: (player, target) => {
        target.reduceHealth(25);
    },
}

const fleche = {
    type: 'ability',
    gcd: false,
    cooldown: 1000,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        const [cooldown, duration] = player.cooldownManager.getTimer('fleche');
        if (cooldown > 0) return false;
        return true;
    },
    execute: (player, target) => {
        target.reduceHealth(10);
        player.cooldownManager.startTimer('fleche', 12000);
    },
}

const vercure = {
    name: 'vercure',
    type: 'spell',
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    canTarget: isFriendly,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = (player == target) ? true : Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        if (player.isMoving()) return false;
        return true;
    },
    execute: (player, target) => {
        target.increaseHealth(20);

        // TODO: add MP mixin
        store.dispatch(decrementMana());
    },
}

const potion = {
    name: 'potion',
    type: 'item',
    cooldown: 1000,
    gcd: false,
    canTarget: isAny,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('potion');
        return (cooldown == 0 && player.hasItem('potion'));
    },
    execute: (player) => {
        const itemCount = player.inventory.get('potion') || 0;
        player.inventory.set('potion', itemCount - 1);
        store.dispatch(subractItemCount({
            name: 'potion',
            value: 1,
        }))
        player.setCurrentHealth(100);
        player.cooldownManager.startTimer('potion', 8000);
    },
};

const slice = {
    name: 'slice',
    type: 'weaponskill ',
    gcd: true,
    castTime: 0,
    cooldown: 1500,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.meleeRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        return true;
    },
    execute: (player, target) => {
        target.reduceHealth(15);
    },
}

const actionMap = {
    'jolt': jolt,
    'verthunder': verthunder,
    'vercure': vercure,
    'fleche': fleche,
    'slice': slice,

    // items
    'potion': potion,

    // sys actions
    'untarget': untarget,
    'confirm': confirm,
    'cycleTarget': cycleTarget,
    'cycleTargetReverse': cycleTargetReverse,
}

export default actionMap;
