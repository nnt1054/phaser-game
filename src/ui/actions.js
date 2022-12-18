import store from '../store/store';

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
    setQueuedAbilityAndTarget,
    setCursorState,
    setJump,
    setSystemAction,
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

import {
    getNextMessage,
} from '../store/dialogueBox';

import * as styles from '../App.module.css';


const reducerMap = {
    'jump': {
        label: 'jump',
        action: () => {
            setJump()
        },
    },
    'jumpCursor': {
        label: 'jump',
        action: () => {
            store.dispatch(setCursorState({
                cursor: 'jump',
                value: 1,
            }))
        },
        upAction: () => {
            store.dispatch(setCursorState({
                cursor: 'jump',
                value: 0,
            }))
        },
    },
    'left': {
        label: 'left',
        action: () => {
            store.dispatch(setCursorState({
                cursor: 'left',
                value: 1,
            }))
        },
        upAction: () => {
            store.dispatch(setCursorState({
                cursor: 'left',
                value: 0,
            }))
        },
    },
    'right': {
        label: 'right',
        action: () => {
            store.dispatch(setCursorState({
                cursor: 'right',
                value: 1,
            }))
        },
        upAction: () => {
            store.dispatch(setCursorState({
                cursor: 'right',
                value: 0,
            }))
        },
    },
    'up': {
        label: 'up',
        action: () => {
            store.dispatch(setCursorState({
                cursor: 'up',
                value: 1,
            }))
        },
        upAction: () => {
            store.dispatch(setCursorState({
                cursor: 'up',
                value: 0,
            }))
        },
    },
    'down': {
        label: 'down',
        action: () => {
            store.dispatch(setCursorState({
                cursor: 'down',
                value: 1,
            }))
        },
        upAction: () => {
            store.dispatch(setCursorState({
                cursor: 'down',
                value: 0,
            }))
        },
    },
    'decrementHP10': {
        label: '-10 HP',
        action: () => { store.dispatch(decrementHealth()) },
    },
    'incrementHP10': {
        label: '+10 HP',
        action: () => { store.dispatch(incrementHealth()) },
    },
    'HP0': {
        label: '0% HP',
        action: () => { store.dispatch(setPlayerCurrentHealth(0)) },
    },
    'HP100': {
        label: '100% HP',
        action: () => { store.dispatch(setPlayerCurrentHealth(100)) },
    },
    'decrementMP10': {
        label: '-10 MP',
        action: () => { store.dispatch(decrementMana()) },
    },
    'incrementMP10': {
        label: '+10 MP',
        action: () => { store.dispatch(incrementMana()) },
    },
    'MP0': {
        label: '0% MP',
        action: () => { store.dispatch(setPlayerCurrentMana(0)) },
    },
    'MP100': {
        label: '100% MP',
        action: () => { store.dispatch(setPlayerCurrentMana(100)) },
    },
    'empty': {
        label: '',
        action: () => {},
    },
    'pause': {
        label: 'Stop',
        action: () => { store.dispatch(setQueuedAbility('pause')) },
    },
    'resume': {
        label: 'Play',
        action: () => { store.dispatch(setQueuedAbility('resume')) },
    },
    'select_all_composite_state': {
        label: 'All',
        action: () => { store.dispatch(clearCompositeStates(true)) },
    },
    'unselect_all_composite_state': {
        label: 'Rst',
        action: () => { store.dispatch(clearCompositeStates(false)) },
    },
    'copy_anim_to_clipboard': {
        label: 'Cpy',
        action: () => { store.dispatch(setQueuedAbility('copyAnim')) },
    },
    'incrementTranslateX': {
        label: '→',
        action: () => { store.dispatch(setQueuedAbility('incrementTranslateX')) },
    },
    'decrementTranslateX': {
        label: '←',
        action: () => { store.dispatch(setQueuedAbility('decrementTranslateX')) },
    },
    'incrementTranslateY': {
        label: '↑',
        action: () => { store.dispatch(setQueuedAbility('incrementTranslateY')) },
    },
    'decrementTranslateY': {
        label: '↓',
        action: () => { store.dispatch(setQueuedAbility('decrementTranslateY')) },
    },
    'incrementRotate': {
        label: '↷',
        action: () => { store.dispatch(setQueuedAbility('incrementRotate')) },
    },
    'decrementRotate': {
        label: '↶',
        action: () => { store.dispatch(setQueuedAbility('decrementRotate')) },
    },
    'incrementFrameKey': {
        label: '↟',
        action: () => { store.dispatch(setQueuedAbility('incrementFrameKey')) },
    },
    'decrementFrameKey': {
        label: '↡',
        action: () => { store.dispatch(setQueuedAbility('decrementFrameKey')) },
    },
    'characterMenu': {
        label: 'menu',
        action: () => {
            const state = store.getState();
            store.dispatch(toggleMenuVisible('character'))
        },
    },
    'inventoryMenu': {
        label: 'inventory',
        action: () => { store.dispatch(toggleMenuVisible('inventory')) },
    },
    'floss': {
        label: 'flss',
        action: () => { store.dispatch(setQueuedAbility('floss')) },
        icon: 'embolden',
        gcd: true,
    },
    'heal': {
        label: 'vercure',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'heal',
                    target: target ?? null,
                })
            );
        },
        icon: 'vercure',
        gcd: true,
        description: `
            Restores target HP by 10.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        `,
    },
    'melee1': {
        label: 'melee1',
        action: () => { store.dispatch(setQueuedAbility('melee')) },
        icon: 'melee1',
        gcd: true,
    },
    'melee2': {
        label: 'melee2',
        action: () => { store.dispatch(setQueuedAbility('melee')) },
        icon: 'melee2',
        gcd: true,
    },
    'melee3': {
        label: 'melee3',
        action: () => { store.dispatch(setQueuedAbility('melee')) },
        icon: 'melee3',
        gcd: true,
    },
    'embolden': {
        label: 'embolden',
        action: () => { store.dispatch(setQueuedAbility('embolden')) },
        icon: 'embolden',
    },
    'manafication': {
        label: 'manafication',
        action: () => { store.dispatch(setQueuedAbility('manafication')) },
        icon: 'manafication',
    },
    'jolt': {
        label: 'jolt',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'jolt',
                    target: target ?? null,
                })
            );
        },
        icon: 'jolt',
        gcd: true,
    },
    'fleche': {
        label: 'fleche',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'fleche',
                    target: target ?? null,
                })
            );
        },
        icon: 'fleche',
    },
    'verraise': {
        label: 'verraise',
        action: () => { store.dispatch(setQueuedAbility('verraise')) },
        icon: 'verraise',
        gcd: true,
    },
    'verthunder': {
        label: 'verthunder',
        action: () => { store.dispatch(setQueuedAbility('verthunder')) },
        icon: 'verthunder',
        gcd: true,
    },
    'verflare': {
        label: 'verflare',
        action: () => { store.dispatch(setQueuedAbility('verflare')) },
        icon: 'verflare',
        gcd: true,
    },

    'vercure': {
        label: 'vercure',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'vercure',
                    target: target ?? null,
                })
            );
        },
        icon: 'vercure',
        gcd: true,
        description: `
            Restores target HP by 10.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        `,
    },
    'slice': {
        label: 'slice',
        action: () => { store.dispatch(setQueuedAbility('slice')) },
        icon: 'melee1',
        gcd: true,
    },

    // items
    'potion': {
        label: 'potion',
        action: () => { store.dispatch(setQueuedAbility('potion')) },
        icon: 'vercure',
        gcd: false,
        type: 'item',
        description: `
            THIS IS AN ITEM NOT AN ABILITY !!!! Restores self HP by 100. Press "I" to open your inventory.
        `
    },

    // system actions
    'close': {
        label: 'close',
        action: () => {
            const state = store.getState();
            if (state.menuStates.activeMenus.length) {
                store.dispatch(closeMenus());
            } else {
                store.dispatch(setSystemAction('untarget'));
            }
        },
    },
    'confirm': {
        label: 'confirm',
        action: () => {
            const state = store.getState();
            if (state.dialogueBox.display) {
                store.dispatch(getNextMessage());
            } else {
                store.dispatch(setSystemAction('confirm'));
            }
        },
    },
    'cycleTarget': {
        label: 'cycleTarget',
        action: () => {
            store.dispatch(setSystemAction('cycleTarget'));
        },
    },
    'cycleTargetReverse': {
        label: 'cycleTarget',
        action: () => {
            store.dispatch(setSystemAction('cycleTargetReverse'));
        },
    },
}

export default reducerMap;
