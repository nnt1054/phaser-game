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

const actionMap = {
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
}

export default actionMap;
