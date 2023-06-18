import Phaser from 'phaser';
import store from '../../store/store';
import {
    setAlert,
} from '../../store/alert';


export const isAny = (player, target) => { return true };
export const isEnemy = (player, target) => { return target && target.isEnemy && target.visible && target.hasHealth };
export const isFriendly = (player, target) => { return target && !target.isEnemy && target.visible && target.hasHealth};


export const inMeleeRange = (player, target) => {
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
export const inRangedRange = (player, target) => {
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

export const animationHelpers = {
    stone: _stoneAnimationHelper,
    melee: _meleeAnimationHelper,
}
