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
    addItemCount,
    subractItemCount,
} from '../store/inventory';
import {
    setAlert,
} from '../store/alert';
import {
    addMessage,
} from '../store/chatBox';
import buffs from './buffs';

import helmets from './equipment/helmets';

const isAny = (player, target) => { return true };
const isEnemy = (player, target) => { return target && target.isEnemy && target.visible };
const isFriendly = (player, target) => { return target && target.hasHealth && !target.isEnemy && target.visible };

const untarget = {
    type: 'system',
    execute: (player) => {
        if (player.casting) {
            player.cancelCast();
        } else {
            player.untargetObject();
        }
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

const sendChat = {
    type: 'sendChat',
    execute: (player, text) => {
        player.displayMessage(text);
        store.dispatch(addMessage(`${ player.displayName}: ${ text }`));
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

const targetEnemyFromEnemyList = {
    type: 'system',
    execute: (player, index) => {
        player.targetEnemyFromEnemyList(index);
    },
}

const cycleTargetFromEnemyList = {
    type: 'system',
    execute: (player) => {
        player.cycleTargetFromEnemyList();
    },
}

const cycleTargetFromEnemyListReverse = {
    type: 'system',
    execute: (player) => {
        player.cycleTargetFromEnemyList(true);
    },
}

const equipHelmet = {
    type: 'system',
    execute: (player, itemId) => {
        if (player.inCombat()) {
            store.dispatch(setAlert('Cannot change equipment while in combat.'));
            return;
        }

        const item = helmets[itemId]
        if (!item) return;

        const itemCount = player.inventory.get(item.name) || 0;
        if (itemCount < 1) return;

        const currentItem = player.equipped.helmet;

        player.removeItem(item.name);
        player.equipHelmet(item);
        if (player.currentJob.name != item.job) {
            player.setJob(item.job);
        }

        // store.dispatch(setHelmet(item));
        if (currentItem) {
            player.addItem(currentItem.name);
        }
    },
}

const potion = {
    name: 'potion',
    type: 'item',
    gcd: false,
    canTarget: isAny,
    canExecute: (player) => {
        const [cooldown, duration] = player.getCooldown('potion');
        return (cooldown == 0 && player.hasItem('potion'));
    },
    execute: (player) => {
        const itemCount = player.inventory.get('potion') || 0;
        player.inventory.set('potion', itemCount - 1);
        store.dispatch(subractItemCount({
            name: 'potion',
            value: 1,
        }))
        player.setCurrentHealth(player.maxHealth, true);
        player.startCooldown('potion', 8000);
    },
};

export const systemActionMap = {
    'untarget': untarget,
    'confirm': confirm,
    'sendChat': sendChat,
    'cycleTarget': cycleTarget,
    'cycleTargetReverse': cycleTargetReverse,
    'targetEnemyFromEnemyList': targetEnemyFromEnemyList,
    'cycleTargetFromEnemyList': cycleTargetFromEnemyList,
    'cycleTargetFromEnemyListReverse': cycleTargetFromEnemyListReverse,
    'equipHelmet': equipHelmet,
};

export const itemActionMap = {
    'potion': potion,
};
