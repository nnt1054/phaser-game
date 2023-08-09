import {
    ArcadeContainer,
    ArcadeRectangle,
    CompositeSprite,
} from './utils'

import {
    systemActionMap,
    itemActionMap,
} from './actions';

import store from '../store/store';
import {
    setGCD,
    setComboAction,
} from '../store/playerState';
import {
    setTarget,
    removeTarget,
    setCotarget,
    setTargetCast,
    cancelTargetCast,
} from '../store/targetInfo';
import {
    HealthMixin,
    TargetMixin,
    BuffMixin,
    EquipmentMixin,
    InventoryMixin,
    EnemyListMixin,
    CastingMixin,
    CooldownMixin,
    CombatMixin,
    ExperienceMixin,
    BaseStatsMixin,
    LevelMixin,
    JobMixin,
} from './mixins';
import {
    setAlert,
} from '../store/alert';

import helmets from './equipment/helmets';
import armors from './equipment/armors';

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


export class Player extends ArcadeContainer {

    mixins = [
        HealthMixin,
        TargetMixin,
        EquipmentMixin,
        InventoryMixin,
        EnemyListMixin,
        BuffMixin,
        CastingMixin,
        CooldownMixin,
        CombatMixin,
        ExperienceMixin,
        BaseStatsMixin,
        LevelMixin,
        JobMixin,
    ]

    constructor(scene, x, y, config, isClientPlayer) {
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

        super(scene, x, y);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })
        this.initializeEnemyListMixin();
        this.initializeBuffMixin();

        this.isPlayer = true;
        this.isClientPlayer = isClientPlayer;

        // physics setup
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(20, 48);
        this.setDepth(100);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(800);
        this.setGravityY(1600);

        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.displayName = config.displayName;

        this.ladderHitbox = new ArcadeRectangle(scene, 0, 0, 20, 36);
        this.ladderHitbox.setOrigin(0.5, 1);
        this.ladderHitbox.setPosition(this.ref_x, this.ref_y);

        this.hitboxRect = new ArcadeRectangle(scene, this.ref_x, this.ref_y, 24, 42);
        this.hitboxRect.setOrigin(0.5, 1);

        this.rangeChecker = scene.add.rectangle();

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
            config.spriteConfig,
        );

        this.clickRect = scene.add.rectangle(0, 0, 32, 64,);
        this.clickRect.setOrigin(0.5, 1);
        this.clickRect.setPosition(this.ref_x, this.ref_y);
        this.clickRect.setInteractive();
        this.clickRect.on('clicked', (object) => {
            this.handleClick();
        });

        this.currentMessage = ''
        this.messageTimer;
        this.chatBubble = scene.add.dom(0, 0,
            'div',
            '',
            this.currentMessage,
        );
        this.chatBubble.setClassName('chat-bubble-hidden');
        this.chatBubble.setOrigin(0.5, 1);
        this.chatBubble.setPosition(this.ref_x + 0, -8);

        this.healthBarWidth = 32;
        this.healthBar = scene.add.rectangle(0, 0, 32, 4, 0x00ff00);
        this.healthBar.setOrigin(0.5, 1);
        this.healthBar.setPosition(this.ref_x, 0);

        this.healthBarUnderlay = scene.add.rectangle(0, 0, 33, 5, 0x000000);
        this.healthBarUnderlay.setOrigin(0.5, 1);
        this.healthBarUnderlay.setPosition(this.ref_x, 0.5);

        this.add([
            this.chatBubble,
            this.name,
            this.character,
            this.clickRect,
            this.hitboxRect,
            this.ladderHitbox,
            this.rangeChecker,
            this.healthBarUnderlay,
            this.healthBar,
        ]);

        // Input
        this.gcdQueue = null;
        this.gcdTarget = null;
        this.gcdTimer = 0;
        this.abilityTimer = 0;
        this.systemAction = null;
        this.systemActionTarget = null;

        this.directionLockTimer = 0;

        this.reduxCursors = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            jump: 0,
        }
        this.observer = null;

        // Movement
        this.coyoteTime = 0;
        this.jumpUsed = true;
        this.facingRight = true;
        this.current_anim = null;
        this.previousVelocityY = 0;

        // Dialogue
        this.dialogueTarget = null;
        this.dialogueComplete = true;
        this.dialogueOption = null;

        this.initializeCooldowns();
        this.setExperience(0);

        const { inventory, equipment } = config;
        for (let item in inventory) {
            this.addItem(item, inventory[item])
        }
        this.equipHelmet(equipment.helmet);
        this.setJob(this.equipped.helmet.job);

        this.isClimbing = false;
        this.climbingDisabled = false;
        this.climbing = null;

        this.overlappingLadders = [];
        this.previousOverlappingLadders = [];

        this.isDashing = false;
        this.dashTween = null;

        // remove me after raycast testing
        this.walls = []

        this.comboAction = null;
        this.comboActionTimer = 0;

        this.addPlatforms();
        this.addLadders();

        this.setCurrentHealth(50);

        // Animation Editor
        this.paused = false;
        this.currentFrame = 0;
    }

    setInput(input) {
        this.reduxCursors = {
            up: input.up,
            down: input.down,
            left: input.left,
            right: input.right,
            jump: input.jump,
        }

        if (input.queuedAbility) {
            this.queueAbility(
                input.queuedAbility,
                input.queuedTarget,
            );
        }

        if (input.systemAction) {
            this.queueSystemAction(
                input.systemAction,
                input.systemActionTarget,
            );
        }
    }

    setDialogueInput(input) {
        this.dialogueComplete = input.dialogueComplete;
        this.dialogueOption = input.dialogueOption;
    }

    setAnimState(animState) {
        if (animState.frameIndex != null && animState.frameIndex != this.currentFrame) {
            this.currentFrame = animState.frameIndex;
            this.queueAbility(`frame${animState.frameIndex}`);
        }
        this.character.setActiveCompositeStates(animState.compositeStates);
    }

    handleClick() {
        const clientPlayer = this.scene.clientPlayer;
        clientPlayer.targetObject(this);
    }

    isTargetInRange(targetRect, x, y, width, height, originX, originY) {
        this.rangeChecker.setPosition(x, y);
        this.rangeChecker.setSize(width, height);
        this.rangeChecker.setOrigin(originX, originY);

        const inRange = Phaser.Geom.Rectangle.Overlaps(
            this.rangeChecker.getBounds(),
            targetRect.getBounds(),
        )

        this.rangeChecker.setPosition(0, 0);
        this.rangeChecker.setSize(0, 0);
        this.rangeChecker.setOrigin(0, 0);

        return inRange;
    }

    update(time, delta) {

        // test fall damage
        if (this.body.onFloor() && this.previousVelocityY >= 800) {
            this.setCurrentHealth(1);
        }

        this.comboActionTimer = Math.max(0, this.comboActionTimer - delta);
        if (this.comboAction && this.comboActionTimer <= 0) {
            this.setPlayerComboAction('');
        }

        this.updateDialogue(delta);
        this.updateMovement(delta);
        this.updateCooldowns(delta);
        this.updateBuffs(delta);
        this.updateCast(delta);
        this.updateAbilityState(delta);
        this.updateSystemAction(delta);
        this.updateAnimationState(delta);

        this.clearLadders();

        this.enemyList = [];
    }

    queueSystemAction(actionName, target) {
        if (!actionName) return;
        const action = systemActionMap[actionName];
        if (!action) return;
        if (this.systemAction) return;
        this.systemAction = action;
        this.systemActionTarget = target;
    }

    queueAbility(abilityName, target) {
        if (!abilityName) return;

        let ability;
        if (abilityName in this.currentJob.abilities) {
            ability = this.currentJob.abilities[abilityName];
        } else if (abilityName in itemActionMap) {
            ability = itemActionMap[abilityName];
        };

        if (!ability) {
            if (this.isClientPlayer) {
                store.dispatch(setAlert('Invalid Action.'));
            }
            return;
        }

        // todo: do we still need this?
        // override
        if (ability.override) {
            const abilityNameOverride = ability.override(this);
            if (abilityNameOverride) {
                abilityName = abilityNameOverride;
                ability = this.currentJob.abilities[abilityName];
            }
        };

        if (!ability) {
            if (this.isClientPlayer) {
                store.dispatch(setAlert('Invalid Action.'));
            }
            return;
        }

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
                if (this.isClientPlayer) {
                    store.dispatch(setAlert('Invalid Target.'));
                }
            }
            return;
        } else {
            if (this.isClientPlayer) {
                store.dispatch(setAlert('Invalid Target.'));
            }
            return;
        }

        if (ability.canExecute(this, targetObject)) {
            this.gcdQueue = ability;
            this.gcdTarget = targetObject;
        } else {
            return;
        }
    }

    isMoving() {
        return Boolean(this.body.velocity.y || this.body.velocity.x);
    }

    addPlatforms(platforms) {
        this.platformColliders = this.physics.add.collider(this, this.scene.platformGroup);
    }

    disablePlatformColliders(duration) {
        this.platformColliders.active = false;
        this.time.addEvent({
            delay: duration,
            callback: () => { this.platformColliders.active = true },
            callbackScope: this, 
        }) 
    }

    addLadders() {
        this.physics.add.overlap(this.ladderHitbox, this.scene.climbableGroup, (hitbox, ladder) => {
            this.overlappingLadders.push(ladder);
        });
    }

    clearLadders() {
        this.previousOverlappingLadders = this.overlappingLadders;
        this.overlappingLadders = [];
    }

    startClimbing(ladder) {
        this.isClimbing = true;
        this.climbing = ladder;
        this.setVelocityX(0);
        this.setGravityY(0);
        if (this.casting) {
            this.cancelCast();
        }
        this.disablePlatformColliders(250);
    }

    stopClimbing() {
        this.isClimbing = false;
        this.climbing = null;
        this.setGravityY(1600)
    }

    updateMovement(delta) {

        // ladder/climbing movement
        if (this.isClimbing) {
            const ladder = this.climbing;
            const inRange = this.overlappingLadders.find(x => x == ladder);
            if (!inRange) {
                this.stopClimbing(ladder);
            } else {
                this.x = this.climbing.body.center.x - (this.body.width / 2);
            }
        } else {
            if (this.reduxCursors.up) {
                const ladder = this.overlappingLadders.find(x => !!x);
                if (ladder) {
                    if (!this.climbingDisabled) {
                        this.startClimbing(ladder);
                    }
                }
            } else if (this.reduxCursors.down) {
                const ladder = this.overlappingLadders.find(x => !!x);
                if (ladder) {
                    if (!this.climbingDisabled) {
                        this.startClimbing(ladder);
                    }
                }
            }
        }


        if (this.isClimbing) {
            if (this.reduxCursors.up) {
                this.setVelocityY(-150)
            } else if (this.reduxCursors.down) {
                this.setVelocityY(150)
                if (this.body.onFloor()) {
                    this.stopClimbing();
                }
            } else {
                this.setVelocityY(0)
            }

            if (this.reduxCursors.jump) {
                this.executeJump();
            }
            return;
        }


        this.directionLockTimer = Math.max(0, this.directionLockTimer - delta);

        if (this.body.blocked.left || this.body.blocked.right) {
            this.stopDash();
        }

        if (this.reduxCursors.left) {
            if (this.reduxCursors.down) {
                this.setVelocityX(-75);
            } else {
                this.setVelocityX(-150);
            }
            if (this.directionLockTimer <= 0) {
                this.facingRight = false;
            }
        } else if (this.reduxCursors.right) {
            if (this.reduxCursors.down) {
                this.setVelocityX(75);
            } else {
                this.setVelocityX(150);
            }
            if (this.directionLockTimer <= 0) {
                this.facingRight = true;
            }
        } else {
            this.setVelocityX(0);
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

        if (this.reduxCursors.down) {
            this.ladderHitbox.setY(this.ref_y + 4);
        } else {
            this.ladderHitbox.setY(this.ref_y);
        }

        const moving = (this.body.velocity.y || this.body.velocity.x)
        if (moving && this.casting && this.castingTimer > 750) {
            this.cancelCast();
        }
    }

    executeDownJump() {
        this.jumpUsed = true;
        this.disablePlatformColliders(250);
    }

    executeJump() {
        this.jumpUsed = true;

        if (this.isClimbing) {
            this.stopClimbing();
            this.climbingDisabled = true;
            this.time.addEvent({
                delay: 480,
                callback: () => {this.climbingDisabled = false},
                callbackScope: this, 
            })
            this.setVelocityY(-360);
        } else {
            this.setVelocityY(-480);
        }
    }

    updateAnimationState(delta) {
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

        if (this.isClimbing) {
            anim = 'crouch';
        }

        if (this.facingRight) {
            this.character.scaleX = Math.abs(this.character.scaleX);
        } else {
            this.character.scaleX = -Math.abs(this.character.scaleX);
        }

        if (anim !== this.current_anim) this.current_anim = null;

        if (!this.paused) {
            this.character.play(anim, true);
        }
    }

    updateAbilityState(delta) {
        const previousGcdTimer = this.gcdTimer;
        this.gcdTimer = Math.max(0, this.gcdTimer - delta);
        this.abilityTimer = Math.max(0, this.abilityTimer - delta);
        if (previousGcdTimer && this.gcdTimer == 0) {
            if (this.isClientPlayer) {
                store.dispatch(setGCD(0));
            }
        }

        // check if can execute
        const ability = this.gcdQueue;
        if (!ability) return;
        if (this.abilityTimer > 0) return;
        if (this.castingTimer > 0) return;
        if (ability.gcd && this.gcdTimer > 0) return;

        if (ability.canExecute(this, this.gcdTarget)) {
            const gcdCooldown = this.calculateGcdCooldown(ability);
            const castTime = this.calculateCastTime(ability);

            // ability execution
            if (castTime > 0) {
                this.startCast(ability, this.gcdTarget);
                this.directionLockTimer += ability.castTime;
            } else {
                this.executeAbility(ability, this.gcdTarget);
            }

            if (ability.gcd) {
                this.gcdTimer += gcdCooldown;
                if (this.isClientPlayer) {
                    store.dispatch(setGCD(gcdCooldown));
                }
            }
        }

        this.gcdQueue = null;
        this.gcdTarget = null;
    }

    setPlayerComboAction(actionName) {
        this.comboAction = actionName;
        this.comboActionTimer = 15000;
        if (this.isClientPlayer) {
            store.dispatch(setComboAction(this.comboAction));
        }
    }

    updateSystemAction(delta) {
        if (this.systemAction) {
            this.systemAction.execute(this, this.systemActionTarget);
            this.systemAction = null;
            this.systemActionTarget = null;
        }
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
        this.chatBubble.setScale(1 / zoom);
    }

    updateDialogue(delta) {
        if (this.dialogueTarget) {
            if (!this.dialogueTarget.isPlayerInRange(this)) {
                this.dialogueTarget.endDialogue(this);
            } else if (this.dialogueComplete) {
                this.dialogueTarget.completeDialogue(this, this.dialogueOption);
            }
        }
    }

    clearMessage() {
        this.currentMessage = '';
        this.chatBubble.setText('');
        this.chatBubble.setClassName('chat-bubble-hidden');
        this.messageTimer = null;
    }

    displayMessage(text) {
        this.chatBubble.setText(`${ this.displayName }: ${ text }`);
        this.chatBubble.setClassName('chat-bubble');
        if (this.messageTimer) {
            this.messageTimer.remove()
        }
        this.messageTimer = this.time.addEvent({
            delay: 3000,
            callback: () => { this.clearMessage(); },
            callbackScope: this, 
        })
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

    dash(targetPosition, duration) {
        let position = targetPosition;
        let dashingRight = position > this.body.x;
        let distance = position - this.body.x;

        let rectX = dashingRight ? this.body.x + this.body.width : this.body.x;
        let rect = this.scene.add.rectangle(
            rectX, this.body.y,
            distance, this.body.height, 0xff0000, 0.5,
        );
        rect.setOrigin(0, 0);
        for (const wall of this.walls) {
            if (
                Phaser.Geom.Rectangle.Overlaps(rect.getBounds(), wall.getBounds())
            ) {
                if (dashingRight) {
                    position = Math.min(position, wall.getBounds().left - this.body.width)
                } else {
                    position = Math.max(position, wall.getBounds().right)
                }
            }
        };
        rect.destroy();
        let newDistance = position - this.body.x;
        let newDuration = Math.abs((newDistance / distance) * duration);

        this.isDashing = true;
        this.dashTween = this.scene.tweens.add({
            targets: [ this ],
            x: position,
            duration: newDuration,
            ease: 'Sine.easeIn',
        });
        return this.dashTween;
    }

    stopDash() {
        this.isDashing = false;
        if (this.dashTween) this.dashTween.stop();
        this.dashTween = null;
    }

    calculateCastTime(ability) {
        let castTime = ability.castTime || 0;
        for (const buff of this._buffs) {
            if (buff.modifyCastTime) {
                castTime = buff.modifyCastTime(castTime, buff);
            }
        };
        return Math.max(0, castTime);
    }

    calculateGcdCooldown(ability) {
        let gcdCooldown = ability.cooldown || 0;
        if (ability.overrideCooldown) {
            gcdCooldown = ability.overrideCooldown(this);
        }
        for (const buff of this._buffs) {
            if (buff.modifyGcdCooldown) {
                gcdCooldown = buff.modifyGcdCooldown(gcdCooldown, buff);
            }
        };
        return Math.max(0, gcdCooldown);
    }

    isPartyMember(target) {
        // todo later
        return true;
    }
}
