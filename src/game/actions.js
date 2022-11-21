import store from '../store/store';
import {
    incrementHealth,
} from '../store/playerHealth';
import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
} from '../store/playerMana';
import {
    setFrameIndex,
} from '../store/aniEditor';

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
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 2000,
    execute: (player) => {
        store.dispatch(incrementHealth());
    },
}

const pauseAnim = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 0,
    execute: (player) => {
        player.paused = true;
        player.character.pause();
    },
}

const resumeAnim = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 0,
    execute: (player) => {
        player.paused = false;
        player.character.resume();
        store.dispatch(setFrameIndex(null));
    },
}

const copyAnimToClipboard = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 0,
    execute: (player) => {
        let json = player.character.toJSON();
        navigator.clipboard.writeText(json);
    },
}

function setFrame(i) {
    return {
        type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
        charges: -1,
        cost: -1,
        cooldown: 0,
        execute: (player) => {
            player.paused = true;
            player.character.setToFrame(i);
        },
    }
}

function updateFrameConfig(key, i) {
    return {
        type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
        charges: -1,
        cost: -1,
        cooldown: 0,
        execute: (player) => {
            player.character.updateFrameConfig(key, i);
        },
    }
}

function updateFrameKey(i) {
    return {
        type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
        charges: -1,
        cost: -1,
        cooldown: 0,
        execute: (player) => {
            player.character.updateFrameKey(i);
        },
    }
}

const floss = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
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
    cooldown: 800,
    execute: (player) => {
        // store.dispatch(incrementMana());
    },
}

const fleche = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
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
    cooldown: 1000,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('manafication');
        return (cooldown == 0);
    },
    execute: (player) => {
        player.cooldownManager.startTimer('manafication', 60000);
        store.dispatch(setPlayerCurrentMana(100));
    },
}

const embolden = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 1000,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('embolden');
        return (cooldown == 0);
    },
    execute: (player) => {
        player.cooldownManager.startTimer('embolden', 60000);
    },
}

const jolt = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 2000,
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
    'pause': pauseAnim,
    'resume': resumeAnim,
    'frame0': setFrame(0),
    'frame1': setFrame(1),
    'frame2': setFrame(2),
    'frame3': setFrame(3),
    'frame4': setFrame(4),
    'frame5': setFrame(5),
    'frame6': setFrame(6),
    'frame7': setFrame(7),
    'frame8': setFrame(8),
    'frame9': setFrame(9),
    'frame10': setFrame(10),
    'frame11': setFrame(11),
    'frame12': setFrame(12),
    'copyAnim': copyAnimToClipboard,
    'incrementTranslateX': updateFrameConfig('translateX', 1),
    'decrementTranslateX': updateFrameConfig('translateX', -1),
    'incrementTranslateY': updateFrameConfig('translateY', -1),
    'decrementTranslateY': updateFrameConfig('translateY', 1),
    'incrementRotate': updateFrameConfig('rotate', 1),
    'decrementRotate': updateFrameConfig('rotate', -1),
    'incrementFrameKey': updateFrameKey(1),
    'decrementFrameKey': updateFrameKey(-1),
    'floss': floss,
    'melee': basicMelee,
    'fleche': fleche,
    'manafication': manafication,
    'embolden': embolden,
    'jolt': jolt,
    'verraise': verraise,
}

export default actionMap;
