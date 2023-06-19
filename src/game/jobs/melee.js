import {
    isAny,
    isEnemy,
    isFriendly,
    inMeleeRange,
    inRangedRange,
    animationHelpers,
} from './utils';

const MeleeJob = {
    name: 'MELEE',
    abilities: {
        'combo1': {
            name: 'combo1',
            display_name: 'Combo 1',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                player.dealDamage(target, 15, 'physical', 500);
                animationHelpers.melee(player, target);
            },
        },
        'combo2': {
            name: 'combo2',
            display_name: 'Combo 2',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'combo1';
                if (isCombo) {
                    player.setPlayerComboAction('combo2');
                } else {
                    player.setPlayerComboAction(null);
                }

                const damage = isCombo ? 25 : 15;
                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);
            },
            isComboAction: true,
        },
        'combo3': {
            name: 'combo3',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'combo2';
                if (isCombo) {
                    player.setPlayerComboAction('combo3');
                } else {
                    player.setPlayerComboAction(null);
                }

                const damage = isCombo ? 30 : 15;
                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);

                if (isCombo) {
                    player.updateOrApplyBuff('surgingTempest', player, 30000, 60000);
                }
            },
            isComboAction: true,
        },
        'combo4': {
            name: 'combo4',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'combo2';
                if (isCombo) {
                    player.setPlayerComboAction('combo4');
                } else {
                    player.setPlayerComboAction(null);
                }

                const damage = isCombo ? 35 : 15;
                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);
            },
            isComboAction: true,
        },
        'sinawali': {
            name: 'sinawali',
            gcd: false,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('sinawali');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.startCooldown('sinawali', 1000);
                player.dealDamage(target, 10, 'physical', 500);
                animationHelpers.melee(player, target);
            },
        },
    },
}

export default MeleeJob;
