import {
    ArcadeContainer,
    ArcadeRectangle,
    CompositeSprite,
} from './utils';

import {
    HealthMixin,
    TargetMixin,
    BuffMixin,
    AggroMixin,
    CastingMixin,
    CooldownMixin,
    LevelMixin,
    ExperienceMixin,
    BaseStatsMixin,
    CombatMixin,
    MovementController,
    CharacterSpriteMixin,
    DisplayNameMixin,
    AnimationController,
} from './mixins';

import { BASE_STATS } from '../constants';

import store from '../store/store';

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
    'headband': 'headband',
    'hair_front': 'hair',
};

const compositeConfigIndexes = {
    'hair_back': 1,
    'legs': 1,
    'pants': 1,
    'arm_back': 1,
    'armor_body_back_sleeve': 2,
    'torso': 1,
    'armor_body': 2,
    'arm_front': 1,
    'armor_body_front_sleeve': 2,
    'armor_body_collar': 2,
    'head': 1,
    'ears': 1,
    'headband': 3,
    'hair_front': 1,
};

const abilities = {
    'attack': {
        name: 'attack',
        cooldown: 12000,
        castTime: 3000,
        canCast: (caster, target) => {
            const [cooldown, duration] = caster.getCooldown('attack');
            if (cooldown > 0) {
                return false
            }

            const bounds = caster.meleeRect.getBounds();
            const targetBounds = target.hitboxRect.getBounds();
            const inRange = Phaser.Geom.Rectangle.Overlaps(
                bounds,
                targetBounds
            )
            const distance = Math.abs(bounds.centerX - targetBounds.centerX);
            if ( inRange || distance < 32 ) {
                return true;
            }
            return false;
        },
        startCast: (caster, target) => {
            caster.telegraphRectTween = caster.scene.tweens.add({
                targets: [ caster.telegraphRect ],
                width: 256,
                duration: 1000,
                ease: 'Sine.easeIn',
                onUpdate: (tween, rect) => {
                    rect.updateDisplayOrigin();
                }
            });
            caster.startCooldown('attack', 12000)
        },
        cancelCast: (caster, target) => {
            if (caster.telegraphRectTween) caster.telegraphRectTween.stop()
            caster.telegraphRect.width = 0;
            caster.telegraphRect.updateDisplayOrigin();
            caster.startCooldown('attack', 0)
        },
        execute: (caster, target) => {
            const bounds = caster.telegraphRect.getBounds();
            for (const player of caster.scene.playerGroup.children.entries) {
                const playerBounds = player.hitboxRect.getBounds();
                if (
                    Phaser.Geom.Rectangle.Overlaps(bounds, playerBounds)
                ) {
                    caster.dealDamage(player, 10, 'physical');
                }
            };
            caster.telegraphRectTween = null;
            caster.telegraphRect.width = 0;
            caster.telegraphRect.updateDisplayOrigin();

            let vfx = caster.scene.add.sprite(
                bounds.centerX,
                bounds.centerY + 10,
            );
            vfx.scaleX = 3;
            vfx.setDepth(1000);
            vfx.play('explosion');
            vfx.on('animationcomplete', () => {
                vfx.destroy();
            });
        },
    },
    'autoAttack': {
        canCast: (caster, target) => {
            const [cooldown, duration] = caster.getCooldown('autoAttack');
            if (cooldown > 0) {
                return false
            }
            const bounds = caster.meleeRect.getBounds();
            const targetBounds = target.hitboxRect.getBounds();
            const inRange = Phaser.Geom.Rectangle.Overlaps(
                bounds,
                targetBounds
            )
            const distance = Math.abs(bounds.centerX - targetBounds.centerX);
            if ( inRange ) {
                return true;
            }
            return false;
        },
        execute: (caster, target) => {
            caster.dealDamage(target, 1, 'physical', 500);
            caster.startCooldown('autoAttack', 1000);
        }
    }
}


export class Enemy extends ArcadeContainer {

    mixins = [
        TargetMixin,
        HealthMixin,
        AggroMixin,
        BuffMixin,
        CastingMixin,
        CooldownMixin,
        CombatMixin,
        BaseStatsMixin,
        LevelMixin,
        MovementController,
        CharacterSpriteMixin,
        DisplayNameMixin,
        AnimationController,
    ]

    constructor(id, scene, x, y, config, displayName='Non-Player') {
        super(scene, x, y);
        this.initialPosition = [x, y];

        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

        this.id = id;

        this.state = {
            x: x,
            y: y,
            width: 32,
            height: 48,
            displayName: displayName,
            currentAnim: 'floss',
            character: {
                config: config.character.config,
                indexes: config.character.indexes,
            },
        }

        this.initializeAggroMixin();
        this.initializeBuffMixin();
        this.initializeCooldowns();

        this.setLevel(1);
        this.setCurrentHealth(this.maxHealth);

        this.isEnemy = true;
        this.displayName = displayName;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(32, 48);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(800);
        this.setGravityY(1600);

        let width = 32;
        let height = 48;
        this.ref_x = width / 2;
        this.ref_y = height;

        this.initializeDisplayName()
        this.initializeCompositeSprite();

        this.initializeTargetMixin();

        this.hitboxRect = new ArcadeRectangle(scene, this.ref_x, this.ref_y, 32, 42);
        this.hitboxRect.setOrigin(0.5, 1);

        this.meleeRect = scene.add.rectangle(0, 0, 128, 86);
        this.meleeRect.setOrigin(0.5, 1);
        this.meleeRect.setPosition(this.ref_x + 0, this.ref_y + 24);

        this.telegraphRectTween = null;
        this.telegraphRect = {}
        let telegraphPadding = { width: 0, height: 86 };
        this.telegraphRect = scene.add.rectangle(
            0, 0, telegraphPadding.width, telegraphPadding.height,
            '0xFFA500', 0.2,
        );
        this.telegraphRect.setPosition(this.ref_x + 0, this.ref_y);
        this.telegraphRect.setOrigin(0.5, 1);

        this.add([
            this.telegraphRect,
            this.name,
            this.character,
            this.clickRect,
            this.hitboxRect,
            this.meleeRect,
        ]);

        this.respawnTimer = 0;
        this.isDead = false;
    }

    handleClick() {
        const clientPlayer = this.scene.clientPlayer;
        clientPlayer.targetObject(this);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }

    handleDeath() {
        const player = this.scene.player;
        this.visible = false;
        if (this.isTargeted) {
            player.untargetObject();
        }
        this.resetAggro();
        this.cancelCast();
        this.untargetObject();
        this.clearBuffs();
        this.setVelocityX(0);

        const exp = Math.ceil(BASE_STATS.at(this.currentLevel) * 5);
        this.setLevel(Math.min(this.currentLevel + 1, 30));

        player.addItem('potion', 1);
        player.removeEnemyFromEnemyList(this);
        player.gainExperience(exp);

        this.isDead = true;
        this.respawnTimer = 8000;
    }

    update(time, delta) {
        if (this.isDead) {
            this.respawnTimer = Math.max(0, this.respawnTimer - delta);
            if (this.respawnTimer <= 0) {
                this.setPosition(...this.initialPosition);
                this.setCurrentHealth(this.maxHealth);
                this.visible = true;
                this.isDead = false;
            }
            return;
        }

        this.updateCooldowns(delta);
        this.updateCast(delta);
        this.updateBuffs(delta);
        this.updateAnimationState();

        const isIdle = !this.casting
        if (isIdle) {
            if (this.highestAggro && !this.currentTarget) {
                this.targetObject(this.highestAggro);
            } else if (this.highestAggro && this.currentTarget && this.currentTarget != this.highestAggro) {
                this.targetObject(this.highestAggro);
            }

            if (this.currentTarget) {
                const attackAbility = abilities['attack'];
                const autoAttackAbility = abilities['autoAttack'];
                if (this.canCast(attackAbility, this.currentTarget)) {

                    // start explosion cast
                    this.startCast(attackAbility);
                    this.setVelocityX(0);

                } else if (this.canCast(autoAttackAbility, this.currentTarget)) {

                    // execute auto attack
                    autoAttackAbility.execute(this, this.currentTarget);

                } else {

                    // move towards target
                    const bounds = this.meleeRect.getBounds();
                    const targetBounds = this.currentTarget.hitboxRect.getBounds();
                    const distance = bounds.centerX - targetBounds.centerX;

                    if (distance > 32) {
                        this.setVelocityX(-64);
                        this.character.scaleX = -Math.abs(this.character.scaleX);
                        this.setCharacterDirection(false);
                    } else if (distance < -32) {
                        this.setVelocityX(64);
                        this.character.scaleX = Math.abs(this.character.scaleX);
                        this.setCharacterDirection(true);
                    } else {
                        this.setVelocityX(0);   
                    }

                }
            }
        }
    }
}
