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
        icon: 'largo_mano_strike',
        gcd: false,
        cooldown: '90s',
        description: `Delivers a Physical Attack with 45 Potency.`,
        extraDescription: [
            ['Additional Effect:', 'Grants 2 Chakra (Max 4)'],
        ],
    },
    'corto_mano_dash': {
        label: 'Corto Mano Dash',
        action: () => { store.dispatch(setQueuedAbility('corto_mano_dash')) },
        icon: 'corto_mano_dash',
        gcd: false,
        cooldown: '12s',
        description: `Dashes to target and Delivers a Physical Attack with 10 Potency.`,
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
            ['Additional Effect:', 'Grants Earthly Weave Ready'],

            ['', ''],

            ['Combo Action:', 'Heavenly Strike'],
            ['Combo Potency (Heavenly Strike):', '25'],
            ['Combo Bonus (Heavenly Strike):', 'Applies Blight to target'],
            ['Blight:', 'Deals 75 Physical Damage over 45s.'],

            ['', ''],

            ['Combo Action:', 'Earthly Strike'],
            ['Combo Bonus (Earthly Strike):', 'Grants Earth Aligned'],
            ['Earth Aligned:', 'Increase damage dealt by next Earthly Strike by 100%'],

            ['', ''],

            ['Combo Additional Effect:', 'Recast Increased to 2.5s'],
            ['Combo Additional Effect:', 'Ignores Chakra Cost'],
            ['Combo Additional Effect:', 'Action Combo ended on usage'],
            ['Combo Additional Effect:', 'Does not grant Earthly Weave Ready'],
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
    'earthly_weave': {
        label: 'Earthly Weave',
        action: () => { store.dispatch(setQueuedAbility('earthly_weave')) },
        icon: 'earthly_weave',
        cooldown: '1s',
        description: `Delivers a Physical Attack with 10 Potency.`,
        extraDescription: [
            ['', 'Can only be executed when Earthly Weave Ready'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'earthlyWeaveReady');
        },
        isDisabled: () => {
            const state = store.getState();
            const earthlyWeaveReady = state.statusInfo.statuses.find(buff => buff.key == 'earthlyWeaveReady');
            return earthlyWeaveReady ? false : true;
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
            ['Additional Effect:', 'Grants Heavenly Weave Ready'],

            ['', ''],

            ['Combo Action:', 'Earthly Strike'],
            ['Combo Potency (Earthly Strike):', '50'],

            ['', ''],

            ['Combo Action:', 'Heavenly Strike'],
            ['Combo Bonus (Heavenly Strike):', 'Grants Heaven Aligned'],
            ['Heaven Aligned:', 'Increase damage dealt by next Heavenly Strike by 100%'],


            ['', ''],

            ['Combo Additional Effect:', 'Recast Increased to 2.5s'],
            ['Combo Additional Effect:', 'Ignores Chakra Cost'],
            ['Combo Additional Effect:', 'Action Combo ended on usage'],
            ['Combo Additional Effect:', 'Does not grant Heavenly Weave Ready'],
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
    'heavenly_weave': {
        label: 'Heavenly Weave',
        action: () => { store.dispatch(setQueuedAbility('heavenly_weave')) },
        icon: 'heavenly_weave',
        cooldown: '1s',
        description: `Delivers a Physical Attack with 10 Potency.`,
        extraDescription: [
            ['', 'Can only be executed when Heavenly Weave Ready'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'heavenlyWeaveReady');
        },
        isDisabled: () => {
            const state = store.getState();
            const heavenlyWeaveReady = state.statusInfo.statuses.find(buff => buff.key == 'heavenlyWeaveReady');
            return heavenlyWeaveReady ? false : true;
        },
    },
    'enlightenment': {
        label: 'Enlightenment',
        action: () => { store.dispatch(setQueuedAbility('enlightenment')) },
        icon: 'enlightenment',
        cooldown: '90s',
        description: `Increases damage dealt by 20%`,
        extraDescription: [
            ['Duration:', '21s'],
        ],
    },
};


const casterAbilities = {
    'ice': {
        label: 'Ice',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'ice',
                    target: target ?? null,
                })
            );
        },
        icon: 'ice',
        gcd: true,
        castTime: '0s',
        cooldown: '1.5s',
        description: 'Deals 15 Magic Damage to Target.',
        extraDescription: [
            ['Bonus Effect:', 'Grants 1 Mana'],
            ['Bonus Effect:', 'Grants Ice Aspected'],
            ['Additional Effect:', 'Removes Fire Aspected'],
        ],
    },
    'ice_ii': {
        label: 'Blizzard',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'ice_ii',
                    target: target ?? null,
                })
            );
        },
        icon: 'ice_ii',
        gcd: true,
        castTime: '2.0s',
        cooldown: '2.5s',
        description: 'Deals 30 Magic Damage to Target.',
        extraDescription: [
            ['Bonus Effect:', 'Grants 2 Mana'],
            ['', 'Can only be executed under Ice Aspected'],
        ],
        isDisabled: () => {
            const state = store.getState();
            const hasIceProc = state.statusInfo.statuses.find(buff => buff.key == 'iceProc');
            return hasIceProc ? false : true;
        },
    },
    'fire': {
        label: 'Fire',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'fire',
                    target: target ?? null,
                })
            );
        },
        icon: 'fire',
        gcd: true,
        castTime: '0s',
        cooldown: '1.5s',
        description: 'Deals 30 Magic Damage to Target.',
        extraDescription: [
            ['Mana Cost:', '1'],
            ['Bonus Effect:', 'Grants Fire Aspected'],
            ['Additional Effect:', 'Removes Ice Aspected'],
        ],
    },
    'fire_ii': {
        label: 'Scorch',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'fire_ii',
                    target: target ?? null,
                })
            );
        },
        icon: 'fire_ii',
        gcd: true,
        castTime: '2.0s',
        cooldown: '2.5s',
        description: 'Deals 40 Magic Damage to Target.',
        extraDescription: [
            ['Mana Cost:', '2'],
            ['', 'Can only be executed under Fire Aspected'],
        ],
        isDisabled: () => {
            const state = store.getState();
            const hasFireProc = state.statusInfo.statuses.find(buff => buff.key == 'fireProc');
            return hasFireProc ? false : true;
        },
    },
    'paradox': {
        label: 'Paradox',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'paradox',
                    target: target ?? null,
                })
            );
        },
        icon: 'paradox',
        gcd: true,
        castTime: '3.0s',
        cooldown: '2.5s',
        description: 'Deals 60 Magic Damage to Target.',
        extraDescription: [
            ['Mana Cost:', '5'],
        ],
        isHighlighted: () => { return false },
        isDisabled: () => { return false },
    },
    'manafication': {
        label: 'Manafication',
        action: () => { store.dispatch(setQueuedAbility('manafication')) },
        icon: 'manafication',
        cooldown: '90s',
        description: `Doubles the user's current amount of Mana (Max 10)`,
    },
    'triplecast': {
        label: 'Triplecast',
        action: () => { store.dispatch(setQueuedAbility('triplecast')) },
        icon: 'triplecast',
        gcd: false,
        cooldown: '120s',
        description: `Reduce Cast Time for next 3 Non-Instant Spells to 0s`,
    },
    'manafont': {
        label: 'Manafont',
        action: () => { store.dispatch(setQueuedAbility('manafont')) },
        icon: 'manafont',
        cooldown: '60s',
        description: `Increase Magical Damage by 20% at 5+ Mana `,
        extraDescription: [
            ['Duration:', '12s'],
        ],
    },
    // 'ascendance': {
    //     label: 'Ascendance',
    //     action: () => { store.dispatch(setQueuedAbility('ascendance')) },
    //     icon: 'ascendance',
    //     cooldown: '90s',
    //     description: `Temporarily reduce Mana Cost to 0 and Cast Time to 0s for all spells.`,
    //     extraDescription: [
    //         ['Duration:', '12s'],
    //         ['', 'Effect ends upon moving.'],
    //     ],
    // },
    // 'thunder': {
    //     label: 'Thunder',
    //     action: (target) => {
    //         store.dispatch(
    //             setQueuedAbilityAndTarget({
    //                 ability: 'thunder',
    //                 target: target ?? null,
    //             })
    //         );
    //     },
    //     icon: 'thunder',
    //     gcd: true,
    //     castTime: '0s',
    //     cooldown: '1.5s',
    //     description: 'Deals 50 Magic Damage to Target over 30s.',
    //     extraDescription: [
    //         ['Max Duration:', '60s'],
    //     ],

    // },
}

const hunterAbilities = {
    'arrow': {
        label: 'Arrow',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'arrow',
                    target: target ?? null,
                })
            );
        },
        icon: 'arrow',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: 'Deals 15 Physical Damage to Target.',
        extraDescription: [
            ['Bonus:', 'If target has less than 4 Stacks of Wounded; Apply Wounded to Target.'],
            ['Bonus:', 'If target has 4 Stacks of Wounded: Remove Wounded from Target and Damage is Doubled.'],
        ],
    },
    'heavy_arrow': {
        label: 'Heavy Arrow',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'heavy_arrow',
                    target: target ?? null,
                })
            );
        },
        icon: 'heavy_arrow',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: 'Deals 15 Physical Damage to Target.',
        extraDescription: [
            ['Combo Action:', 'Arrow'],
            ['Combo Potency:', '30'],
            ['', ''],
            ['Bonus:', 'If target has less than 4 Stacks of Wounded; Apply Wounded to Target.'],
            ['Bonus:', 'If target has 4 Stacks of Wounded: Remove Wounded from Target and Damage is Doubled.'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'arrow')
        },
    },
    'straight_arrow': {
        label: 'Straight Arrow',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'straight_arrow',
                    target: target ?? null,
                })
            );
        },
        icon: 'straight_arrow',
        gcd: true,
        castTime: '0s',
        cooldown: '2.5s',
        description: 'Deals 15 Physical Damage to Target.',
        extraDescription: [
            ['Combo Action:', 'Heavy Arrow'],
            ['Combo Potency:', '20'],
            ['', ''],
            ['Bonus:', 'If target has less than 4 Stacks of Wounded; Apply Wounded to Target.'],
            ['Bonus:', 'If target has 4 Stacks of Wounded: Remove Wounded from Target and Damage is Doubled.'],
        ],
        isHighlighted: () => {
            const state = store.getState();
            return (state.playerState.comboAction == 'heavy_arrow')
        },
    },
    'blast_arrow': {
        label: 'Blast Arrow',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'blast_arrow',
                    target: target ?? null,
                })
            );
        },
        icon: 'blast_arrow',
        gcd: true,
        castTime: '0s',
        cooldown: '20s',
        description: 'Deals 50 Physical Damage to Target.',
        extraDescription: [
            ['Bonus:', 'If target has less than 4 Stacks of Wounded; Apply Wounded to Target.'],
            ['Bonus:', 'If target has 4 Stacks of Wounded: Remove Wounded from Target and Damage is Doubled.'],
        ],
    },
    'arcane_arrow': {
        label: 'Arcane Arrow',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'arcane_arrow',
                    target: target ?? null,
                })
            );
        },
        icon: 'arcane_arrow',
        gcd: true,
        castTime: '0s',
        cooldown: '40s',
        description: 'Deals 60 Magical Damage to Target.',
        extraDescription: [
            ['Bonus:', 'If target has less than 4 Stacks of Wounded; Apply Wounded to Target.'],
            ['Bonus:', 'If target has 4 Stacks of Wounded: Remove Wounded from Target and Damage is Doubled.'],
        ],
    },
    'apex_arrow': {
        label: 'Apex Arrow',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'apex_arrow',
                    target: target ?? null,
                })
            );
        },
        icon: 'apex_arrow',
        gcd: true,
        castTime: '3.0s',
        cooldown: '120s',
        description: 'Deals 70 Physical Damage to Target.',
        extraDescription: [
            ['Bonus:', 'If target has less than 4 Stacks of Wounded; Apply Wounded to Target.'],
            ['Bonus:', 'If target has 4 Stacks of Wounded: Remove Wounded from Target and Damage is Doubled.'],
        ],
    },
    'repelling_shot': {
        label: 'Repelling Shot',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'repelling_shot',
                    target: target ?? null,
                })
            );
        },
        icon: 'repelling_shot',
        gcd: false,
        castTime: '0s',
        cooldown: '30s',
        description: 'Jump away from current Target and deal 15 Physical Damage to Target.',
    },
    'quick_draw': {
        label: 'Quick Draw',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'quick_draw',
                    target: target ?? null,
                })
            );
        },
        icon: 'quick_draw',
        gcd: false,
        castTime: '0s',
        cooldown: '0.75s',
        description: 'Deals 15 Physical Damage to Target.',
        extraDescription: [
            ['Arrow Stock Cost:', '1'],
        ],
        isDisabled: () => {
            const state = store.getState();
            const hasArrowStock = state.statusInfo.statuses.find(buff => buff.key == 'arrowStock');
            return hasArrowStock ? false : true;
        },
    },
    'carve': {
        label: 'Carve',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'carve',
                    target: target ?? null,
                })
            );
        },
        icon: 'carve',
        gcd: false,
        castTime: '0s',
        cooldown: '60s',
        description: 'Deals 30 Physical Damage to Target.',
        extraDescription: [
            ['Bonus:', 'Grants 10 Stacks of Arrow Stock.'],
        ],  
    },
}


const tankRoleAbilities = {
    'rampart': {
        label: 'Rampart',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'rampart',
                    target: target ?? null,
                })
            );
        },
        icon: 'rampart',
        gcd: false,
        cooldown: '90s',
        description: 'Mitigate damage received by 20% for 15s.',
    },
    'reprisal': {
        label: 'Reprisal',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'reprisal',
                    target: target ?? null,
                })
            );
        },
        icon: 'reprisal',
        gcd: false,
        cooldown: '60s',
        description: 'Reduce damage dealt by target by 20% for 15s.',
    },
}


const knightAbilities = {
    'precision_block': {
        label: 'Precision Block',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'precision_block',
                    target: target ?? null,
                })
            );
        },
        icon: 'knight',
        gcd: false,
        castTime: '0s',
        cooldown: '0s',
        description: 'Mitigate next damage received by 20%.',
        override: () => {
            const state = store.getState();
            const hasPrecisionCounter = state.statusInfo.statuses.find(buff => buff.key == 'precisionCounter');
            if (hasPrecisionCounter) {
                return 'precision_counter';
            }
        } 
    },
    'precision_counter': {
        label: 'Precision Counter',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'precision_block',
                    target: target ?? null,
                })
            );
        },
        icon: 'melee4',
        gcd: false,
        castTime: '0s',
        cooldown: '0s',
        description: 'Deals 30 Physical Damage to Target.',
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'precisionCounter');
        },
    },
    'simple_domain': {
        label: 'Simple Domain',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'simple_domain',
                    target: target ?? null,
                })
            );
        },
        icon: 'simple_domain',
        gcd: false,
        castTime: '0s',
        cooldown: '0s',
        description: 'Deals 30 Physical Damage to Target.',
        override: () => {
            const state = store.getState();
            const hasPrecisionCounter = state.statusInfo.statuses.find(buff => buff.key == 'superCounterReady');
            if (hasPrecisionCounter) {
                return 'super_counter';
            }
        } 
    },
    'super_counter': {
        label: 'Super Counter',
        action: (target) => {
            store.dispatch(
                setQueuedAbilityAndTarget({
                    ability: 'simple_domain',
                    target: target ?? null,
                })
            );
        },
        icon: 'melee4',
        gcd: false,
        castTime: '0s',
        cooldown: '0s',
        description: 'Deals 30 Physical Damage to Target.',
        isHighlighted: () => {
            const state = store.getState();
            return state.statusInfo.statuses.find(buff => buff.key == 'superCounterReady');
        },
    },
}

export const abilities = {
    ...meleeAbilities,
    ...casterAbilities,
    ...hunterAbilities,
    ...knightAbilities,
    ...tankRoleAbilities,
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
        description: `equip to swap to white mage`,
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
    'ears': {
        itemId: 4,
        label: 'ears',
        icon: 'paradox',
        type: 'item',
        itemType: 'helmet',
        description: `ears; equip to swap to spellcaster`,
        action: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 4,
            }))
        },
        equip: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 4,
            }))
        },
    },
    'bow': {
        itemId: 5,
        label: 'bow',
        icon: 'hunter',
        type: 'item',
        itemType: 'helmet',
        description: `ears; equip to swap to hunter`,
        action: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 5,
            }))
        },
        equip: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 5,
            }))
        },
    },
    'knights helm': {
        itemId: 6,
        label: 'Knights Helm',
        icon: 'knight',
        type: 'item',
        itemType: 'helmet',
        description: `a knight's helmet; equip to swap to knight`,
        action: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 6,
            }))
        },
        equip: () => {
            store.dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: 6,
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
