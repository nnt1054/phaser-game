import {
    isAny,
    isEnemy,
    isFriendly,
    inMeleeRange,
    inRangedRange,
    animationHelpers,
} from './utils';

import buffs from '../buffs';

const _woundedHelper = (player, target, damage) => {
    if (target.getBuffCount('wounded') == 4) {
        damage = damage * 2;
        target.getAndRemoveBuff('wounded');
        target.getAndRemoveBuff('wounded');
        target.getAndRemoveBuff('wounded');
        target.getAndRemoveBuff('wounded');
    } else {
        target.applyBuff('wounded', player);
    }
    return damage;
}

const HunterJob = {
    name: 'HUNTER',
    abilities: {
        'arrow': {
            name: 'arrow',
            display_name: 'Arrow',
            gcd: true,
            cooldown: 2000,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                let damage = 15;
                damage = _woundedHelper(player, target, damage);
                player.dealDamage(target, damage, 'physical', duration);
            },
        },
        'heavy_arrow': {
            name: 'heavy_arrow',
            display_name: 'Heavy Arrow',
            gcd: true,
            cooldown: 2000,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'arrow';
                if (isCombo) {
                    player.setPlayerComboAction('heavy_arrow');
                } else {
                    player.setPlayerComboAction(null);
                }

                let damage = isCombo ? 30 : 15;
                damage = _woundedHelper(player, target, damage);
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, damage, 'physical', duration);
            },
            isComboAction: true,
        },
        'straight_arrow': {
            name: 'straight_arrow',
            display_name: 'Straight Arrow',
            gcd: true,
            cooldown: 2000,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'heavy_arrow';
                player.setPlayerComboAction(null);

                let damage = isCombo ? 20 : 15;
                damage = _woundedHelper(player, target, damage);
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, damage, 'physical', duration);
            },
            isComboAction: true,
        },
        'blast_arrow': {
            name: 'blast_arrow',
            display_name: 'Blast Arrow',
            gcd: true,
            cooldown: 2000,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('blast_arrow');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                let damage = 50;
                damage = _woundedHelper(player, target, damage);
                player.dealDamage(target, 50, 'physical', duration);
                player.startCooldown('blast_arrow', 20000);
            },
        },
        'arcane_arrow': {
            name: 'arcane_arrow',
            display_name: 'Arcane Arrow',
            gcd: true,
            cooldown: 2000,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('arcane_arrow');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                let damage = 60;
                damage = _woundedHelper(player, target, damage);
                player.dealDamage(target, damage, 'magical', duration);
                player.startCooldown('arcane_arrow', 40000);
            },
        },
        'apex_arrow': {
            name: 'apex_arrow',
            display_name: 'Apex Arrow',
            gcd: true,
            castTime: 2500,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('apex_arrow');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                let damage = 70;
                damage = _woundedHelper(player, target, damage);
                player.dealDamage(target, damage, 'physical', duration);
                player.startCooldown('apex_arrow', 120000);
            },
        },
        'repelling_shot': {
            name: 'repelling_shot',
            display_name: 'Repelling Shot',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('repelling_shot');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 15, 'physical', duration);

                const hitboxRect = target.hitboxRect;
                const playerX = player.hitboxRect.getBounds().centerX;
                const targetX = hitboxRect.getBounds().centerX;
                const facingRight = playerX < targetX;
                let position = facingRight ? player.x - 128 : player.x + 128;
                const tween = player.dash(position, 150);
                tween.on('complete', () => {
                    let bounds = hitboxRect.getBounds();
                    let smoke = player.scene.add.sprite(bounds.centerX, bounds.bottom + 16);
                    if (!facingRight) {
                        smoke.scaleX = -1;
                    }
                    smoke.setOrigin(0.5, 1);
                    smoke.play('smoke');
                    smoke.on('animationcomplete', () => {
                        smoke.destroy();
                    })
                })

                player.startCooldown('repelling_shot', 30000);
            },
        },
        'quick_draw': {
            name: 'quick_draw',
            display_name: 'Quick Draw',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                if (!player.getBuff('arrowStock')) return false;
                const [cooldown, duration] = player.getCooldown('quick_draw');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 15, 'physical', duration);
                player.getAndRemoveBuff('arrowStock');
                player.startCooldown('quick_draw', 750);
            },
        },
        'carve': {
            name: 'carve',
            display_name: 'Carve',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('carve');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 30, 'physical', 500);
                animationHelpers.melee(player, target);

                Array(10).fill().map(() => {
                    if (player.getBuffCount('arrowStock') < 10)  {
                        player.applyBuff('arrowStock', player);
                    };
                })

                player.startCooldown('carve', 60000);
            },
        },
    },
};

export default HunterJob;
