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
        'fire': {
            name: 'fire',
            display_name: 'fire',
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
                    player.updateOrApplyBuff('fireProc', player, 120000, 120000);
                } else if (Math.random() < 0.5) {
                    player.updateOrApplyBuff('fireProc', player, 120000, 120000);
                }
            },
        },
        'fire_ii': {
            name: 'fire_ii',
            display_name: 'Fire II',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('fireProc')) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 25, 'magical', duration);
                player.getAndRemoveBuff('fireProc');
            },
        },
        'ice': {
            name: 'ice',
            display_name: 'ice',
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
                    player.updateOrApplyBuff('iceProc', player, 120000, 120000);
                } else if (Math.random() < 0.5) {
                    player.updateOrApplyBuff('iceProc', player, 120000, 120000);
                }
            },
        },
        'ice_ii': {
            name: 'ice_ii',
            display_name: 'Ice II',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('iceProc')) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 25, 'magical', duration);
                player.getAndRemoveBuff('iceProc');
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
        'paradox': {
            name: 'paradox',
            display_name: 'Paradox',
            gcd: true,
            castTime: 2500,
            cooldown: 3000,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;

                const [cooldown, duration] = player.getCooldown('paradox');
                if (cooldown > 0) return false;

                if (!player.getBuff('fireProc')) return false;
                if (!player.getBuff('iceProc')) return false;
                if (!player.getBuff('earthProc')) return false;

                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 100, 'magical', duration);
                player.getAndRemoveBuff('fireProc');
                player.getAndRemoveBuff('iceProc');
                player.getAndRemoveBuff('earthProc');
                player.startCooldown('paradox', 120000);
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
        'thunder': {
            name: 'thunder',
            display_name: 'Thunder',
            gcd: true,
            castTime: 2300,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('fireProc')) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                target.updateOrApplyBuff('shocked', player, 30000, 60000);
                player.getAndRemoveBuff('fireProc');
            },
        },
    }
};

export default CasterJob;
