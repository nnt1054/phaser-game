import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
} from '../store/playerMana';

import {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
} from '../store/playerHealth';

import {
    setQueuedAbility,
    setCursorState,
    setJump,
} from '../store/playerState';

import {
    doNothing,
    setPosition,
} from '../store/hotBars';

import {
    setFrameIndex,
    toggleCompositeState,
    clearCompositeStates,
} from '../store/aniEditor';

import {
    toggleMenuVisible,
    closeMenus,
} from '../store/menuStates';

import * as styles from '../App.module.css';


const reducerMap = {
    'jump': {
        label: 'jump',
        action: setJump(),
    },
    'jumpCursor': {
        label: 'jump',
        action: setCursorState({
            cursor: 'jump',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'jump',
            value: 0,
        }),
    },
    'left': {
        label: 'left',
        action: setCursorState({
            cursor: 'left',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'left',
            value: 0,
        }),
    },
    'right': {
        label: 'right',
        action: setCursorState({
            cursor: 'right',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'right',
            value: 0,
        }),
    },
    'up': {
        label: 'up',
        action: setCursorState({
            cursor: 'up',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'up',
            value: 0,
        }),
    },
    'down': {
        label: 'down',
        action: setCursorState({
            cursor: 'down',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'down',
            value: 0,
        }),
    },
    'decrementHP10': {
        label: '-10 HP',
        action: decrementHealth(),
    },
    'incrementHP10': {
        label: '+10 HP',
        action: incrementHealth(),
    },
    'HP0': {
        label: '0% HP',
        action: setPlayerCurrentHealth(0),
    },
    'HP100': {
        label: '100% HP',
        action: setPlayerCurrentHealth(100),
    },
    'decrementMP10': {
        label: '-10 MP',
        action: decrementMana(),
    },
    'incrementMP10': {
        label: '+10 MP',
        action: incrementMana(),
    },
    'MP0': {
        label: '0% MP',
        action: setPlayerCurrentMana(0),
    },
    'MP100': {
        label: '100% MP',
        action: setPlayerCurrentMana(100),
    },
    'empty': {
        label: '',
        action: doNothing(),
    },
    'pause': {
        label: 'Stop',
        action: setQueuedAbility('pause'),
    },
    'resume': {
        label: 'Play',
        action: setQueuedAbility('resume'),
    },
    'select_all_composite_state': {
        label: 'All',
        action: clearCompositeStates(true),
    },
    'unselect_all_composite_state': {
        label: 'Rst',
        action: clearCompositeStates(false),
    },
    'copy_anim_to_clipboard': {
        label: 'Cpy',
        action: setQueuedAbility('copyAnim'),
    },
    'incrementTranslateX': {
        label: '→',
        action: setQueuedAbility('incrementTranslateX'),
    },
    'decrementTranslateX': {
        label: '←',
        action: setQueuedAbility('decrementTranslateX'),
    },
    'incrementTranslateY': {
        label: '↑',
        action: setQueuedAbility('incrementTranslateY'),
    },
    'decrementTranslateY': {
        label: '↓',
        action: setQueuedAbility('decrementTranslateY'),
    },
    'incrementRotate': {
        label: '↷',
        action: setQueuedAbility('incrementRotate'),
    },
    'decrementRotate': {
        label: '↶',
        action: setQueuedAbility('decrementRotate'),
    },
    'incrementFrameKey': {
        label: '↟',
        action: setQueuedAbility('incrementFrameKey'),
    },
    'decrementFrameKey': {
        label: '↡',
        action: setQueuedAbility('decrementFrameKey'),
    },
    'characterMenu': {
        label: 'menu',
        action: toggleMenuVisible('character'),
    },
    'inventoryMenu': {
        label: 'inventory',
        action: toggleMenuVisible('inventory'),
    },
    'closeMenu': {
        label: 'close',
        action: closeMenus(),
    },

    'floss': {
        label: 'flss',
        action: setQueuedAbility('floss'),
        icon: 'embolden',
        gcd: true,
    },
    'heal': {
        label: 'vercure',
        action: setQueuedAbility('heal'),
        icon: 'vercure',
        gcd: true,
        description: `
            Restores target HP by 10.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        `,
    },
    'melee1': {
        label: 'melee1',
        action: setQueuedAbility('melee'),
        icon: 'melee1',
        gcd: true,
    },
    'melee2': {
        label: 'melee2',
        action: setQueuedAbility('melee'),
        icon: 'melee2',
        gcd: true,
    },
    'melee3': {
        label: 'melee3',
        action: setQueuedAbility('melee'),
        icon: 'melee3',
        gcd: true,
    },
    'fleche': {
        label: 'fleche',
        action: setQueuedAbility('fleche'),
        icon: 'fleche',
    },
    'embolden': {
        label: 'embolden',
        action: setQueuedAbility('embolden'),
        icon: 'embolden',
    },
    'manafication': {
        label: 'manafication',
        action: setQueuedAbility('manafication'),
        icon: 'manafication',
    },
    'jolt': {
        label: 'jolt',
        action: setQueuedAbility('jolt'),
        icon: 'jolt',
        gcd: true,
    },
    'verraise': {
        label: 'jolt',
        action: setQueuedAbility('verraise'),
        icon: 'verraise',
        gcd: true,
    },
    'verthunder': {
        label: 'verthunder',
        action: setQueuedAbility('verthunder'),
        icon: 'verthunder',
        gcd: true,
    },
    'verflare': {
        label: 'verflare',
        action: setQueuedAbility('verflare'),
        icon: 'verflare',
        gcd: true,
    },

    // items
    'potion': {
        label: 'potion',
        action: setQueuedAbility('potion'),
        icon: 'vercure',
        gcd: false,
        type: 'item',
        description: `
            THIS IS AN ITEM NOT AN ABILITY !!!! Restores self HP by 100. Press "I" to open your inventory.
        `
    },
}

export default reducerMap;
