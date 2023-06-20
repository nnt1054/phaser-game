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
    menus,
    openMenu,
    closeMenu,
    setChatInputIsActive,
} from '../store/menuStates';
import {
    getNextMessage,
} from '../store/dialogueBox';
import {
    activeStates as inventoryActiveStates,
    setInventoryState,
    closeActionsMenu,
} from '../store/inventory';
import {
    getActiveItem,
    getActiveSkill,
    checkIsSetting,
} from './utils';
import {
    activeStates as skillsActiveStates,
    setActiveState as setSkillsActiveState,
    setActiveIndex as setSkillsActiveIndex,
} from '../store/skillsMenu';
import navActions from './navActions';
import * as styles from '../App.module.css';

// TODO: separate dictionaries into separate files
// TODO: should specify here if something is a simple action or cursor
export const inventoryActions = {
    'useActiveItem': {
        label: 'Use',
        action: () => {
            const state = store.getState();
            const item = getActiveItem(state);
            if (item.action) item.action();
            store.dispatch(closeActionsMenu());
        },
    },
    'equipActiveItem': {
        label: 'Equip',
        action: () => {
            const state = store.getState();
            const item = getActiveItem(state);
            if (item.equip) item.equip();
            store.dispatch(closeActionsMenu());
        },
    },
    'setActiveItem': {
        label: 'Set',
        action: () => {
            const state = store.getState();
            const item = getActiveItem(state);
            if (item) {
                store.dispatch(setInventoryState(inventoryActiveStates.setting));
            }
        },
    },
};

export const skillActions = {
    'setActiveSkill': {
        label: 'Set',
        action: () => {
            const state = store.getState();
            const skill = getActiveSkill(state);
            if (skill) {
                store.dispatch(setSkillsActiveState(skillsActiveStates.setting));
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
            const isActive = (activeMenu === 'inventory');
            const isSetting = checkIsSetting(state);

            if (isActive && !isSetting) {
                store.dispatch(closeMenu());
            } else if (activeMenu !== 'dialogue') {
                store.dispatch(openMenu('inventory'));
                store.dispatch(setInventoryState(inventoryActiveStates.default));
            }
        },
    },
    'settings': {
        label: 'Lorem Ipsum',
        action: () => {}
    },
    'skills': {
        label: 'Skills',
        action: () => {
            const state = store.getState();

            const activeMenu = state.menuStates.activeMenu;
            const isActive = (activeMenu === menus.skills);

            if (isActive) {
                store.dispatch(closeMenu());
            } else if (activeMenu !== 'dialogue') {
                store.dispatch(openMenu(menus.skills));
                store.dispatch(setSkillsActiveState(skillsActiveStates.default));
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
            const menuKey = state.menuStates.activeMenu;
            if (state.menuStates.chatInputIsActive) {
                store.dispatch(setChatInputIsActive(false));
            } else if (menuKey != menus.default) {
                const config = navActions[menuKey];
                if (!config || !config.close) return;
                config.close();
            } else if (state.targetInfo.display || state.playerState.castKey) {
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
            if (state.menuStates.chatInputIsActive) {
                const event = new Event('clearChatInput');
                document.dispatchEvent(event);
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
    'focusChatInput': {
        label: 'focusChatInput',
        action: () => {
            store.dispatch(setChatInputIsActive(true));
        },
    },
    'sendChat': {
        label: 'sendChat',
        action: (text) => {
            store.dispatch(setSystemActionAndTarget({
                action: 'sendChat',
                target: text,
            }));
        },
    },
};

export const targetingActions = {
    'cycleTarget': {
        label: 'cycleTarget',
        action: () => {
            store.dispatch(setSystemAction('cycleTarget'));
        },
        icon: 'fleche',
    },
    'cycleTargetReverse': {
        label: 'cycleTargetReverse',
        action: () => {
            store.dispatch(setSystemAction('cycleTargetReverse'));
        },
    },
    'targetEnemyFromEnemyList': {
        label: 'targetEnemyFromEnemyList',
        action: (target) => {
            store.dispatch(setSystemActionAndTarget({
                action: 'targetEnemyFromEnemyList',
                target: target,
            }))
        }
    },
    'cycleTargetFromEnemyList': {
        label: 'cycleTargetFromEnemyList',
        action: () => {
            store.dispatch(setSystemAction('cycleTargetFromEnemyList'));
        },
    },
    'cycleTargetFromEnemyListReverse': {
        label: 'cycleTargetFromEnemyListReverse',
        action: () => {
            store.dispatch(setSystemAction('cycleTargetFromEnemyListReverse'));
        },
    },
};


const meleeAbilities = {
    'linear_strike': {
        label: 'Linear Strike',
        action: () => { store.dispatch(setQueuedAbility('linear_strike')) },
        icon: 'linear_strike',
        gcd: true,
        cooldown: '2.5s',
        description: `Delivers a Physical Attack with 15 Potency.`,
    },
    'fanning_strike': {
        label: 'Fanning Strike',
        action: () => { store.dispatch(setQueuedAbility('fanning_strike')) },
        icon: 'fanning_strike',
        gcd: true,
        cooldown: '2.5s',
        description: `Delivers a Physical Attack with 15 Potency.`,
        extraDescription: [
            ['Combo Action:', 'Linear Strike'],
            ['Combo Potency:', '25'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'linear_strike')
        },
    },
    'redondo': {
        label: 'Redondo',
        action: () => { store.dispatch(setQueuedAbility('redondo')) },
        icon: 'redondo',
        gcd: true,
        cooldown: '2.5s',
        description: `Delivers a Physical Attack with 15 Potency.`,
        extraDescription: [
            ['Combo Action:', 'Fanning Strike'],
            ['Combo Potency:', '30'],
            ['Combo Bonus:', 'Grants Flow, increasing damage dealt by 10%'],
            ['Duration:', '45s; Extends Flow by 45s to maximum of 90s'],
            ['Combo Bonus:', 'Grants 1 Chakra (Max 4)'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'fanning_strike')
        },
    },
    'exis_strike': {
        label: 'Exis Strike',
        action: () => { store.dispatch(setQueuedAbility('exis_strike')) },
        icon: 'exis_strike',
        gcd: true,
        cooldown: '2.5s',
        description: `Delivers a Physical Attack with 15 Potency.`,
        extraDescription: [
            ['Combo Action:', 'Fanning Strike'],
            ['Combo Potency:', '35'],
            ['Combo Bonus:', 'Grants 1 Chakra (Max 4)'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'fanning_strike')
        },
    },
    'largo_mano_strike': {
        label: 'Largo Mano Strike',
        action: () => { store.dispatch(setQueuedAbility('largo_mano_strike')) },
        override: () => {
            const state = store.getState();
            const cortoManoReady = state.statusInfo.statuses.find(buff => buff.key == 'cortoManoReady');
            if (cortoManoReady) {
                return 'corto_mano_dash';
            }
        },
        icon: 'largo_mano_strike',
        gcd: true,
        cooldown: '3.5s',
        description: `Delivers a Physical Attack with 45 Potency.`,
        extraDescription: [
            ['Additional Effect:', 'Grants 1 Chakra (Max 4)'],
            ['Additional Effect:', 'Grants Corto Mano Ready'],
            ['', '※Changes to Corto Mano Dash when under the effect of Corto Mano Ready'],
        ],
    },
    'corto_mano_dash': {
        label: 'Corto Mano Dash',
        action: () => { store.dispatch(setQueuedAbility('largo_mano_strike')) },
        icon: 'corto_mano_dash',
        gcd: true,
        cooldown: '1.5s',
        description: `Dashes to target and Delivers a Physical Attack with 10 Potency.`,
        extraDescription: [
            ['', 'Can only be executed when Corto Mano Ready'],
            ['', '※This action cannot be assigned to a hotbar.'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'cortoManoReady');
        },
    },
    'earthly_strike': {
        label: 'Earthly Strike',
        action: () => { store.dispatch(setQueuedAbility('earthly_strike')) },
        icon: 'earthly_strike',
        gcd: true,
        castTime: '0s',
        cooldown: '1.5s',
        description: `Delivers a Physical Attack with 20 Potency. Effect changes depending on previous Combo Action.`,
        extraDescription: [
            ['Chakra Cost:', '1'],
            ['Additional Effect:', 'Grants Earthly Combo Ready'],

            ['', ''],

            ['Combo Action:', 'Heavenly Strike'],
            ['Combo Potency (Heavenly Strike):', '25'],
            ['Combo Bonus (Heavenly Strike):', 'Applies Blight to target'],
            ['Blight:', 'Deals Physical Damage over time with 75 potency'],
            ['Duration:', '45s'],

            ['', ''],

            ['Combo Action:', 'Earthly Strike'],
            ['Combo Bonus (Earthly Strike):', 'Grants Heaven Aligned'],
            ['Heaven Aligned:', 'Increase damage dealt by next Heavenly Strike by 100%'],

            ['', ''],

            ['Combo Additional Effect:', 'Recast Increased to 2.5s'],
            ['Combo Additional Effect:', 'Ignores Chakra Cost'],
            ['Combo Additional Effect:', 'Action Combo ended on usage'],
            ['Combo Additional Effect:', 'Does not grant Earthly Combo Ready'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'heavenly_strike' || state.playerState.comboAction == 'earthly_strike')
        },
        isDisabled: () => {
            const state = store.getState();
            const hasChakra = state.statusInfo.statuses.find(buff => buff.key == 'chakra');
            const isCombo = state.playerState.comboAction == 'heavenly_strike' || state.playerState.comboAction == 'earthly_strike';
            return hasChakra || isCombo ? false : true;
        },
    },
    'earthly_combo': {
        label: 'Earthly Combo',
        action: () => { store.dispatch(setQueuedAbility('earthly_combo')) },
        icon: 'earthly_combo',
        cooldown: '1s',
        description: `Delivers a Physical Attack with 10 Potency.`,
        extraDescription: [
            ['', 'Can only be executed when Earthly Combo Ready'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'earthlyComboReady');
        },
        isDisabled: () => {
            const state = store.getState();
            const earthlyComboReady = state.statusInfo.statuses.find(buff => buff.key == 'earthlyComboReady');
            return earthlyComboReady ? false : true;
        },
    },
    'heavenly_strike': {
        label: 'Heavenly Strike',
        action: () => { store.dispatch(setQueuedAbility('heavenly_strike')) },
        icon: 'heavenly_strike',
        gcd: true,
        castTime: '0s',
        cooldown: '1.5s',
        description: `Delivers a Physical Attack with 30 Potency. Effect changes depending on previous Combo Action.`,
        extraDescription: [
            ['Chakra Cost:', '1'],
            ['Additional Effect:', 'Grants Heavenly Combo Ready'],

            ['', ''],

            ['Combo Action:', 'Earthly Strike'],
            ['Combo Potency (Earthly Strike):', '50'],

            ['', ''],

            ['Combo Action:', 'Heavenly Strike'],
            ['Combo Bonus (Heavenly Strike):', 'Grants Earth Aligned'],
            ['Earth Aligned:', 'Increase damage dealt by next Earthly Strike by 100%'],

            ['', ''],

            ['Combo Additional Effect:', 'Recast Increased to 2.5s'],
            ['Combo Additional Effect:', 'Ignores Chakra Cost'],
            ['Combo Additional Effect:', 'Action Combo ended on usage'],
            ['Combo Additional Effect:', 'Does not grant Heavenly Combo Ready'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'heavenly_strike' || state.playerState.comboAction == 'earthly_strike')
        },
        isDisabled: () => {
            const state = store.getState();
            const hasChakra = state.statusInfo.statuses.find(buff => buff.key == 'chakra');
            const isCombo = state.playerState.comboAction == 'heavenly_strike' || state.playerState.comboAction == 'earthly_strike';
            return hasChakra || isCombo ? false : true;
        },
    },
    'heavenly_combo': {
        label: 'Heavenly Combo',
        action: () => { store.dispatch(setQueuedAbility('heavenly_combo')) },
        icon: 'heavenly_combo',
        cooldown: '1s',
        description: `Delivers a Physical Attack with 10 Potency.`,
        extraDescription: [
            ['', 'Can only be executed when Heavenly Combo Ready'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'heavenlyComboReady');
        },
        isDisabled: () => {
            const state = store.getState();
            const heavenlyComboReady = state.statusInfo.statuses.find(buff => buff.key == 'heavenlyComboReady');
            return heavenlyComboReady ? false : true;
        },
    },
    'enlightenment': {
        label: 'Enlightenment',
        action: () => { store.dispatch(setQueuedAbility('enlightenment')) },
        icon: 'enlightenment',
        cooldown: '90s',
        description: `Increases damage dealt by 20%`,
        extraDescription: [
            ['Duration:', '20s'],
        ],
    },
};


export const abilities = {
    ...meleeAbilities,
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
        castTime: '2.0s',
        cooldown: '2.5s',
        description: `
            Deals 25 Magic Damage to Target.
        `,
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
        castTime: '0s',
        cooldown: '2.5s',
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
        cooldown: '12.0s',
        description: `
            Ranged OGCD; Deals 10 Damage to Target.
        `,
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
        castTime: '2.0s',
        cooldown: '2.5s',
        description: `
            Restores target HP by 10.
        `,
    },
    'slice': {
        label: 'slice',
        action: () => { store.dispatch(setQueuedAbility('slice')) },
        icon: 'melee4',
        gcd: true,
        castTime: '0s',
        cooldown: '1.5s',
        description: `
            Melee Slash; Deals 15 Damage to Target.
        `,  
    },
    'corps_a_corps': {
        label: 'corps-a-corps',
        action: () => { store.dispatch(setQueuedAbility('corps_a_corps')) },
        icon: 'corps_a_corps',
        cooldown: '12.0s',
        description: `
            Dash to target; Deals 10 Damage to Target.
        `,
    },
    'displacement': {
        label: 'displacement',
        action: () => { store.dispatch(setQueuedAbility('displacement')) },
        icon: 'displacement',
        cooldown: '12.0s',
        description: `
            Dash away from the target; Deals 10 Damage to Target.
        `,
    },
    'combo1': {
        label: 'combo1',
        action: () => { store.dispatch(setQueuedAbility('combo1')) },
        icon: 'melee1',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: `
            Melee Slash; Deals 15 Damage to Target.
        `,  
    },
    'combo2': {
        label: 'combo2',
        action: () => { store.dispatch(setQueuedAbility('combo2')) },
        icon: 'melee2',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: `
            Melee Slash; Deals 15 Damage to Target.
        `,  
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'combo1')
        },
    },
    'combo3': {
        label: 'combo3',
        action: () => { store.dispatch(setQueuedAbility('combo3')) },
        icon: 'melee3',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: `
            Melee Slash; Deals 15 Damage to Target.
        `,  
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'combo2')
        },
    },
    'combo4': {
        label: 'combo4',
        action: () => { store.dispatch(setQueuedAbility('combo4')) },
        icon: 'melee4',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: `
            Melee Slash; Deals 15 Damage to Target.
        `,  
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'combo2')
        },
    },
    'acceleration': {
        label: 'acceleration',
        action: () => { store.dispatch(setQueuedAbility('acceleration')) },
        icon: 'acceleration',
        gcd: false,
        cooldown: '2.5s',
        description: `
            Next Non-instant Spell will be instant.
        `,
    },
    'stone': {
        label: 'stone',
        action: () => { store.dispatch(setQueuedAbility('stone')) },
        icon: 'stone',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: `
            Deals 25 Magic Damage to Target.
        `,
    },
    'aero': {
        label: 'aero',
        action: () => { store.dispatch(setQueuedAbility('aero')) },
        icon: 'aero',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: `
            Dash to target; Deals 10 Damage to Target.
        `,
    },
    'regen': {
        label: 'regen',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'regen',
                    target: target ?? null,
                })
            );
        },
        icon: 'regen',
        gcd: true,
        castTime: '2.0s',
        cooldown: '2.5s',
        description: `
            Restores target HP by 10.
        `,
    },
};

export const items = {
    'potion': {
        label: 'potion',
        action: () => { store.dispatch(setQueuedAbility('potion')) },
        icon: 'vercure',
        gcd: false,
        type: 'item',
        itemType: 'consumable',
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
        icon: 'embolden',
        type: 'item',
        itemType: 'helmet',
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
        itemType: 'helmet',
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
    'horns': {
        itemId: 3,
        label: 'horns',
        icon: 'verflare',
        type: 'item',
        itemType: 'helmet',
        description: `Equip to swap to MELEE job.`,
        action: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 3,
            }))
        },
        equip: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 3,
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
    ...skillActions,
    ...items,
    ...equipment,
    ...navigationActions,
};

export default reducerMap;
