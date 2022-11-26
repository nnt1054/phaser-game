import store from '../store/store';
import {
    incrementHealth,
} from '../store/playerHealth';
import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
} from '../store/playerMana';

const basicAbility = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 2500,
    execute: (player) => {},
}

const basicAttack = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    execute: (player) => {
        store.dispatch(incrementHealth());
    },
}

const floss = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    gcd: true,
    cooldown: 800,
    execute: (player) => {
        // store.dispatch(incrementMana());
    },
}

const fleche = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
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
}

export default actionMap;
