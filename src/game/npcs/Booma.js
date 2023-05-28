import {
    ArcadeContainer,
    ArcadeRectangle,
    CompositeSprite,
} from '../utils';

import {
    HealthMixin,
    TargetMixin,
    AggroMixin,
    BuffMixin,
    CastingMixin,
    CooldownMixin,
    CombatMixin,
} from '../mixins';

import store from '../../store/store';
import {
    setDialogue,
    clearDialogue,
} from '../../store/dialogueBox';

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
    'temp': {
        name: 'temp',
        cooldown: 12000,
        castTime: 3000,
        canCast: (caster, target) => {
            const [cooldown, duration] = caster.getCooldown('temp');
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
            caster.startCooldown('temp', 12000)
        },
        cancelCast: (caster, target) => {
            if (caster.telegraphRectTween) caster.telegraphRectTween.stop()
            caster.telegraphRect.width = 0;
            caster.telegraphRect.updateDisplayOrigin();
            caster.startCooldown('temp', 0)
        },
        execute: (caster, target) => {
            let player = caster.scene.player;
            const bounds = caster.telegraphRect.getBounds();
            const playerBounds = player.hitboxRect.getBounds();
            const inRange = Phaser.Geom.Rectangle.Overlaps(
                bounds,
                playerBounds
            );
            if (inRange) {
                player.reduceHealth(30, 250);
            }

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
            target.reduceHealth(5);
            caster.startCooldown('autoAttack', 1000);
        }
    }
}

export class Booma extends ArcadeContainer {

    mixins = [
        TargetMixin,
        HealthMixin,
        AggroMixin,
        BuffMixin,
        CastingMixin,
        CooldownMixin,
        CombatMixin,
    ]

    constructor(scene, x, y, displayName='Non-Player') {
        super(scene, x, y);
        this.initialPosition = [x, y];

        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })
        this.initializeCooldowns();

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.isEnemy = true;
        this.displayName = displayName;

        this.setSize(32, 48);
        let width = 32;
        let height = 48;
        this.ref_x = width / 2;
        this.ref_y = height;

        this.setGravityY(1600);

        this.name = scene.add.text(0, 0, this.displayName, {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8,
        });
        this.name.setOrigin(0.5, 1);
        this.name.setPosition(this.ref_x + 0, this.ref_y - height);
        this.name.setInteractive();
        this.name.on('clicked', (object) => {
            this.handleClick();
        });

        this.character = new CompositeSprite(
            scene,
            this.ref_x,
            this.ref_y + 1,
            compositeConfig,
            compositeConfigIndexes
        );
        this.character.setScale(0.1);
        this.character.scaleX = -Math.abs(this.character.scaleX);

        // loop animation
        this.character.play('floss', false);
        this.character.on('animationcomplete', () => {
            this.character.play('floss', false);
        })

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
        const player = this.scene.player;
        this.scene.player.targetObject(this);
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
        
        player.addItem('potion', 1);
        player.removeEnemyFromEnemyList(this);

        this.isDead = true;
        this.respawnTimer = 8000;
    }

    update(time, delta) {
        if (this.isDead) {
            this.respawnTimer = Math.max(0, this.respawnTimer - delta);
            if (this.respawnTimer <= 0) {
                this.setPosition(...this.initialPosition);
                this.setCurrentHealth(100);
                this.visible = true;
                this.isDead = false;
            }
            return;
        }

        this.updateCooldowns(delta);
        this.updateCast(delta);
        this.updateBuffs(delta);

        const isIdle = !this.casting
        if (isIdle) {
            if (this.highestAggro && !this.currentTarget) {
                this.targetObject(this.highestAggro);
            } else if (this.highestAggro && this.currentTarget && this.currentTarget != this.highestAggro) {
                this.targetObject(this.highestAggro);
            }

            if (this.currentTarget) {
                const tempAbility = abilities['temp'];
                const autoAttackAbility = abilities['autoAttack'];
                if (this.canCast(tempAbility, this.currentTarget)) {

                    // start explosion cast
                    this.startCast(tempAbility);
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
                    } else if (distance < -32) {
                        this.setVelocityX(64);
                        this.character.scaleX = Math.abs(this.character.scaleX);
                    } else {
                        this.setVelocityX(0);   
                    }

                }
            }
        }
    }
}
