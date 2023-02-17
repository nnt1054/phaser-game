import {
    ArcadeContainer,
    CompositeSprite,
} from './utils'

import actionMap from './actions';

// redux imports
import store from '../store/store';
import {
    clearInputQueues,
    clearQueuedAbility,
    setCooldowns,
    setGCD,
    setCast,
    clearSystemAction,
} from '../store/playerState';
import {
    incrementHealth,
    setPlayerCurrentHealth
} from '../store/playerHealth';
import {
    setTarget,
    removeTarget,
    setTargetCurrentHealth,
    setCotarget,
    removeCotarget,
    setCotargetCurrentHealth,
} from '../store/targetInfo';
import {
    addItemCount,
    subractItemCount,
    updateEquipment,
} from '../store/inventory';
import {
    clearDialogue,
} from '../store/dialogueBox';
import {
    updatePreview
} from '../store/characterPreview';
import {
    HealthMixin,
    TargetMixin,
} from './mixins';
import {
    setAlert,
} from '../store/alert';
import {
    updateEnemyList,
} from '../store/enemyList';

import helmets from './equipment/helmets';
import armors from './equipment/armors';

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}


const regenBuff = (target) => {
    return {
        target: target,
        timer: 12000,
        tickTimer: 3000,
        apply() {
            this.target.increaseHealth(10);
        },
        unapply() {},
        update(delta) {
            this.tickTimer -= delta;
            if (this.tickTimer <= 0) {
                this.tickTimer += 3000;
                this.target.increaseHealth(10);
            }
        },
    }
}

const TARGET_CONSTANTS = {
    CURRENT_TARGET: 'CURRENT_TARGET',
}

const compositeConfig = {
    'hair_back': 'hair',
    'legs': 'legs',
    'pants': 'pants',
    'arm_back': 'arm_back',
    'armor_body_back_sleeve': 'armor_body_back_sleeve',
    'torso': 'torso',
    'armor_body': 'armor_body',
    'arm_front': 'arm_front',
    'armor_body_front_sleeve': 'armor_body_front_sleeve',
    'armor_body_collar': 'armor_body_collar',
    'head': 'head',
    'ears': 'ears',
    'face': 'face',
    'headband': 'headband',
    'hair_front': 'hair',
};

const compositeConfigIndexes = {
    'hair_back': 1,
    'legs': 1,
    'pants': 1,
    'arm_back': 1,
    'armor_body_back_sleeve': 1,
    'torso': 1,
    'armor_body': 1,
    'arm_front': 1,
    'armor_body_front_sleeve': 1,
    'armor_body_collar': 1,
    'head': 1,
    'ears': 1,
    'face': 0,
    'headband': 1,
    'hair_front': 1,
};


const EquipmentMixin = {

    equipped: {
        weapon: null,
        helmet: null,
        armor: null,
        pants: null,
    },

    equipHelmet: function(item) {
        this.equipped.helmet = item;
        this.updateCharacterSprite(item);
        this.updateEquipmentStore();
    },

    equipArmor: function(item) {
        this.equipped.armor = item;
        this.updateCharacterSprite(item);
        this.updateEquipmentStore();
    },

    updateCharacterSprite: function(item) {
        if (item) {
            this.character.updateIndexes(item.sprites);
        } else {
            Object.entries(this.equipped).forEach(([key, item]) => {
                if (item) this.character.updateIndexes(item.sprites);
            });
        }
        this.updateCharacterPreview();
    },

    updateEquipmentStore: function() {
        store.dispatch(updateEquipment({
            weapon: this.equipped.weapon?.name,
            helmet: this.equipped.helmet?.name,
            armor: this.equipped.armor?.name,
            pants: this.equipped.pants?.name,
        }))
    },

    updateCharacterPreview: function() {
        store.dispatch(updatePreview(this.character.indexes));
    },

}

const InventoryMixin = {

    inventory: new Map(),

    addItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key) || 0;
        const newItemCount = itemCount + amount;
        this.inventory.set(key, newItemCount);

        store.dispatch(addItemCount({
            name: key,
            value: newItemCount - itemCount,
        }))
    },

    removeItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key);
        const newItemCount = Math.max(0, itemCount - amount);
        this.inventory.set(key, newItemCount);

        store.dispatch(subractItemCount({
            name: key,
            value: itemCount - newItemCount,
        }))
    },

    hasItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key);
        if (itemCount && itemCount >= amount) {
            return true;
        } else {
            return false;
        }
    },
}


const EnemyListMixin = {

    hasEnemyList: true,
    enemyList: [],
    enemyAggroMap: new Map(),

    addToEnemyList: function(enemy, aggro) {
        if (!this.enemyList.includes(enemy)) {
            this.enemyList.push(enemy);
            this.enemyAggroMap.set(enemy, aggro);
            this.updateEnemyListStore();
        }
    },

    removeEnemyFromEnemyList: function(enemy) {
        this.enemyList = this.enemyList.filter(item => !Object.is(item, enemy));
        this.updateEnemyListStore();
    },

    updateEnemyListStore: function() {
        const newState = this.enemyList.map(enemy => {
            return {
                name: enemy.displayName,
                isTarget: Object.is(enemy, this.currentTarget),
            }
        })
        store.dispatch(updateEnemyList(newState));
    },

    targetEnemyFromEnemyList: function(index) {
        const enemy = this.enemyList[index]
        if (!enemy) return;

        this.targetObject(enemy);
        this.updateEnemyListStore();
    },

    cycleTargetFromEnemyList: function(isReverse=false) {
        if (this.enemyList.length === 0) return;

        let index;
        if (this.currentTarget) {

            const prevIndex = this.enemyList.findIndex(
                enemy => Object.is(enemy, this.currentTarget)
            );

            if (isReverse) {
                index = prevIndex - 1
            } else {
                index = prevIndex + 1
            }

            if (index >= this.enemyList.length) {
                index = 0;
            } else if (index < 0) {
                index = this.enemyList.length - 1
            }

        } else {
            index = 0;
        }

        const enemy = this.enemyList[index];
        if (!enemy) return;

        this.targetObject(enemy);
        this.updateEnemyListStore();
    },
}


class CooldownManager {
    constructor() {
        this._cooldowns = new Map();
        this.cooldown_updater = setInterval(this.updateStore.bind(this), 50);
    }

    getTimer(key) {
        return this._cooldowns.get(key) || [0, 0];
    }

    startTimer(key, time) {
        this._cooldowns.set(key, [time, time]);
    }

    update(delta) {
        for (var [key, value] of this._cooldowns.entries()) {
            this._cooldowns.set(key, [Math.max(0, value[0] - delta), value[1]]);
        }
    }

    updateStore() {
        store.dispatch(
            setCooldowns(
                Object.fromEntries(this._cooldowns)
            )
        );
    }
}


export class Player extends ArcadeContainer {

    mixins = [
        HealthMixin,
        TargetMixin,
        EquipmentMixin,
        InventoryMixin,
        EnemyListMixin,
    ]

    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.isPlayer = true;
        this.setCurrentHealth(50);

        this.setSize(20, 48);
        this.setMaxVelocity(800);
        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.displayName = 'Player 1';

        this.name = scene.add.text(
            this.ref_x,
            this.ref_y,
            this.displayName,
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '16px',
                fill: '#FFF',
                stroke: '#000',
                strokeThickness: 8,
            }
        );
        this.name.setOrigin(0.5, 0);
        this.name.setInteractive();
        this.name.on('clicked', (object) => {
            this.handleClick();
        });

        this.character = new CompositeSprite(
            scene,
            this.ref_x,
            this.ref_y + 1.5,
            compositeConfig,
            compositeConfigIndexes
        );

        let hitboxPadding = { width: 24, height: 42 };
        this.hitboxRect = scene.add.rectangle(
            0, 0, hitboxPadding.width, hitboxPadding.height,
        );
        this.hitboxRect.setOrigin(0.5, 1);
        this.hitboxRect.setPosition(this.ref_x + 0, this.ref_y);

        let meleePadding = { width: 128, height: 86 };
        this.meleeRect = scene.add.rectangle(
            0, 0, meleePadding.width, meleePadding.height,
        );
        this.meleeRect.setOrigin(0.5, 1);
        this.meleeRect.setPosition(this.ref_x + 0, this.ref_y + 24);

        let rangedPadding = { width: 1028, height: 256 }
        this.rangedRect = scene.add.rectangle(
            0, 0, rangedPadding.width, rangedPadding.height,
        )
        this.rangedRect.setOrigin(0.5, 0.5);
        this.rangedRect.setPosition(this.ref_x + 0, 0);

        let clickPadding = { width: 32, height: 64 };
        this.clickRect = scene.add.rectangle(
            0, 0, clickPadding.width, clickPadding.height,
        );
        this.clickRect.setOrigin(0.5, 1);
        this.clickRect.setPosition(this.ref_x + 0, this.ref_y);
        this.clickRect.setInteractive();
        this.clickRect.on('clicked', (object) => {
            this.handleClick();
        });

        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0x000000, 0.6);
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.strokeRoundedRect(-128 + 30, -64, 256, 64, 8);
        this.graphics.fillRoundedRect(-128 + 30, -64, 256, 64, 8);

        this.currentMessage = ''
        this.messageTimer = 0;
        this.chatBubble = scene.add.dom(0, 0,
            'div',
            '',
            this.currentMessage,
        );
        this.chatBubble.setClassName('chat-bubble-hidden');
        this.chatBubble.setOrigin(0.5, 1);
        this.chatBubble.setPosition(this.ref_x + 0, -8);

        this.add([
            this.chatBubble,
            // this.graphics,
            this.name,
            // this.message,
            this.character,
            this.clickRect,
            this.hitboxRect,
            this.meleeRect,
            this.rangedRect,
        ]);

        this.platformColliders = [];
        this.setGravityY(1600);

        // Input
        this.gcdQueue = null;
        this.gcdTarget = null;
        this.gcdTimer = 0;
        this.abilityTimer = 0;
        this.systemAction = null;
        this.systemActionTarget = null;
        this.casting = null;
        this.castTarget = null;
        this.castingTimer = 0;
        this.directionLockTimer = 0;

        this.reduxCursors = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        }
        const getPlayerState = state => state.playerState;
        this.observer = observeStore(store, getPlayerState, (playerState) => {
            if (playerState.queuedAbility) {
                this.queueAbility(
                    playerState.queuedAbility,
                    playerState.queuedTarget,
                );
                store.dispatch(clearQueuedAbility());
            }

            if (playerState.systemAction) {
                this.queueSystemAction(
                    playerState.systemAction,
                    playerState.systemActionTarget,
                );
                store.dispatch(clearSystemAction());
            }

            this.reduxCursors = {
                up: playerState.up,
                down: playerState.down,
                left: playerState.left,
                right: playerState.right,
                jump: playerState.jump,
            }
        });

        // Movement
        this.coyoteTime = 0;
        this.jumpUsed = true;
        this.facingRight = true;
        this.current_anim = null;
        this.previousVelocityY = 0;

        // TODO: move cooldowns to mixin
        this.cooldownManager = new CooldownManager();

        // Dialogue
        this.dialogueTarget = null;
        this.dialogueComplete = true;
        this.dialogueOption = null;
        const getDialogueComplete = state => state.dialogueBox;
        this.dialogueObserver = observeStore(store, getDialogueComplete, (dialogueState) => {
            if (dialogueState.complete) {
                this.dialogueComplete = dialogueState.complete;
                this.dialogueOption = dialogueState.currentOption;
            }
        });

        this.addItem('potion', 3);
        this.addItem('halo', 1);
        this.addItem('foxears', 1);

        const ears = helmets[1];
        this.equipHelmet(ears);

        // move to mixin later
        this.buffs = [];
        this.applyBuff(regenBuff);

        // Animation Editor
        this.paused = false;
        this.currentFrame = 0;
        const getFrameIndex = state => state.aniEditor;
        this.animationObserver = observeStore(store, getFrameIndex, (animState) => {
            if (animState.frameIndex != this.currentFrame) {
                this.currentFrame = animState.frameIndex;
                this.queueAbility(`frame${animState.frameIndex}`);
            }
            this.character.setActiveCompositeStates(animState.compositeStates);
        })

        this.updateCharacterPreview();
    }

    setWidth(width) {
        // TODO: find way to keep all container children centered after increasing width
        // this.setSize(width, 48);
        // this.ref_x = this.body.width / 2;
        // this.character.setPosition(
        //     this.ref_x,
        //     this.ref_y + 1.5,
        // );
    }

    handleClick() {
        this.targetObject(this);
    }

    queueSystemAction(actionName, target) {
        if (!actionName) return;
        const action = actionMap[actionName];
        if (!action) return;
        if (this.systemAction) return;
        this.systemAction = action;
        this.systemActionTarget = target;
    }

    queueAbility(abilityName, target) {
        if (!abilityName) return;
        const ability = actionMap[abilityName];
        if (!ability) return;

        if (this.gcdQueue) return;
        if (ability.gcd && this.gcdTimer > 500) return;
        if (this.casting && this.castingTimer > 500) return;

        let targetObject;
        if (this.currentTarget && ability.canTarget(this, this.currentTarget)) {
            targetObject = this.currentTarget;
        } else if (ability.canTarget(this, this)) {
            targetObject = this;
        } else if (ability.canTarget(this, null)) {
            targetObject = null;
        } else if (this.currentTarget == null) {
            const isReverse = !this.facingRight;
            this.cycleTargets(isReverse);
            if (this.currentTarget == null) {
                store.dispatch(setAlert('Invalid Target.'));
            }
        } else {
            store.dispatch(setAlert('Invalid Target.'));
            return;
        }

        if (ability.canExecute(this, targetObject)) {
            this.gcdQueue = ability;
            this.gcdTarget = targetObject;
        } else {
            return;
        }
    }

    startCast(ability, target) {
        this.casting = ability;
        this.castTarget = target;
        this.castingTimer = ability.castTime;
        store.dispatch(setCast({
            key: ability.name,
            duration: ability.castTime,
        }));
    }

    cancelCast() {
        this.casting = null;
        this.castTarget = null;
        this.castingTimer = 0;
        this.directionLockTimer = 0;
        store.dispatch(setCast({
            key: '',
            duration: 0,
        }));

        this.gcdTimer = 0
        store.dispatch(setGCD(0));
    }

    isMoving() {
        return Boolean(this.body.velocity.y || this.body.velocity.x);
    }

    updateMovement(delta) {
        // horizontal position changes
        if (this.reduxCursors.left) {
            if (this.reduxCursors.down) {
                this.setVelocityX(-75);
            } else {
                this.setVelocityX(-150);
            }
            if (this.directionLockTimer <= 0) {
                this.facingRight = false;
            }
            this.setWidth(32);
        } else if (this.reduxCursors.right) {
            if (this.reduxCursors.down) {
                this.setVelocityX(75);
            } else {
                this.setVelocityX(150);
            }
            if (this.directionLockTimer <= 0) {
                this.facingRight = true;
            }
            this.setWidth(32);
        } else {
            this.setVelocityX(0);
            this.setWidth(20);
        }

        if (this.body.onFloor()) {
            this.coyoteTime = 0;
            this.jumpUsed = false;
            if (this.reduxCursors.down && this.reduxCursors.jump) {
                this.executeDownJump();
            } else if (this.reduxCursors.jump) {
                this.executeJump();
            }
        } else {
            if (this.reduxCursors.jump && this.coyoteTime < 240 && !this.jumpUsed) {
                this.executeJump();
            }
            this.coyoteTime += delta;
        }
        this.previousVelocityY = this.body.velocity.y;

        if (this.body.velocity.y > 0) {
            this.setGravityY(800);
        } else {
            this.setGravityY(1600);
        }

        const moving = (this.body.velocity.y || this.body.velocity.x)
        if (moving && this.casting && this.castingTimer > 750) {
            this.cancelCast();
        }
    }

    executeDownJump() {
        this.jumpUsed = true;
        this.platformColliders.forEach(collider => {
            collider.active = false;
            this.time.addEvent({
                delay: 250,
                callback: () => {collider.active = true},
                callbackScope: this, 
            })
        })
    }

    executeJump() {
        this.jumpUsed = true;
        this.setVelocityY(-480);
    }

    calculateAnimationState() {
        let anim = this.current_anim ?? 'idle';
        if (this.casting) anim = 'crouch';

        const speedX = Math.abs(this.body.velocity.x);
        if (speedX > 100) {
            anim = 'run';
        } else if (speedX > 0) {
            anim = 'walk';
        }
        if (!this.body.onFloor() || this.reduxCursors.jump) {
            if (this.body.velocity.x && this.body.velocity.y > 90) {
                anim = 'jump';
            } else if (this.body.velocity.x == 0) {
                anim = 'jumpIdle';
            }
        }
        if (this.body.onFloor() && this.reduxCursors.down && this.body.velocity.x == 0) {
            anim = 'crouch';
            this.current_anim = null;
        }

        if (this.facingRight) {
            this.character.scaleX = Math.abs(this.character.scaleX);
        } else {
            this.character.scaleX = -Math.abs(this.character.scaleX);
        }

        if (anim !== this.current_anim) this.current_anim = null;
        return anim;
    }

    updateAbilityState(delta) {
        const previousGCD = this.gcdTimer;
        this.gcdTimer = Math.max(0, this.gcdTimer - delta);
        this.abilityTimer = Math.max(0, this.abilityTimer - delta);
        if (previousGCD && this.gcdTimer == 0) {
            store.dispatch(setGCD(0));
        }
        const ability = this.gcdQueue;
        if (ability && this.abilityTimer == 0 && this.castingTimer == 0) {
            if (ability.gcd) {
                if (this.gcdTimer == 0) {
                    // if (!(ability.canExecute && !ability.canExecute(this, this.gcdTarget))) {
                    if (ability.canExecute(this, this.gcdTarget)) {
                        this.faceTarget(this.gcdTarget);
                        if (ability.castTime) {
                            this.startCast(ability, this.gcdTarget);
                            this.directionLockTimer += ability.castTime;
                        } else {
                            ability.execute(this, this.gcdTarget);
                            this.abilityTimer += 500;
                            this.directionLockTimer += 500;
                        }
                        this.gcdTimer += ability.cooldown;
                        store.dispatch(setGCD(ability.cooldown));
                        this.cooldownManager.updateStore();
                    } 
                    this.gcdQueue = null;
                    this.gcdTarget = null;
                }
            } else {
                if (!(ability.canExecute && !ability.canExecute(this, this.gcdTarget))) {
                    this.faceTarget(this.gcdTarget);
                    ability.execute(this, this.gcdTarget);
                    this.abilityTimer += 750;
                    this.directionLockTimer += 500;
                    this.cooldownManager.updateStore();
                }
                this.gcdQueue = null;
                this.gcdTarget = null;
            }
        }
    }

    updateCast(delta) {
        this.castingTimer = Math.max(0, this.castingTimer - delta);
        if (this.casting && this.castingTimer === 0) {
            const ability = this.casting;
            this.faceTarget(this.castTarget);
            ability.execute(this, this.castTarget);
            this.abilityTimer += 500;
            this.directionLockTimer += 500;
            this.cooldownManager.updateStore();
            this.casting = null;
            this.castTarget = null;
            store.dispatch(setCast({
                key: '',
                duration: 0,
            }));
        }
    }

    updateSystemAction(delta) {
        if (this.systemAction) {
            this.systemAction.execute(this, this.systemActionTarget);
            this.systemAction = null;
            this.systemActionTarget = null;
        }
    }

    applyBuff(buffClass) {
        const buff = buffClass(this);
        buff.apply();
        this.buffs.push(buff);
    }

    updateBuffs(delta) {
        for (const buff of this.buffs) {
            buff.timer = Math.max(0, buff.timer - delta);
            if (buff.timer <= 0) {
                buff.unapply(this);
            }
        };

        this.buffs = this.buffs.filter((buff) => buff.timer > 0);

        for (const buff of this.buffs) {
            buff.update(delta);
        };
    }


    update(time, delta) {

        // test fall damage
        if (this.body.onFloor() && this.previousVelocityY >= 800) {
            this.setCurrentHealth(1);
        }

        this.directionLockTimer = Math.max(0, this.directionLockTimer - delta);

        if (this.dialogueTarget) {
            if (!this.dialogueTarget.isPlayerInRange(this)) {
                this.dialogueTarget.endDialogue(this);
            } else if (this.dialogueComplete) {
                this.dialogueTarget.completeDialogue(this, this.dialogueOption);
            }
        }

        this.updateBuffs(delta);
        this.updateMovement(delta);
        this.updateCast(delta);
        this.updateAbilityState(delta);
        this.updateSystemAction(delta);
        this.updateMessageTimer(delta);
        const anim = this.calculateAnimationState();
        if (!this.paused) {
            this.character.play(anim, true);
        }

        this.cooldownManager.update(delta);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
        this.graphics.setScale(1 / zoom);
        this.chatBubble.setScale(1 / zoom);
    }

    updateMessageTimer(delta) {
        if (this.messageTimer) {
            this.messageTimer = Math.max(0, this.messageTimer - delta);
            if (this.messageTimer <= 0) {
                this.currentMessage = '';
                this.chatBubble.setText('');
                this.chatBubble.setClassName('chat-bubble-hidden');
            }
        }
    }

    displayMessage(text) {
        this.chatBubble.setText(`${ this.displayName }: ${ text }`);
        this.chatBubble.setClassName('chat-bubble');
        this.messageTimer = 3000;
    }

    doEmote(emote) {
        this.current_anim = emote;
        this.character.play(emote);
    }

    addItem(name, count) {
        const currentCount = this.inventory.get(name) || 0;
        this.inventory.set(name, currentCount + count);
        store.dispatch(addItemCount({
            name: name,
            value: count,
        }))
    }

    targetObject(gameObject) {
        if (gameObject.isTargetable) {
            if (this.currentTarget) this.currentTarget.untarget();
            this.currentTarget = gameObject;
            gameObject.target();

            if ('health' in gameObject) {
                store.dispatch(
                    setTarget({
                        targetName: gameObject.displayName,
                        currentHealth: gameObject.health,
                        maxHealth: gameObject.maxHealth,
                    })
                )

                const cotarget = gameObject.currentTarget;
                if (cotarget && 'health' in cotarget) {
                    store.dispatch(
                        setCotarget({
                            targetName: cotarget.displayName,
                            currentHealth: cotarget.health,
                            maxHealth: cotarget.maxHealth,
                        })
                    )
                }
            }
        }
    }

    untargetObject(gameObject) {
        if (this.currentTarget) this.currentTarget.untarget();
        this.currentTarget = null;
        store.dispatch(
            removeTarget()
        )
    }

    faceTarget(gameObject) {
        if (gameObject) {
            const playerX = this.clickRect.getBounds().centerX;
            const targetX = gameObject.clickRect.getBounds().centerX;
            if (playerX < targetX) {
                this.facingRight = true;
            } else if (targetX < playerX) {
                this.facingRight = false;
            }
        }
    }

    cycleTargets(isReverse=false) {
        const camera = this.scene.cameras.main;
        const targets = [];
        for (const target of this.availableTargets) {
            if (
                Phaser.Geom.Rectangle.Overlaps(camera.worldView, target.getBounds())
                && target.visible
            ) {
                targets.push(target);
            }
        };

        const playerX = this.body.center.x;
        let currentX = this.currentTarget ? this.currentTarget.clickRect.getBounds().centerX : playerX;
        if (this.facingRight) {
            currentX = Math.max(playerX, currentX);
        } else {
            currentX = Math.min(playerX, currentX);
        }

        let furthestTarget = null;
        let closestTarget = null;
        let nextTarget = null;

        if (this.facingRight) {
            for (const target of targets) {
                const targetX = target.clickRect.getBounds().centerX;
                if (isReverse) {
                    if (playerX < targetX && targetX < currentX) {
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (targetX > nextTarget.clickRect.getBounds().centerX) {
                            nextTarget = target;
                        }
                    }
                } else {
                    if (currentX < targetX) {
                        // check if target is to the right of currentTarget
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (targetX < nextTarget.clickRect.getBounds().centerX) {
                            nextTarget = target;
                        }
                    }
                }

                if (playerX < targetX) {
                    if (!closestTarget) {
                        closestTarget = target;
                    } else if (targetX < closestTarget.clickRect.getBounds().centerX) {
                        closestTarget = target;
                    }

                    if (!furthestTarget) {
                        furthestTarget = target;
                    } else if (targetX > furthestTarget.clickRect.getBounds().centerX) {
                        furthestTarget = target;
                    }
                }
            }
        } else {
            for (const target of targets) {
                const targetX = target.clickRect.getBounds().centerX;
                if (isReverse) {
                    if (currentX < targetX && targetX < playerX) {
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (targetX < nextTarget.clickRect.getBounds().centerX) {
                            nextTarget = target;
                        }
                    }
                } else {
                    if (targetX < currentX) {
                        // check if target is to the right of currentTarget
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (nextTarget.clickRect.getBounds().centerX < targetX) {
                            // check if target is closer to the currentTarget than current next potential target
                            nextTarget = target;
                        }
                    }
                }

               if (targetX < playerX) {
                    if (!closestTarget) {
                        closestTarget = target;
                    } else if (closestTarget.clickRect.getBounds().centerX < targetX) {
                        closestTarget = target;
                    }

                    if (!furthestTarget) {
                        furthestTarget = target;
                    } else if (targetX < furthestTarget.clickRect.getBounds().centerX) {
                        furthestTarget = target;
                    }
                }
            }
        }

        if (nextTarget && nextTarget != this.currentTarget) {
            this.targetObject(nextTarget);
        } else if (isReverse && furthestTarget && furthestTarget != this.currentTarget) {
            this.targetObject(furthestTarget);
        } else if (!isReverse && closestTarget && closestTarget != this.currentTarget) {
            this.targetObject(closestTarget);
        }
    }

}
