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
    setSystemActionAndTarget,
} from '../store/playerState';

import {
    doNothing,
    setPosition,
    setHoverKey,
    clearSetting,
} from '../store/hotBars';

import {
    setFrameIndex,
    toggleCompositeState,
    clearCompositeStates,
} from '../store/aniEditor';

import {
    toggleMenuVisible,
    closeMenus,
    openMenu,
    closeMenu,
    confirmMenu,
    navigateUp,
    navigateLeft,
    navigateRight,
    navigateDown,
} from '../store/menuStates';

import {
    getNextMessage,
} from '../store/dialogueBox';

import * as styles from '../App.module.css';

// TODO: separate dictionaries into separate files
// TODO: should specify here if something is a simple action or cursor
const movementActions = {
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
};

const shortcutActions = {
    'inventoryMenu': {
        label: 'inventory',
        action: () => {
            const state = store.getState();

            const activeMenu = state.menuStates.activeMenu;
            const isActive = (activeMenu == 'inventory');

            if (isActive) {
                store.dispatch(closeMenu());
            } else {
                store.dispatch(openMenu('inventory'));
            }
        },
    },
};

const systemActions = {
    'empty': {
        label: '',
        action: () => {},
    },
    'close': {
        label: 'close',
        action: () => {
            const state = store.getState();
            if (state.hotBars.isSetting) {
                store.dispatch(clearSetting());
            } else if (state.hotBars.hoverKey) {
                store.dispatch(setHoverKey(null));
            } else if (state.menuStates.activeMenus.length) {
                store.dispatch(closeMenus());
                store.dispatch(setHoverKey(null));
            } else if (state.menuStates.activeMenu === 'gameMenu') {
                store.dispatch(closeMenu());
            } else if (state.targetInfo.display) {
                store.dispatch(setSystemAction('untarget'));
            } else {
                store.dispatch(openMenu('gameMenu'));
            }
        },
    },
    'confirm': {
        label: 'confirm',
        action: () => {
            const state = store.getState();
            if (state.dialogueBox.display) {
                store.dispatch(getNextMessage());
            } else if (state.menuStates.activeMenu) {
                store.dispatch(confirmMenu());
            } else {
                store.dispatch(setSystemAction('confirm'));
            }
        },
    },
};

const targetingActions = {
    'cycleTarget': {
        label: 'cycleTarget',
        action: () => {
            store.dispatch(setSystemAction('cycleTarget'));
        },
        icon: 'fleche',
    },
    'cycleTargetReverse': {
        label: 'cycleTarget',
        action: () => {
            store.dispatch(setSystemAction('cycleTargetReverse'));
        },
    },
};

const abilities = {
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
    'verthunder': {
        label: 'verthunder',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'verthunder',
                    target: target ?? null,
                })
            );
        },
        icon: 'verthunder',
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
};

const items = {
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
};

export const equipment = {
    // equipment test
    'foxears': {
        itemId: 1,
        label: 'foxears',
        icon: 'verflare',
        type: 'item',
        description: `fox ears! ripped out of a real live fox.`,
        action: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 1,
            }))
        },
        equip: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 1,
            }))
        },
    },
    'halo': {
        itemId: 2,
        label: 'halo',
        icon: 'verholy',
        type: 'item',
        description: `this is a helmet thing`,
        action: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 2,
            }))
        },
        equip: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 2,
            }))
        },
    },
};

const navigationActions = {
    'navUp': {
        label: 'navUp',
        action: () => {
            store.dispatch(navigateUp());
        },
    },
    'navLeft': {
        label: 'navLeft',
        action: () => {
            store.dispatch(navigateLeft());
        },
    },
    'navRight': {
        label: 'navRight',
        action: () => {
            store.dispatch(navigateRight());
        },
    },
    'navDown': {
        label: 'navDown',
        action: () => {
            store.dispatch(navigateDown());
        },
    },
}

const reducerMap = {
    ...movementActions,
    ...shortcutActions,
    ...systemActions,
    ...targetingActions,
    ...abilities,
    ...items,
    ...equipment,
    ...navigationActions,
};

export default reducerMap;
