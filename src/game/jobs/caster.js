import {
    isAny,
    isEnemy,
    isFriendly,
    inMeleeRange,
    inRangedRange,
    animationHelpers,
} from './utils';

import buffs from '../buffs';

const CasterJob = {
    name: 'SPELL',
    abilities: {
        'ice': {
            name: 'ice',
            display_name: 'ice',
            gcd: true,
            castTime: 0,
            cooldown: 1500,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 15, 'magical', duration);


                if (player.getBuffCount('manaStack') < 10)  {
                    player.applyBuff('manaStack', player);
                };

                player.updateOrApplyBuff('iceProc', player, 15000, 15000);

                if (player.getBuff('fireProc')) {
                    player.getAndRemoveBuff('fireProc');
                }

                if (player.getBuff('earthProc')) {
                    player.getAndRemoveBuff('earthProc');
                }
            },
        },
        'ice_ii': {
            name: 'ice_ii',
            display_name: 'Ice II',
            gcd: true,
            castTime: 2000,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('iceProc')) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 30, 'magical', duration);

                if (player.getBuffCount('manaStack') < 10)  {
                    player.applyBuff('manaStack', player);
                };

                if (player.getBuffCount('manaStack') < 10)  {
                    player.applyBuff('manaStack', player);
                };
            },
        },

        'fire': {
            name: 'fire',
            display_name: 'fire',
            gcd: true,
            castTime: 0,
            cooldown: 1500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('ascendance') && player.getBuffCount('manaStack') < 1) {
                    console.log('what');
                    return false;
                }
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 30, 'magical', duration);

                if (!player.getBuff('ascendance')) {
                    player.getAndRemoveBuff('manaStack');
                }

                player.updateOrApplyBuff('fireProc', player, 15000, 15000);

                if (player.getBuff('iceProc')) {
                    player.getAndRemoveBuff('iceProc');
                }

                if (player.getBuff('earthProc')) {
                    player.getAndRemoveBuff('earthProc');
                }
            },
        },
        'fire_ii': {
            name: 'fire_ii',
            display_name: 'Fire II',
            gcd: true,
            castTime: 2000,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('fireProc')) return false;
                if (!player.getBuff('ascendance') && player.getBuffCount('manaStack') < 2) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 40, 'magical', duration);

                if (!player.getBuff('ascendance')) {
                    player.getAndRemoveBuff('manaStack');
                    player.getAndRemoveBuff('manaStack');
                }
            },
        },

        'thunder': {
            name: 'thunder',
            display_name: 'Thunder',
            gcd: true,
            castTime: 0,
            cooldown: 1500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 30, 'magical', duration);
                player.updateOrApplyBuff('earthProc', player, 15000, 15000);

                if (player.getBuff('iceProc')) {
                    player.getAndRemoveBuff('iceProc');
                }

                if (player.getBuff('fireProc')) {
                    player.getAndRemoveBuff('fireProc');
                }
            },
        },
        'lightning': {
            name: 'lightning',
            display_name: 'Lightning',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('earthProc')) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                target.updateOrApplyBuff('shocked', player, 30000, 60000);
            },
        },

        'paradox': {
            name: 'paradox',
            display_name: 'Paradox',
            gcd: true,
            castTime: 2500,
            cooldown: 3000,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('ascendance') && player.getBuffCount('manaStack') < 5) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 60, 'magical', duration);
                if (!player.getBuff('ascendance')) {
                    player.getAndRemoveBuff('manaStack');
                    player.getAndRemoveBuff('manaStack');
                    player.getAndRemoveBuff('manaStack');
                    player.getAndRemoveBuff('manaStack');
                    player.getAndRemoveBuff('manaStack');
                }
            },
        },

        'manafication': {
            name: 'manafication',
            display_name: 'Manafication',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('manafication');
                if (cooldown > 0) return false;
                if (player.getBuffCount('manaStack') < 1) return false;
                return true;
            },
            execute: (player) => {
                const manaCount = player.getBuffCount('manaStack');
                Array(manaCount).fill().map(() => {
                    if (player.getBuffCount('manaStack') < 10)  {
                        player.applyBuff('manaStack', player);
                    };
                })
                player.startCooldown('manafication', 60000);
            },
        },

        'swiftcast': {
            name: 'swiftcast',
            display_name: 'Swiftcast',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('swiftcast');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.applyBuff('swiftcast', player);
                player.startCooldown('swiftcast', 45000);
            },
        },

        'ascendance': {
            name: 'ascendance',
            display_name: 'Ascendance',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('ascendance');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.applyBuff('ascendance', player);
                player.startCooldown('ascendance', 120000);
            },
        },

        'manafont': {
            name: 'manafont',
            display_name: 'Manafont',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('manafont');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.updateOrApplyBuff('manafont', player, 240000, 240000);
                player.startCooldown('manafont', 1000);
            },
        },

        'earth': {
            name: 'earth',
            display_name: 'earth',
            gcd: true,
            castTime: 2200,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 25, 'magical', duration);

                if (player.getBuff('triplecastProc')) {
                    player.getAndRemoveBuff('triplecastProc');
                    player.updateOrApplyBuff('earthProc', player, 120000, 120000);
                } else if (Math.random() < 0.5) {
                    player.updateOrApplyBuff('earthProc', player, 120000, 120000);
                }
            },
        },
        'earth_ii': {
            name: 'earth_ii',
            display_name: 'Earth II',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('earthProc')) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 25, 'magical', duration);
                player.getAndRemoveBuff('earthProc');
            },
        },
        'air_walk': {
            name: 'air_walk',
            display_name: 'Air Walk',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('air_walk');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.startCooldown('air_walk', 90000);
            },
        },
        'triplecast': {
            name: 'triplecast',
            display_name: 'Triplecast',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('triplecast');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.applyBuff('triplecastProc', player);
                player.applyBuff('triplecastProc', player);
                player.applyBuff('triplecastProc', player);
                player.startCooldown('triplecast', 120000);
            },
        },
    }
};

export default CasterJob;
