import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles,
    createTiledMap,
    ArcadeContainer,
} from '../game/utils'

import jumpquest_map from '../assets/tilemaps/jq_map.json';
import jumpquest_bg from '../assets/jq.png';
import kugane_bg from '../assets/kugane.jpg';
import lambseel from '../assets/lambseel.png';
import lambseel_idle from '../assets/lambseel_idle.png';
import lambseel_attack from '../assets/attack.png';


import {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
    setPlayerMaxHealth,
    setPlayerHealth,   
} from '~/src/store/playerHealth';

import {
    clearQueuedAbility,
} from '~/src/store/playerState';

import store from '~/src/store/store';

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

const basicAbility = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 2500,
    execute: (player) => {
        store.dispatch(incrementHealth());
    },
}

const basicAttack = {
    type: 'Ability || Weaponskill || Spell || Emote || Macro || Minion || Mount || etc',
    charges: -1,
    cost: -1,
    cooldown: 1000,
    execute: (player) => {
        player.isAttacking = true;
        player.sprite.anims.play('attack', false);
        player.sprite.on('animationcomplete', () => {
            player.isAttacking = false;
        });
    },
}

const abilityMap = {
    'attack': basicAttack,
    'heal': basicAbility,
}

class Player extends ArcadeContainer {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(32, 48);
        this.setMaxVelocity(800);
        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.name = scene.add.text(0, 0, 'Lamb Seel', {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8,
        });
        this.name.setOrigin(0.5, 1);
        this.name.setPosition(this.ref_x + 0, this.ref_y - this.body.height);
        this.name.setScale(0.3);

        this.composite = scene.add.container(0, 0);
        this.composite.setPosition(this.ref_x, this.ref_y + 1);
        this.composite.setScale(0.1);

        this.sprite = scene.add.sprite(0, 0, 'lambseel');
        this.sprite.setOrigin(0.5, 1);
        scene.frameAnimator.add(this.sprite);

        this.composite.add([
            this.sprite
        ])

        this.add([
            this.name,
            this.composite,
        ]);

        this.platformColliders = [];

        this.gcdQueue = null;
        this.gcdTimer = 0;

        this.isAttacking = false;
    }

    addPlatforms(platforms) {
        platforms.forEach(platform => {
            let collider =  this.physics.add.collider(this, platform);
            this.platformColliders.push(collider)
        })
    }

    addCollision(objects) {
        objects.forEach(object => {
            this.physics.add.collider(this, object);
        })
    }

    queueAbility(ability) {
        if (this.gcdQueue) return;
        if (this.gcdTimer > 1000) return;
        this.gcdQueue = ability;
    }

    update (time, delta) {
        let anim = 'idle';
        if (this.cursors.left.isDown || this.cursors.leftArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(-80);
                anim = 'walk';
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
            } else {
                this.setVelocityX(-140);
                anim = 'run';
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
            }
        } else if (this.cursors.right.isDown || this.cursors.rightArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(80);
                anim = 'walk';
                this.composite.scaleX = Math.abs(this.composite.scaleX);
            } else {
                this.setVelocityX(140);
                anim = 'run';
                this.composite.scaleX = Math.abs(this.composite.scaleX);
            }
        } else {
            this.setVelocityX(0);
        }
        if (!this.isAttacking) {
            this.sprite.anims.play(anim, true);
        }

        if (this.body.onFloor()) {
            this.setGravityY(1600);
            if (this.cursors.down.isDown && this.cursors.space.isDown) {
                this.setVelocityY(-30);
                this.platformColliders.forEach(collider => {
                    collider.active = false;
                    this.time.addEvent({
                        delay: 250,
                        callback: () => {collider.active = true},
                        callbackScope: this, 
                    })
                })
            } else if (this.cursors.space.isDown) {
                this.setVelocityY(-480);
            }
        } else {
            if (this.body.velocity.y >= 0) {
                this.setGravityY(800);
            }
        }

        if (this.gcdTimer > 0) {
            this.gcdTimer = Math.max(0, this.gcdTimer - delta)
        }

        if (this.gcdQueue && this.gcdTimer == 0) {
            const ability = this.gcdQueue;
            ability.execute(this);
            this.gcdTimer += ability.cooldown;
            this.gcdQueue = null;
        }
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }
}


class defaultScene extends Phaser.Scene {

    preload () {
        this.load.image('jumpquest_bg', jumpquest_bg);
        this.load.image('kugane_bg', kugane_bg);
        this.load.tilemapTiledJSON('jumpquest_map', jumpquest_map);

        this.load.spritesheet('idle', lambseel_idle, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('lambseel', lambseel, {
            frameWidth: 512,
            frameHeight: 512,
            spacing: 1,
        })
        this.load.spritesheet('attack', lambseel_attack, {
            frameWidth: 512,
            frameHeight: 512,
            spacing: 1,
        })
    }

    create () {
        this.frameAnimator = this.plugins.get('frameAnimator');
        this.map = createTiledMap(this, 'jumpquest_map');
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 300);

        const layer2 = this.map.createLayer("platforms");
        layer2.setVisible(false);
        setLayerCollisionTopOnly(layer2.layer, [8, 9, 10, 16, 20, 24, 25, 31, 26]);

        const layer1 = this.map.createLayer("ground");
        layer1.setVisible(false);
        layer1.setCollision([2, 12]);

        const background = this.add.image(0, this.map.heightInPixels, 'kugane_bg');
        background.displayHeight = this.map.heightInPixels;
        background.setOrigin(0, 1);

        const map_bg = this.add.image(0, this.map.heightInPixels, 'jumpquest_bg');
        map_bg.setOrigin(0, 1)

        let idleConfig = {
            key: 'idle',
            frames: [ 
                { key: 'idle', frame: 0 },
                { key: 'idle', frame: 0, translateY: 8 },
            ],
            frameRate: 1.5
        };

        let attackConfig = {
            key: 'attack',
            frames: this.anims.generateFrameNumbers('attack', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0,
        }

        let walkConfig = {
            key: 'walk',
            frames: this.anims.generateFrameNumbers('lambseel', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1,
        }

        let runConfig = {
            key: 'run',
            frames: [
                {
                    key: 'lambseel',
                    frame: 0,
                    translateX: 0,
                    translateY: 0,
                    rotate: 8,
                },
                {
                    key: 'lambseel',
                    frame: 1,
                    translateX: 16,
                    translateY: -32,
                    rotate: 12,
                },
                {
                    key: 'lambseel',
                    frame: 2,
                    translateX: 0,
                    translateY: 0,
                    rotate: 8,
                },
                {
                    key: 'lambseel',
                    frame: 3,
                    translateX: 16,
                    translateY: -32,
                    rotate: 12,
                },
            ],
            frameRate: 8,
            repeat: -1,
        }

        let animationJSON = {
            anims: [
                idleConfig,
                walkConfig,
                runConfig,
                attackConfig,
            ]
        }
        this.anims.fromJSON(animationJSON);
        this.frameAnimator.frameAnimatorUpdateFramesFromJSON(this.anims, animationJSON);

        // only need cursors for modifiers (can you bind a key to a modifier?)
        this.cursors = this.input.keyboard.addKeys({
            up: KeyCodes.W,
            down: KeyCodes.S,
            left: KeyCodes.A,
            right: KeyCodes.D,
            upArrow: KeyCodes.UP,
            downArrow: KeyCodes.DOWN,
            leftArrow: KeyCodes.LEFT,
            rightArrow: KeyCodes.RIGHT,

            space: KeyCodes.SPACE,
            tab: KeyCodes.TAB,
            shift: KeyCodes.SHIFT,
            control: KeyCodes.CTRL,
            alt: KeyCodes.ALT,
        });

        this.input.keyboard.on('keydown', (event) => {
            const hotbarSlot = this.keyMap[event.keyCode];
            if (!hotbarSlot) return;
            const ability = this.hotbarMap[hotbarSlot];
            if (!ability) return;
            this.player.queueAbility(ability);
        });

        const getQueuedAbility = state => state.playerState.queuedAbility;
        const unsubscribe = observeStore(store, getQueuedAbility, (abilityName) => {
            if (!abilityName) return;
            const ability = abilityMap[abilityName];
            if (!ability) return;
            this.player.queueAbility(ability);
            store.dispatch(clearQueuedAbility());
        });

        this.keyMap = {
            [KeyCodes.Q]: 1,
            [KeyCodes.E]: 2,
            [KeyCodes.ENTER]: 1,
        };

        this.hotbarMap = {
            1: basicAttack,
            2: basicAbility,
        }

        this.player = new Player(this, 80, 1800);
        this.player.setCollideWorldBounds(true);

        this.player.addPlatforms([layer2]);
        this.player.addCollision([layer1]);
        // this.player.addCollision([layer1, spikes]);

        this.cameras.main.startFollow(this.player, false, 1, 1);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.scale.on(Phaser.Scale.Events.RESIZE, () => {
            this.autoZoomCamera();
        });

        this.zoom = 1;
        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.zoom -= deltaY * 0.001;
            this.autoZoomCamera();
        });

        this.autoZoomCamera();
    }

    update (time, delta) {
        this.player.update(time, delta);
    }

    autoZoomCamera() {
        let zoomY = this.game.canvas.height / this.map.heightInPixels;
        let zoomX = this.game.canvas.width / this.map.widthInPixels;
        this.zoom = Math.max(this.zoom, zoomX, zoomY, 1);
        this.zoom = Math.min(this.zoom, 6)
        this.cameras.main.setZoom(this.zoom);
        this.player.autoZoom(this.zoom);
    }

}


export default defaultScene;
