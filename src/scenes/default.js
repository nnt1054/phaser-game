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

import arms from '../assets/arms.png';
import base_body from '../assets/base_body.png';
import ears from '../assets/ears.png';
import faces_demo from '../assets/faces_demo.png';
import haircuts from '../assets/haircuts.png';
import head_base from '../assets/head_base.png';
import legs_base from '../assets/legs_base.png';

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


class CompositeSprite extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)

        this.composition = {};
        this.config = {
            'hair_back': 'haircuts',
            'legs_base': 'legs_base',
            'arm_back': 'arm_back',
            'base_body': 'base_body',
            'arm_front': 'arm_front',
            'head_base': 'head_base',
            'ears': 'ears',
            'face': 'face',
            'hair_front': 'haircuts',
        }

        // create sprites
        Object.entries(this.config).forEach(([key, texture]) => {
            this.composition[key] = scene.add.sprite(0, 0, texture);
            this.add(this.composition[key]);
            this.composition[key].setOrigin(0.5, 1);
            scene.frameAnimator.add(this.composition[key]);
        })
    }

    play(anim, ignoreIfPlaying) {
        Object.entries(this.config).forEach(([key, texture]) => {
            const animKey = `${key}_${anim}`
            this.composition[key].anims.play(animKey, ignoreIfPlaying)
        })
    }
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

        this.character = new CompositeSprite(scene, 0, 0);
        this.character.setPosition(this.ref_x, this.ref_y + 1);
        this.character.setScale(0.1);

        this.composite.add([
            this.sprite,
        ])

        this.add([
            this.name,
            this.character,
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
                // anim = 'legs_base_walk';
                anim = 'run'
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
                this.character.scaleX = -Math.abs(this.character.scaleX);
            } else {
                this.setVelocityX(-140);
                // anim = 'legs_base_run';
                anim = 'run'
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
                this.character.scaleX = -Math.abs(this.character.scaleX);
            }
        } else if (this.cursors.right.isDown || this.cursors.rightArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(80);
                // anim = 'legs_base_walk';
                anim = 'run'
                this.composite.scaleX = Math.abs(this.composite.scaleX);
                this.character.scaleX = Math.abs(this.character.scaleX);
            } else {
                this.setVelocityX(140);
                // anim = 'legs_base_run';
                anim = 'run'
                this.composite.scaleX = Math.abs(this.composite.scaleX);
                this.character.scaleX = Math.abs(this.character.scaleX);
            }
        } else {
            this.setVelocityX(0);
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
            } else if (this.cursors.down.isDown) {
                // anim = 'legs_base_crouch';
                anim = 'idle'
                this.setVelocityX(0);
            }
        } else {
            // anim = 'legs_base_jump';
            anim = 'run'
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

        this.composite.sort('depth');

        if (!this.isAttacking) {
            // this.sprite.anims.play(anim, true);
            this.character.play(anim, true);
            // this.character.play('idle', true);
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
        this.load.spritesheet('legs_base', legs_base, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('arms', arms, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('base_body', base_body, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('head_base', head_base, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('ears', ears, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('haircuts', haircuts, {
            frameWidth: 512,
            frameHeight: 512,
        })
        this.load.spritesheet('face', faces_demo, {
            frameWidth: 512,
            frameHeight: 512,
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
                { key: 'idle', frame: 0, depth: 2 },
                { key: 'idle', frame: 0, depth: 2, translateY: 8 },
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
                    depth: 4,
                },
                {
                    key: 'lambseel',
                    frame: 3,
                    translateX: 16,
                    translateY: -32,
                    rotate: 12,
                    depth: 4,
                },
            ],
            frameRate: 8,
            repeat: -1,
        }

        let legsIdle = {
            key: 'legs_base_idle',
            frames: this.anims.generateFrameNumbers('legs_base', { start: 0, end: 0 }),
            frameRate: 8,
            repeat: -1,
        }
        let legsWalk = {
            key: 'legs_base_walk',
            frames: this.anims.generateFrameNumbers('legs_base', { start: 1, end: 4 }),
            frameRate: 8,
            repeat: -1,
        }
        let legsRun = {
            key: 'legs_base_run',
            frames: this.anims.generateFrameNumbers('legs_base', { start: 5, end: 8 }),
            frameRate: 8,
            repeat: -1,
        }
        let alternate = true;
        for (const frame of legsRun.frames) {
            frame.rotate = 12;
            if (alternate) {
                frame.translateY = -8;
            }
            alternate = !alternate;
        }

        let legsJump = {
            key: 'legs_base_jump',
            frames: this.anims.generateFrameNumbers('legs_base', { start: 9, end: 9 }),
            frameRate: 8,
            repeat: -1,
        }
        let legsCrouch = {
            key: 'legs_base_crouch',
            frames: this.anims.generateFrameNumbers('legs_base', { start: 10, end: 10 }),
            frameRate: 8,
            repeat: -1,
        }

        // idle
        let arm_front_idle = {
            key: 'arm_front_idle',
            frames: [ 
                { key: 'arms', frame: 0},
                { key: 'arms', frame: 0, translateY: 4},
            ],
            frameRate: 1
        };
        let base_body_idle = {
            key: 'base_body_idle',
            frames: [ 
                { key: 'base_body', frame: 0},
                { key: 'base_body', frame: 0, translateY: 4},
            ],
            frameRate: 1
        };
        let arm_back_idle = {
            key: 'arm_back_idle',
            frames: [ 
                { key: 'arms', frame: 1},
                { key: 'arms', frame: 1, translateY: 4},
            ],
            frameRate: 1
        };
        let head_base_idle = {
            key: 'head_base_idle',
            frames: [ 
                { key: 'head_base', frame: 0},
                { key: 'head_base', frame: 0, translateY: 4},
            ],
            frameRate: 1
        };
        let ears_idle = {
            key: 'ears_idle',
            frames: [ 
                { key: 'ears', frame: 0},
                { key: 'ears', frame: 0, translateY: 4},
            ],
            frameRate: 1
        };
        let hair_front_idle = {
            key: 'hair_front_idle',
            frames: [ 
                { key: 'haircuts', frame: 0},
                { key: 'haircuts', frame: 0, translateY: 4},
            ],
            frameRate: 1
        };
        let hair_back_idle = {
            key: 'hair_back_idle',
            frames: [ 
                { key: 'haircuts', frame: 1},
                { key: 'haircuts', frame: 1, translateY: 4},
            ],
            frameRate: 1
        };
        let face_idle = {
            key: 'face_idle',
            frames: [ 
                { key: 'face', frame: 0},
                { key: 'face', frame: 0, translateY: 4},
            ],
            frameRate: 1
        };


        let arm_front_run = {
            key: 'arm_front_run',
            frames: [ 
                { key: 'arms', frame: 0, rotate: 45, translateX: -112, translateY: -32},
            ],
            frameRate: 8
        };
        let base_body_run = {
            key: 'base_body_run',
            frames: [ 
                { key: 'base_body', frame: 0, rotate: 12},
                { key: 'base_body', frame: 0, rotate: 12, translateY: 4},
            ],
            frameRate: 8
        };
        let arm_back_run = {
            key: 'arm_back_run',
            frames: [ 
                { key: 'arms', frame: 1, rotate: 90, translateX: -169, translateY: -196},
            ],
            frameRate: 8
        };
        let head_base_run = {
            key: 'head_base_run',
            frames: [ 
                { key: 'head_base', frame: 0, rotate: 12},
                { key: 'head_base', frame: 0, rotate: 12, translateY: 4},
            ],
            frameRate: 8
        };
        let ears_run = {
            key: 'ears_run',
            frames: [ 
                { key: 'ears', frame: 0, rotate: 12},
                { key: 'ears', frame: 0, rotate: 12, translateY: 4},
            ],
            frameRate: 8
        };
        let hair_front_run = {
            key: 'hair_front_run',
            frames: [ 
                { key: 'haircuts', frame: 0, rotate: 12},
                { key: 'haircuts', frame: 0, rotate: 12, translateY: 4},
            ],
            frameRate: 8
        };
        let hair_back_run = {
            key: 'hair_back_run',
            frames: [ 
                { key: 'haircuts', frame: 1, rotate: 12},
                { key: 'haircuts', frame: 1, rotate: 12, translateY: 4},
            ],
            frameRate: 8
        };
        let face_run = {
            key: 'face_run',
            frames: [ 
                { key: 'face', frame: 0, rotate: 12},
                { key: 'face', frame: 0, rotate: 12, translateY: 4},
            ],
            frameRate: 8
        };

        let animationJSON = {
            anims: [
                idleConfig,
                walkConfig,
                runConfig,
                attackConfig,

                legsIdle,
                legsWalk,
                legsRun,
                legsJump,
                legsCrouch,

                arm_front_idle,
                base_body_idle,
                arm_back_idle,
                head_base_idle,
                ears_idle,
                hair_front_idle,
                hair_back_idle,
                face_idle,

                arm_front_run,
                base_body_run,
                arm_back_run,
                head_base_run,
                ears_run,
                hair_front_run,
                hair_back_run,
                face_run,
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
