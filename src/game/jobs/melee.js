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
        'linear_strike': {
            name: 'linear_strike',
            display_name: 'Linear Strike',
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
        'fanning_strike': {
            name: 'fanning_strike',
            display_name: 'Fanning Strike',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'linear_strike';
                if (isCombo) {
                    player.setPlayerComboAction('fanning_strike');
                } else {
                    player.setPlayerComboAction(null);
                }

                const damage = isCombo ? 25 : 15;
                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);
            },
            isComboAction: true,
        },
        'redondo': {
            name: 'redondo',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'fanning_strike';
                player.setPlayerComboAction(null);

                const damage = isCombo ? 30 : 15;
                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);

                if (isCombo) {
                    player.updateOrApplyBuff('flow', player, 45000, 90000);
                    if (player.getBuffCount('chakra') < 4)  {
                        player.applyBuff('chakra', player);
                    };
                }
            },
            isComboAction: true,
        },
        'exis_strike': {
            name: 'exis_strike',
            gcd: true,
            castTime: 0,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: inMeleeRange,
            execute: (player, target) => {
                const isCombo = player.comboAction == 'fanning_strike';
                player.setPlayerComboAction(null);

                const damage = isCombo ? 35 : 15;
                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);

                if (isCombo) {
                    if (player.getBuffCount('chakra') < 4)  {
                        player.applyBuff('chakra', player);
                    };
                }
            },
            isComboAction: true,
        },
        'largo_mano_strike': {
            name: 'largo_mano_strike',
            display_name: 'Largo Mano Strike',
            gcd: false,
            cooldown: 2500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('largo_mano_strike');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 45, 'physical', 500);
                animationHelpers.melee(player, target);

                if (player.getBuffCount('chakra') < 4)  {
                    player.applyBuff('chakra', player);
                };

                if (player.getBuffCount('chakra') < 4)  {
                    player.applyBuff('chakra', player);
                };

                player.startCooldown('largo_mano_strike', 90000);
            },
            isComboAction: true,
        },
        'corto_mano_dash': {
            name: 'corto_mano_dash',
            display_name: 'Corto Mano Dash',
            gcd: false,
            cooldown: 1500,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inRangedRange(player, target)) return false;
                const [cooldown, duration] = player.getCooldown('corto_mano_dash');
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
                player.startCooldown('corto_mano_dash', 12000);
            },
            isComboAction: true,
        },
        'earthly_weave': {
            name: 'earthly_weave',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                
                const [cooldown, duration] = player.getCooldown('earthly_weave');
                if (cooldown > 0) return false;

                if (!player.getBuff('earthlyWeaveReady')) return false;

                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 10, 'physical', 500);
                animationHelpers.melee(player, target);
                player.getAndRemoveBuff('earthlyWeaveReady');
                player.startCooldown('earthly_weave', 1000);
            },
        },
        'heavenly_weave': {
            name: 'heavenly_weave',
            gcd: false,
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;
                
                const [cooldown, duration] = player.getCooldown('heavenly_weave');
                if (cooldown > 0) return false;

                if (!player.getBuff('heavenlyWeaveReady')) return false;

                return true;
            },
            execute: (player, target) => {
                player.dealDamage(target, 10, 'physical', 500);
                animationHelpers.melee(player, target);
                player.getAndRemoveBuff('heavenlyWeaveReady');
                player.startCooldown('heavenly_weave', 1000);
            },
        },
        'earthly_strike': {
            name: 'earthly_strike',
            display_name: 'Earthly Strike',
            gcd: true,
            castTime: 0,
            cooldown: 2000,
            overrideCooldown: (player) => {
                const isEarthCombo = player.comboAction == 'earthly_strike';
                const isHeavenCombo = player.comboAction == 'heavenly_strike';
                if (isEarthCombo || isHeavenCombo) {
                    return 2500;
                } else {
                    return 1500;
                }
            },
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;

                const isEarthCombo = player.comboAction == 'earthly_strike';
                const isHeavenCombo = player.comboAction == 'heavenly_strike';
                if (isEarthCombo || isHeavenCombo) return true;

                if (player.getBuff('chakra')) return true;

                return false;
            },
            execute: (player, target) => {
                let damage = 20;
                const isEarthCombo = player.comboAction == 'earthly_strike';
                const isHeavenCombo = player.comboAction == 'heavenly_strike';

                // get base potency and update combo action;
                if (isEarthCombo) {
                    player.setPlayerComboAction(null);
                } else if (isHeavenCombo) {
                    damage = 25;
                    player.setPlayerComboAction(null);
                } else {
                    player.getAndRemoveBuff('chakra');
                    player.setPlayerComboAction('earthly_strike');
                }

                if (player.getBuff('earthAligned')) {
                    damage = damage * 2;
                    player.getAndRemoveBuff('earthAligned');
                }

                // apply combo bonus effects
                if (isEarthCombo) {
                    player.updateOrApplyBuff('earthAligned', player, 15000, 15000);
                } else if (isHeavenCombo) {
                    target.updateOrApplyBuff('blighted', player, 45000, 45000);
                } else {
                    player.updateOrApplyBuff('earthlyWeaveReady', player, 15000, 15000);
                }

                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);
            },
            isComboAction: true,
        },
        'heavenly_strike': {
            name: 'heavenly_strike',
            display_name: 'Heavenly Strike',
            gcd: true,
            castTime: 0,
            cooldown: 2000,
            overrideCooldown: (player) => {
                const isEarthCombo = player.comboAction == 'earthly_strike';
                const isHeavenCombo = player.comboAction == 'heavenly_strike';
                if (isEarthCombo || isHeavenCombo) {
                    return 2500;
                } else {
                    return 1500;
                }
            },
            canTarget: isEnemy,
            canExecute: (player, target) => {
                if (!inMeleeRange(player, target)) return false;

                const isEarthCombo = player.comboAction == 'earthly_strike';
                const isHeavenCombo = player.comboAction == 'heavenly_strike';
                if (isEarthCombo || isHeavenCombo) return true;

                if (player.getBuff('chakra')) return true;

                return false;
            },
            execute: (player, target) => {
                let damage = 30;
                const isEarthCombo = player.comboAction == 'earthly_strike';
                const isHeavenCombo = player.comboAction == 'heavenly_strike';

                if (isEarthCombo) {
                    damage = 50;
                    player.setPlayerComboAction(null);
                } else if (isHeavenCombo) {
                    player.setPlayerComboAction(null);
                } else {
                    player.getAndRemoveBuff('chakra');
                    player.setPlayerComboAction('heavenly_strike');
                }

                if (player.getBuff('heavenAligned')) {
                    damage = damage * 2;
                    player.getAndRemoveBuff('heavenAligned');
                }

                if (isEarthCombo) {
                } else if (isHeavenCombo) {
                    player.updateOrApplyBuff('heavenAligned', player, 15000, 15000);
                } else {
                    player.updateOrApplyBuff('heavenlyWeaveReady', player, 15000, 15000);
                }

                player.dealDamage(target, damage, 'physical', 500);
                animationHelpers.melee(player, target);
            },
            isComboAction: true,
        },
        'enlightenment': {
            name: 'enlightenment',
            display_name: 'Enlightenment',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('enlightenment');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.updateOrApplyBuff('enlightenment', player, 21000, 21000);
                player.startCooldown('enlightenment', 90000);
            },
        },
        'contrada': {
            name: 'contrada',
            display_name: 'Contrada',
            gcd: false,
            canTarget: isAny,
            canExecute: (player) => {
                const [cooldown, duration] = player.getCooldown('contrada');
                if (cooldown > 0) return false;
                return true;
            },
            execute: (player) => {
                player.updateOrApplyBuff('contrada', player, 15000, 15000);
                player.startCooldown('contrada', 60000);
            },
        },
    },
}

export default MeleeJob;
