import {
    isAny,
    isEnemy,
    isFriendly,
    inMeleeRange,
    inRangedRange,
    animationHelpers,
} from './utils';

import buffs from '../buffs';

const KnightJob = {
    name: 'KNIGHT',
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
            },
            isComboAction: true,
        },
        'corps_a_corps': {
            name: 'corps_a_corps',
            display_name: 'Corps-a-corps',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('corps_a_corps');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                const hitboxRect = target.hitboxRect;
                const isOverlapping = Phaser.Geom.Rectangle.Overlaps(
                    player.body,
                    hitboxRect.getBounds(),
                )
                if (!isOverlapping) {
                    const facingRight = player.body.center.x < hitboxRect.getBounds().centerX;
                    let position = facingRight ?
                        hitboxRect.getBounds().left - player.body.width :
                        hitboxRect.getBounds().right;
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
                }

                player.dealDamage(target, 10, 'physical', 500);
                player.startCooldown('corps_a_corps', 12000);
            },
        },
        'fleche': {
            name: 'fleche',
            display_name: 'Fleche',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('fleche');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 15, 'physical', 500);
                animationHelpers.melee(player, target);
                player.startCooldown('fleche', 12000);
            },
        },
        'precision_block': {
            name: 'precision_block',
            display_name: 'Precision Block',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                // counter
                if (player.getBuff('precisionCounter') && inMeleeRange(player, target)) return true;

                // block
                const [cooldown, duration] = player.getCooldown('precision_block');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                if (player.getBuff('precisionCounter')) {
                    // counter
                    player.dealDamage(target, 15, 'physical', 500);
                    animationHelpers.melee(player, target); 
                    player.getAndRemoveBuff('precisionCounter');
                } else {
                    // block
                    player.applyBuff('precisionBlock', player);
                    player.startCooldown('precision_block', 12000);
                }
            },
        },
        'simple_domain': {
            name: 'simple_domain',
            display_name: 'Simple Domain',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                const [cooldown, duration] = player.getCooldown('simple_domain');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.applyBuff('simpleDomain', player);
                player.applyBuff('simpleDomainProtected', player);
                player.startCooldown('simple_domain', 60000);
            },
        },
        'rampart': {
            name: 'rampart',
            display_name: 'Rampart',
            gcd: false,
            canTarget: isAny,
            canExecute: (player, target) => {
                const [cooldown, duration] = player.getCooldown('rampart');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.applyBuff('rampart', player);
                player.startCooldown('rampart', 90000);
            },
        },
        'reprisal': {
            name: 'reprisal',
            display_name: 'Reprisal',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                const [cooldown, duration] = player.getCooldown('reprisal');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                target.applyBuff('reprisal', player);
                player.startCooldown('reprisal', 60000);
            },
        },
    }
};

export default KnightJob;
