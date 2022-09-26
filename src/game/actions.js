import store from '~/src/store/store';
import {
    incrementHealth,
} from '~/src/store/playerHealth';

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
    cooldown: 2500,
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
    },
}

const setFrame01 = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 0,
    execute: (player) => {
        player.paused = true;
        player.character.setToFrame(1);
    },
}

const setFrame02 = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 0,
    execute: (player) => {
        player.paused = true;
        player.character.setToFrame(2);
    },
}

const setFrame00 = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 0,
    execute: (player) => {
        player.paused = true;
        player.character.setToFrame(0);
    },
}

const actionMap = {
    'attack': basicAttack,
    'heal': basicHeal,
    'pause': pauseAnim,
    'resume': resumeAnim,
    'frame01': setFrame01,
    'frame02': setFrame02,
    'frame00': setFrame00,
}

export default actionMap;
