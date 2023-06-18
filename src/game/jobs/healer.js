import {
    isAny,
    isEnemy,
    isFriendly,
    inMeleeRange,
    inRangedRange,
    animationHelpers,
} from './utils';
import buffs from '../buffs';

const HealerJob = {
    name: 'HEAL',
    abilities :{
        'stone': {
            name: 'stone',
            display_name: 'Stone',
            castTime: 1500,
            gcd: true,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 25, 'magical', duration);
            },
        },
        'aero': {
            name: 'aero',
            display_name: 'Aero',
            castTime: 0,
            gcd: true,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                target.updateOrApplyBuff('aero', player, 30000, 30000);
            },
        },
        'regen': {
            name: 'regen',
            display_name: 'Regen',
            castTime: 0,
            gcd: true,
            cooldown: 2500,
            canTarget: isFriendly,
            canExecute: inRangedRange,
            execute: (player, target) => {
                target.updateOrApplyBuff('regen', player, 12000, 12000);
            },
        },
    },
};

export default HealerJob;
