import store from '../store/store';
import {
    setQueuedAbility,
    setQueuedAbilityAndTarget,
    setCursorState,
    setJump,
    setSystemAction,
    setSystemActionAndTarget,
} from '../store/playerState';
import {
    startSetting,
    clearSetting,
} from '../store/hotBars';
import {
    openMenu,
    closeMenu,
} from '../store/menuStates';
import {
    getNextMessage,
} from '../store/dialogueBox';
import navActions from './navActions';
import * as styles from '../App.module.css';

// TODO: separate dictionaries into separate files
// TODO: should specify here if something is a simple action or cursor
const _getActiveItemKey = (state) => {
    const activeIndex = state.inventory.activeIndex;
    const inventory = state.inventory.items;

    const itemKey = inventory[activeIndex]?.name;
    return itemKey;
}

const _getActiveItem = (state) => {
    const activeIndex = state.inventory.activeIndex;
    const inventory = state.inventory.items;

    const itemKey = inventory[activeIndex]?.name;
    if (!itemKey) return;

    // hmmm
    const item = items[itemKey] || equipment[itemKey];

    return item;
}

export const inventoryActions = {
    'useActiveItem': {
        label: 'Use',
        action: () => {
            const state = store.getState();
            const item = _getActiveItem(state);
            if (item.action) item.action();
        },
    },
    'equipActiveItem': {
        label: 'Equip',
        action: () => {
            const state = store.getState();
            const item = _getActiveItem(state);
            if (item.equip) item.equip();
        },
    },
    'setActiveItem': {
        label: 'Set',
        action: () => {
            const state = store.getState();
            const itemName = _getActiveItemKey(state);
            if (itemName) {
                store.dispatch(startSetting(itemName));
            }
        },
    },
};

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

export const shortcutActions = {
    'inventory': {
        label: 'Inventory',
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
    'settings': {
        label: 'Settings',
        action: () => {
            console.log('nice');
        }
    }
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
            } else if (state.menuStates.activeMenu) {
                const menuKey = state.menuStates.activeMenu;
                const config = navActions[menuKey];
                if (!config || !config.close) return;
                config.close();
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
                const state = store.getState();

                const menuKey = state.menuStates.activeMenu;
                if (!menuKey) return;

                const config = navActions[menuKey];
                if (!config) return;

                config.confirm();
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

export const items = {
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
            const state = store.getState();

            const menuKey = state.menuStates.activeMenu;
            if (!menuKey) return;

            const config = navActions[menuKey];
            if (!config) return;

            config.up();
        },
    },
    'navLeft': {
        label: 'navLeft',
        action: () => {
            const state = store.getState();

            const menuKey = state.menuStates.activeMenu;
            if (!menuKey) return;

            const config = navActions[menuKey];
            if (!config) return;

            config.left();
        },
    },
    'navRight': {
        label: 'navRight',
        action: () => {
            const state = store.getState();

            const menuKey = state.menuStates.activeMenu;
            if (!menuKey) return;

            const config = navActions[menuKey];
            if (!config) return;

            config.right();
        },
    },
    'navDown': {
        label: 'navDown',
        action: () => {
            const state = store.getState();

            const menuKey = state.menuStates.activeMenu;
            if (!menuKey) return;

            const config = navActions[menuKey];
            if (!config) return;

            config.down();
        },
    },
}

const reducerMap = {
    ...movementActions,
    ...shortcutActions,
    ...systemActions,
    ...targetingActions,
    ...abilities,
    ...inventoryActions,
    ...items,
    ...equipment,
    ...navigationActions,
};

export default reducerMap;
