import {
    isAny,
    isEnemy,
    isFriendly,
    inMeleeRange,
    inRangedRange,
    animationHelpers,
} from './utils';

import buffs from '../buffs';

const TempJob = {
    name: 'TMP',
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
        'slice': {
            name: 'slice',
            gcd: true,
            castTime: 0,
            cooldown: 1500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                player.dealDamage(target, 15, 'physical', 500);
                animationHelpers.melee(player, target);
            },
        },
        'acceleration': {
            name: 'acceleration',
            display_name: 'Acceleration',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('acceleration');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.applyBuff('acceleration', player);
                player.startCooldown('acceleration', 30000);
            },
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
        'displacement': {
            name: 'displacement',
            display_name: 'Displacement',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('displacement');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 10, 'physical', 500);
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

                player.startCooldown('displacement', 12000);
            },
        },
        'fleche': {
            name: 'fleche',
            display_name: 'Fleche',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('fleche');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 10, 'magical');
                player.startCooldown('fleche', 12000);

                let bounds = target.hitboxRect.getBounds();
                let vfx = player.scene.add.sprite(bounds.centerX, bounds.bottom + 12);
                vfx.setScale(1.5);
                vfx.setOrigin(0.5, 1);
                vfx.play('fleche');
                vfx.on('animationcomplete', () => {
                    vfx.destroy();
                })

                player.scene.time.delayedCall(150, () => {
                    let vfx2 = player.scene.add.sprite(bounds.centerX, bounds.bottom + 24);
                    vfx2.setOrigin(0.5, 1);
                    vfx2.play('smoke');
                    vfx2.on('animationcomplete', () => {
                        vfx2.destroy();
                    });
                });
            },
        },
        'vercure': {
            name: 'vercure',
            display_name: 'Vercure',
            gcd: true,
            cooldown: 2500,
            castTime: 2000,
            canTarget: isFriendly,
            canExecute: inRangedRange,
            execute: (player, target) => {
                target.increaseHealth(20);
            },
        },
        'verthunder': {
            name: 'verthunder',
            display_name: 'Verthunder',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                target.applyBuff('miasma', player)
            },
        },
        'jolt': {
            name: 'jolt',
            display_name: 'Jolt',
            gcd: true,
            castTime: 2000,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inRangedRange,
            execute: (player, target) => {
                const duration = animationHelpers.stone(player, target)
                player.dealDamage(target, 25, 'magical', duration);
                
                // find and damage other enemies around target
                let targetBounds = target.hitboxRect.getBounds();
                let rect = player.scene.add.rectangle(
                    targetBounds.centerX, targetBounds.y + targetBounds.height,
                    256, 128, 0xff0000, 0.5,
                );
                rect.setOrigin(0.5, 1);
                for (const enemy of player.scene.enemies) {
                    if (
                        Phaser.Geom.Rectangle.Overlaps(rect.getBounds(), enemy.hitboxRect.getBounds())
                        && enemy.visible
                        && enemy != target
                    ) {
                        // TODO: UPDATE AOE'S SUCH THAT EXP IS GRATNED AFTER ALL TARGETS ARE DEALT DAMAGE
                        player.dealDamage(enemy, 25, 'magical', duration);
                    }
                };
                rect.destroy();
            },
        }
    }
};

export default TempJob;
