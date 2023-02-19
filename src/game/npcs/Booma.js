import {
    ArcadeContainer,
    CompositeSprite,
} from '../utils';

import {
    HealthMixin,
    TargetMixin,
    AggroMixin,
    BuffMixin,
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


export class Booma extends ArcadeContainer {

    mixins = [
        TargetMixin,
        HealthMixin,
        AggroMixin,
        BuffMixin,
        CastingMixin,
    ]

    abilities = {
        'temp': {
            name: 'temp',
            cooldown: 12000,
            castTime: 3000,
            canExecute: (target) => { return true },
            startCast: (target) => {
                let tween = this.scene.tweens.add({
                    targets: [ this.telegraphRect ],
                    width: 256,
                    duration: 1000,
                    ease: 'Sine.easeIn',
                    onUpdate: (tween, target) => {
                        target.updateDisplayOrigin();
                    }
                });
            },
            execute: (target) => {
                let player = this.scene.player;
                const bounds = this.telegraphRect.getBounds();
                const playerBounds = player.hitboxRect.getBounds();
                const inRange = Phaser.Geom.Rectangle.Overlaps(
                    bounds,
                    playerBounds
                );
                if (inRange) {
                    player.reduceHealth(30, 250);
                }
                this.telegraphRect.width = 0;
                this.telegraphRect.updateDisplayOrigin();

                let vfx = this.scene.add.sprite(
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
        }
    }

    constructor(scene, x, y, displayName='Non-Player') {
        super(scene, x, y);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

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
        // this.setVelocityX(-160);

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

        let hitboxRect = { width: 24, height: 48 };
        this.hitboxRect = scene.add.rectangle(
            0, 0,
            this.width + hitboxRect.width, this.height + hitboxRect.height,
        );
        this.hitboxRect.setOrigin(0.5, 1);
        this.hitboxRect.setPosition(this.ref_x + 0, this.ref_y);

        let meleePadding = { width: 128, height: 86 };
        this.meleeRect = scene.add.rectangle(
            0, 0, meleePadding.width, meleePadding.height,
        );
        this.meleeRect.setOrigin(0.5, 1);
        this.meleeRect.setPosition(this.ref_x + 0, this.ref_y + 24);

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

        this.autoAttackTimer = 0;

        this.casting = null;
        this.castTarget = null;
        this.castingTimer = 0;

        this.cooldown = 3000;
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

        player.removeEnemyFromEnemyList(this);
    }

    updateAutoAttack(target, delta) {
        if (this.autoAttackTimer <= 0) {
            target.reduceHealth(5);
            this.autoAttackTimer = 1000;
        } else {
            this.autoAttackTimer -= delta;
        }
    }

    startCast(ability, target) {
        this.casting = ability;
        this.castTarget = target;
        this.castingTimer = ability.castTime;
        ability.startCast(this, target);
        this.cooldown = ability.cooldown;
    }

    updateCast(delta) {
        this.castingTimer = Math.max(0, this.castingTimer - delta);
        if (this.casting && this.castingTimer === 0) {
            const ability = this.casting;
            ability.execute(this, this.castTarget);
            this.casting = null;
            this.castTarget = null;
        }
    }

    cancelCast() {
        this.casting = null;
        this.castTarget = null;
        this.castingTimer = 0;
    }

    update(time, delta) {
        if (this.casting) {
            this.updateCast(delta);
            return;
        }

        if (this.hasBuffs) {
            this.updateBuffs(delta);
        }

        if (this.highestAggro) {
            if (this.currentTarget == null || this.currentTarget != this.highestAggro) {
                this.targetObject(this.highestAggro);
            }
        }

        if (this.currentTarget) {
            this.cooldown = Math.max(0, this.cooldown - delta);
            const bounds = this.meleeRect.getBounds();
            const targetBounds = this.currentTarget.hitboxRect.getBounds();
            const inRange = Phaser.Geom.Rectangle.Overlaps(
                bounds,
                targetBounds
            )
            const distance = Math.abs(bounds.centerX - targetBounds.centerX);
            if (inRange) {
                if (this.cooldown <= 0) {
                    this.startCast(this.abilities['temp'])
                }
                this.updateAutoAttack(this.currentTarget, delta);
                this.setVelocityX(0);
            } else if (distance <= 32) {
                if (this.cooldown <= 0) {
                    this.startCast(this.abilities['temp'])
                    this.setVelocityX(0);
                };
            } else {
                if (bounds.centerX < targetBounds.centerX) {
                    this.setVelocityX(64);
                    this.character.scaleX = Math.abs(this.character.scaleX);
                } else {
                    this.setVelocityX(-64);
                    this.character.scaleX = -Math.abs(this.character.scaleX);
                }
            }
        }
    }
}
