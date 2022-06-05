import Phaser from 'phaser';

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles,
    FBFupdateFrames,
    FBFupdateFramesFromJSON,
    createTiledMap,
} from '../game/utils.js'

import jumpquest_map from '../assets/tilemaps/jq_map.json';
import jumpquest_bg from '../assets/jq.png';
import kugane_bg from '../assets/kugane.jpg';
import lambseel from '../assets/lambseel.png';
import lambseel_idle from '../assets/lambseel_idle.png';


class ArcadeContainer extends Phaser.GameObjects.Container {

    mixins = [
        Phaser.Physics.Arcade.Components.Acceleration,
        Phaser.Physics.Arcade.Components.Angular,
        Phaser.Physics.Arcade.Components.Bounce,
        Phaser.Physics.Arcade.Components.Debug,
        Phaser.Physics.Arcade.Components.Drag,
        Phaser.Physics.Arcade.Components.Enable,
        Phaser.Physics.Arcade.Components.Friction,
        Phaser.Physics.Arcade.Components.Gravity,
        Phaser.Physics.Arcade.Components.Immovable,
        Phaser.Physics.Arcade.Components.Mass,
        Phaser.Physics.Arcade.Components.Pushable,
        Phaser.Physics.Arcade.Components.Size,
        Phaser.Physics.Arcade.Components.Velocity
    ]

    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })
        this.body = null;

        this.cursors = scene.cursors
        this.time = scene.time
        this.physics = scene.physics
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
        scene.plugins.get('fbfplugin').add(this.sprite);

        this.composite.add([
            this.sprite
        ])

        this.add([
            this.name,
            this.composite,
        ]);

        this.platformColliders = [];
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

    update () {
        if (this.cursors.left.isDown || this.cursors.leftArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(-80);
                this.sprite.anims.play('walk', true);
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
            } else {
                this.setVelocityX(-140);
                this.sprite.anims.play('run', true);
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
            }
        } else if (this.cursors.right.isDown || this.cursors.rightArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(80);
                this.sprite.anims.play('walk', true);
                this.composite.scaleX = Math.abs(this.composite.scaleX);
            } else {
                this.setVelocityX(140);
                this.sprite.anims.play('run', true);
                this.composite.scaleX = Math.abs(this.composite.scaleX);
            }
        } else {
            this.setVelocityX(0);
            this.sprite.anims.play('idle', true);
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
    }

    autoZoomCamera(zoom) {
        this.name.setScale(1 / zoom);
    }
}

class StaticSprite extends Phaser.Physics.Arcade.Sprite {

    setCollisionFromTileData(index, map, layer) {
        this.scene.physics.add.existing(this, true);
        let tileset = map.getTileset(layer);
        let collisionGroup = tileset.getTileCollisionGroup(index);
        for (var i = 0; i < collisionGroup.objects.length; i++) {
            let collisionObject = collisionGroup.objects[i];
            this.setBodySize(collisionObject.width, collisionObject.height);
            this.setOffset(collisionObject.x, collisionObject.y);
        }
    };

}

class Spike extends StaticSprite {};

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
    }

    create () {
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

        // exmaple snippet for applying unique properties based on object type
        // const spikes = this.map.createFromObjects('spikes', {
        //     gid: 71,
        //     classType: Spike,
        //     key: 'tile_spritesheet',
        //     frame: 70,
        // });
        // spikes.forEach(spike => {
        //     spike.setCollisionFromTileData(71, this.map, 'nature_tileset');
        // });

        let idleConfig = {
            key: 'idle',
            frames: [ 
                { key: 'idle', frame: 0 },
                { key: 'idle', frame: 0, translateY: 8 },
            ],
            frameRate: 1.5
        };

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
            ]
        }
        this.anims.fromJSON(animationJSON);
        FBFupdateFramesFromJSON(this.anims, animationJSON);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            tab: Phaser.Input.Keyboard.KeyCodes.TAB,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
            downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
            leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
            rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });

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
    }

    update (time, delta) {
        this.player.update(time, delta);
        this.autoZoomCamera();
    }

    autoZoomCamera() {
        let zoomY = this.game.canvas.height / this.map.heightInPixels;
        let zoomX = this.game.canvas.width / this.map.widthInPixels;
        let zoom = Math.max(zoomX, zoomY, 1)
        this.cameras.main.setZoom(zoom);
        this.player.autoZoomCamera(zoom);
    }

}


export default defaultScene;
