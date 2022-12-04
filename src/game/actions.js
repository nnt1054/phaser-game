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

const basicAbility = {
    type: 'ability',
    charges: -1,
    cost: -1,
    cooldown: 2500,
    execute: (player) => {},
}

const basicAttack = {
    type: 'ability',
    charges: -1,
    cost: -1,
    cooldown: 1000,
    execute: (player) => {
        player.isAttacking = true;
        player.character.play('run', false);
        setTimeout(() => player.isAttacking = false, 1000);
    },
}

const basicHeal = {
    name: 'heal',
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    execute: (player, target) => {
        store.dispatch(decrementMana());
        target.increaseHealth(20);
    },
}

const floss = {
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    cooldown: 1000,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('floss');
        return (cooldown == 0 && player.body.onFloor());
    },
    execute: (player) => {
        player.doEmote('floss');
        player.cooldownManager.startTimer('floss', 12000);
    },
}

const basicMelee = {
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    cooldown: 1500,
    execute: (player) => {
        // store.dispatch(incrementMana());
    },
}

const fleche = {
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: false,
    cooldown: 1000,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('fleche');
        return (cooldown == 0);
    },
    execute: (player) => {
        player.cooldownManager.startTimer('fleche', 12000);
    },
}

const manafication = {
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: false,
    cooldown: 1000,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('manafication');
        return (cooldown == 0);
    },
    execute: (player) => {
        player.cooldownManager.startTimer('manafication', 30000);
        store.dispatch(setPlayerCurrentMana(100));
    },
}

const embolden = {
    type: 'ability',
    charges: -1,
    cost: -1,
    cooldown: 1000,
    gcd: false,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('embolden');
        return (cooldown == 0);
    },
    execute: (player) => {
        player.cooldownManager.startTimer('embolden', 30000);
    },
}

const jolt = {
    name: 'jolt',
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    canExecute: (player) => {
        return true;
    },
    execute: (player) => {
        store.dispatch(decrementMana());
    },
}

const verthunder = {
    name: 'verthunder',
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    cooldown: 2500,
    canExecute: (player) => {
        return true;
    },
    execute: (player) => {
        store.dispatch(decrementMana());
    },
}

const verflare = {
    name: 'verflare',
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    cooldown: 2500,
    canExecute: (player) => {
        return true;
    },
    execute: (player) => {
        store.dispatch(decrementMana());
    },
}

const verraise = {
    type: 'ability',
    charges: -1,
    cost: -1,
    gcd: true,
    cooldown: 4000,
    canExecute: (player) => {
        return true;
    },
    execute: (player) => {
        store.dispatch(decrementMana());
        store.dispatch(setPlayerCurrentMana(0));
    },
}

const potion = {
    type: 'item',
    charges: -1,
    cost: -1,
    cooldown: 1000,
    gcd: false,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('potion');
        const itemCount = player.inventory.get('potion') || 0;
        return (cooldown == 0 && itemCount > 0);
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
}

const actionMap = {
    'attack': basicAttack,
    'heal': basicHeal,
    'floss': floss,
    'melee': basicMelee,
    'fleche': fleche,
    'manafication': manafication,
    'embolden': embolden,
    'jolt': jolt,
    'verthunder': verthunder,
    'verflare': verflare,
    'verraise': verraise,

    // items
    'potion': potion,
}

export default actionMap;
