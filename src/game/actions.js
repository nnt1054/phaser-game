import store from '../store/store';
import {
    incrementHealth,
    setPlayerCurrentHealth,
} from '../store/playerHealth';
import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
} from '../store/playerMana';
import {
    setItemCount,
    addItemCount,
    subractItemCount,
} from '../store/inventory';
import {
    setAlert,
} from '../store/alert';
import {
    addMessage,
} from '../store/chatBox';
import buffs from './buffs';

import helmets from './equipment/helmets';

const isAny = (player, target) => { return true };
const isEnemy = (player, target) => { return target && target.isEnemy && target.visible };
const isFriendly = (player, target) => { return target && target.hasHealth && !target.isEnemy && target.visible };

const untarget = {
    type: 'system',
    execute: (player) => {
        player.untargetObject();
    },
};

const confirm = {
    type: 'system',
    execute: (player) => {
        if (player.currentTarget) {
            if (player.currentTarget.handleConfirm) {
                player.currentTarget.handleConfirm();
            }
        } else {
            const isReverse = !player.facingRight;
            player.cycleTargets(isReverse);
        }
    },
};

const sendChat = {
    type: 'sendChat',
    execute: (player, text) => {
        player.displayMessage(text);
        store.dispatch(addMessage(`${ player.displayName}: ${ text }`));
    },
};

const cycleTarget = {
    type: 'system',
    execute: (player) => {
        player.cycleTargets();
    },
}

const cycleTargetReverse = {
    type: 'system',
    execute: (player) => {
        player.cycleTargets(true);
    },
}

const targetEnemyFromEnemyList = {
    type: 'system',
    execute: (player, index) => {
        player.targetEnemyFromEnemyList(index);
    },
}

const cycleTargetFromEnemyList = {
    type: 'system',
    execute: (player) => {
        player.cycleTargetFromEnemyList();
    },
}

const cycleTargetFromEnemyListReverse = {
    type: 'system',
    execute: (player) => {
        player.cycleTargetFromEnemyList(true);
    },
}

const equipHelmet = {
    type: 'system',
    execute: (player, itemId) => {
        const item = helmets[itemId]
        if (!item) return;

        const itemCount = player.inventory.get(item.name) || 0;
        if (itemCount < 1) return;

        const currentItem = player.equipped.helmet;

        player.removeItem(item.name);
        player.equipHelmet(item);

        // store.dispatch(setHelmet(item));
        if (currentItem) {
            player.addItem(currentItem.name);
        }
    },
}

const jolt = {
    name: 'jolt',
    type: 'spell',
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        if (player.isMoving()) return false;
        return true;
    },
    execute: (player, target) => {
        let bounds = player.hitboxRect.getBounds();
        let targetBounds = target.hitboxRect.getBounds();
        let angle = Phaser.Math.Angle.Between(bounds.centerX, bounds.centerY, targetBounds.centerX, targetBounds.centerY);
        let distance = Phaser.Math.Distance.Between(bounds.centerX, bounds.centerY, targetBounds.centerX, targetBounds.centerY);
        var duration = distance / 0.75;

        target.reduceHealth(25, duration);
        if (target.hasAggro) {
            target.addAggro(player, 25);
        }

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
        })
    },
}


const verthunder = {
    name: 'verthunder',
    type: 'ability',
    gcd: true,
    castTime: 0,
    cooldown: 2500,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        // TODO: move to player logic; if castTime > 0; then check if player.isMoving
        // if (player.isMoving()) return false;
        return true;
    },
    execute: (player, target) => {
        // target.reduceHealth(25);
        if (target.hasAggro) {
            // target.addAggro(player, 25);
            target.applyBuff(buffs['miasma'], player)
        }
    },
}

const fleche = {
    type: 'ability',
    gcd: false,
    cooldown: 1000,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        const [cooldown, duration] = player.cooldownManager.getTimer('fleche');
        if (cooldown > 0) return false;
        return true;
    },
    execute: (player, target) => {
        target.reduceHealth(10);
        if (target.hasAggro) {
            target.addAggro(player, 10);
        }

        player.cooldownManager.startTimer('fleche', 12000);

        let bounds = target.hitboxRect.getBounds();
        let vfx = player.scene.add.sprite(bounds.centerX, bounds.bottom + 12);
        vfx.setScale(1.5);
        vfx.setOrigin(0.5, 1);
        vfx.play('fleche');
        vfx.on('animationcomplete', () => {
            vfx.destroy();
        })

        setTimeout(() => {
            let vfx2 = player.scene.add.sprite(bounds.centerX, bounds.bottom + 24);
            vfx2.setOrigin(0.5, 1);
            vfx2.play('smoke');
            vfx2.on('animationcomplete', () => {
                vfx2.destroy();
            })
        }, 150);
    },
}

const vercure = {
    name: 'vercure',
    type: 'spell',
    gcd: true,
    castTime: 2000,
    cooldown: 2500,
    canTarget: isFriendly,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = (player == target) ? true : Phaser.Geom.Rectangle.Overlaps(
            player.rangedRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        if (player.isMoving()) return false;
        return true;
    },
    execute: (player, target) => {
        // target.increaseHealth(20);
        target.applyBuff(buffs['regen']);

        // TODO: add MP mixin
        store.dispatch(decrementMana());
    },
}

const potion = {
    name: 'potion',
    type: 'item',
    cooldown: 1000,
    gcd: false,
    canTarget: isAny,
    canExecute: (player) => {
        const [cooldown, duration] = player.cooldownManager.getTimer('potion');
        return (cooldown == 0 && player.hasItem('potion'));
    },
    execute: (player) => {
        const itemCount = player.inventory.get('potion') || 0;
        player.inventory.set('potion', itemCount - 1);
        store.dispatch(subractItemCount({
            name: 'potion',
            value: 1,
        }))
        player.setCurrentHealth(100, true);
        player.cooldownManager.startTimer('potion', 8000);
    },
};

const slice = {
    name: 'slice',
    type: 'weaponskill ',
    gcd: true,
    castTime: 0,
    cooldown: 1500,
    canTarget: isEnemy,
    canExecute: (player, target) => {
        if (!target) return false;
        if (!target.hasHealth) return false;
        if (target.health <= 0) return false;
        const inRange = Phaser.Geom.Rectangle.Overlaps(
            player.meleeRect.getBounds(),
            target.hitboxRect.getBounds(),
        )
        if (!inRange) {
            store.dispatch(setAlert('Target is out of range.'));
            return false;
        }
        return true;
    },
    execute: (player, target) => {
        target.reduceHealth(15, 500);
        if (target.hasAggro) {
            target.addAggro(player, 15);
        }

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

        setTimeout(() => {
            let vfx2 = player.scene.add.sprite(bounds.centerX, bounds.bottom + 24);
            vfx2.setOrigin(0.5, 1);
            vfx2.play('impact');
            vfx2.on('animationcomplete', () => {
                vfx2.destroy();
            })
        }, 400);
    },
}

const actionMap = {
    'jolt': jolt,
    'verthunder': verthunder,
    'vercure': vercure,
    'fleche': fleche,
    'slice': slice,

    // items
    'potion': potion,

    // sys actions
    'untarget': untarget,
    'confirm': confirm,
    'sendChat': sendChat,
    'cycleTarget': cycleTarget,
    'cycleTargetReverse': cycleTargetReverse,
    'targetEnemyFromEnemyList': targetEnemyFromEnemyList,
    'cycleTargetFromEnemyList': cycleTargetFromEnemyList,
    'cycleTargetFromEnemyListReverse': cycleTargetFromEnemyListReverse,

    // equip
    'equipHelmet': equipHelmet,
}

export default actionMap;
