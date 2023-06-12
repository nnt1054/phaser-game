import store from '../store/store';
import {
    setAlert,
} from '../store/alert';
import {
    updateJob,
} from '../store/playerState';
import buffs from './buffs';

const isAny = (player, target) => { return true };
const isEnemy = (player, target) => { return target && target.isEnemy && target.visible && target.hasHealth };
const isFriendly = (player, target) => { return target && !target.isEnemy && target.visible && target.hasHealth};
const inMeleeRange = (player, target) => {
    if (!target) return false;
    if (!target.hasHealth) return false;
    if (target.health <= 0) return false;
    const inRange = player.isTargetInRange(
        target.hitboxRect,
        player.ref_x, player.ref_y, 128, 86, 0.5, 0.5,
    )
    if (!inRange) {
        store.dispatch(setAlert('Target is out of range.'));
        return false;
    }
    return true;
};
const inRangedRange = (player, target) => {
    if (target.health <= 0) return false;
    const inRange = player.isTargetInRange(
        target.hitboxRect,
        player.ref_x, player.ref_y,  1028, 128 + 4, 0.5, 0.5,
    )
    if (!inRange) {
        store.dispatch(setAlert('Target is out of range.'));
        return false;
    }
    return true;
}

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
                const duration = _stoneAnimationHelper(player, target)
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
                target.updateOrApplyBuff('aero', player, 30000);
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
                target.updateOrApplyBuff('regen', player, 12000);
            },
        },
    },
};


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
                _meleeAnimationHelper(player, target);
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
                _meleeAnimationHelper(player, target);
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
                _meleeAnimationHelper(player, target);
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
                _meleeAnimationHelper(player, target);
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
                player.applyBuff(buffs['acceleration'], player);
                player.startCooldown('acceleration', 30000);
            },
        },
        'corps_a_corps': {
            name: 'corps_a_corps',
            display_name: 'Corps-a-corps',
            gcd: false,
            canTarget: isEnemy,
            canExecute: inRangedRange,
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
                target.applyBuff(buffs['miasma'], player)
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
                const duration = _stoneAnimationHelper(player, target)
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

// animation helpers
const _stoneAnimationHelper = (player, target) => {
    let bounds = player.hitboxRect.getBounds();
    let targetBounds = target.hitboxRect.getBounds();
    let angle = Phaser.Math.Angle.Between(bounds.centerX, bounds.centerY, targetBounds.centerX, targetBounds.centerY);
    let distance = Phaser.Math.Distance.Between(bounds.centerX, bounds.centerY, targetBounds.centerX, targetBounds.centerY);
    var duration = distance / 0.75;
    let vfx = player.scene.add.sprite(bounds.centerX, bounds.centerY);
    let facingRight = bounds.centerX < targetBounds.centerX;
    vfx.setOrigin(0.5, 0.5);
    vfx.setRotation(angle);
    vfx.play('jolt');
    let tween = player.scene.tweens.add({
        targets: [ vfx ],
        x: targetBounds.centerX,
        y: targetBounds.centerY,
        duration: duration,
        ease: 'Sine.easeIn',
    });
    tween.on('complete', () => {
        vfx.destroy();
        let bounds = target.hitboxRect.getBounds();
        let smoke = player.scene.add.sprite(bounds.centerX, bounds.bottom + 16);
        if (!facingRight) {
            smoke.scaleX = -1;
        }
        smoke.setOrigin(0.5, 1);
        smoke.play('smoke');
        smoke.on('animationcomplete', () => {
            smoke.destroy();
        })

        // testing for fun
        let vfx2 = player.scene.add.sprite(bounds.centerX, bounds.bottom + 16);
        vfx2.scaleX = 3;
        vfx2.setOrigin(0.5, 1);
        vfx2.setDepth(1000);
        vfx2.play('explosion');
        vfx2.on('animationcomplete', () => {
            vfx2.destroy();
        });
    })
    return duration;
};

const _meleeAnimationHelper = (player, target) => {
    let bounds = target.hitboxRect.getBounds();
    let vfx = player.scene.add.sprite(player.ref_x, player.ref_y + 6);
    player.add(vfx);
    if (player.facingRight) {
        vfx.scaleX = 1.5;
    } else {
        vfx.scaleX = -1.5;            
    }
    vfx.setOrigin(0.5, 1);
    vfx.play('slice');
    vfx.on('animationcomplete', () => {
        vfx.destroy();
    })

    player.scene.time.delayedCall(400, () => {
        let vfx2 = player.scene.add.sprite(bounds.centerX, bounds.bottom + 24);
        vfx2.setOrigin(0.5, 1);
        vfx2.play('impact');
        vfx2.on('animationcomplete', () => {
            vfx2.destroy();
        })
    });
};

const jobMap = {
    'TMP': TempJob,
    'HEAL': HealerJob,
}

export const JobMixin = {
    hasJob: true,
    currentJob: TempJob,
    setJob(key) {
        this.unapplyAllBuffsFromSource();
        const job = jobMap[key]
        this.currentJob = job;
        this.updateJobStore();
        if (this.hasExperience) {
            this.refreshExperience();
        };
        this.updateCooldownsStore();
    },

    updateJobStore() {
        store.dispatch(updateJob(this.currentJob.name));
    }
};
