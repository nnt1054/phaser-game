import Phaser from 'phaser';

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles
} from '../game/utils.js'

import dude from '../assets/dude.png';
import woods from '../assets/woods_background.jpg';
import example_tiles  from '../assets/tilesets/example.png';
import adventure_map from '../assets/tilemaps/adventure_map.json';

var player;
var stars;
var platforms;
var score = 0;
var scoreText;


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

        // convenience vars
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

        this.name = scene.add.text(0, 0, 'Lamb Seel', {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8,
        });
        this.name.setOrigin(0.5, 0);
        this.name.setPosition(this.body.width / 2, -this.name.displayHeight);

        this.sprite = scene.add.sprite(0, 0, 'dude');
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setPosition(this.body.width / 2, this.body.height);

        this.center = scene.add.circle(0, 0, 2, 'blue');
        this.center.setPosition(this.body.width / 2, this.body.height / 2);

        this.add([
            this.name,
            this.sprite,
            this.center
        ]);

        this.platformColliders = []
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
        if (this.cursors.left.isDown) {
            this.setVelocityX(-240);
            this.sprite.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(240);
            this.sprite.anims.play('right', true);
        } else {
            this.setVelocityX(0);
            this.sprite.anims.play('turn');
        }

        if (this.body.onFloor()) {
            if (this.cursors.down.isDown && this.cursors.space.isDown) {
                this.setVelocityY(-48);
                this.platformColliders.forEach(collider => {
                    collider.active = false;
                    this.time.addEvent({
                        delay: 500,
                        callback: () => {collider.active = true},
                        callbackScope: this, 
                    })
                })
            } else if (this.cursors.space.isDown) {
                this.setVelocityY(-720);
            }
        }
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
        this.load.image('woods', woods);
        this.load.image('tiles', example_tiles);
        this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('tile_spritesheet', example_tiles, { frameWidth: 64, frameHeight: 64});
        this.load.tilemapTiledJSON('adventure_map', adventure_map);
    }

    create () {

        const map = this.make.tilemap({key: 'adventure_map'});
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        const background = this.add.image(0, map.heightInPixels, 'woods');
        background.setOrigin(0, 1);

        const tiles = map.addTilesetImage('example', 'tiles');

        const layer2 = map.createLayer("layer2", tiles);
        setLayerCollisionTopOnly(layer2.layer, 1);

        const layer1 = map.createLayer("layer1", tiles);
        layer1.setCollision([1, 4]);

        const spikes = map.createFromObjects('spikes', {
            gid: 71,
            classType: Spike,
            key: 'tile_spritesheet',
            frame: 70,
        });
        spikes.forEach(spike => {
            spike.setCollisionFromTileData(71, map, 'example');
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), 
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            tab: Phaser.Input.Keyboard.KeyCodes.TAB,
        });

        this.player = new Player(this, 200, 200);
        this.player.setGravityY(1600);
        this.player.setCollideWorldBounds(true);

        this.player.addPlatforms([layer2]);
        this.player.addCollision([layer1, spikes]);

        this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true;
        // this.cameras.main.zoom = 1.7;

    }

    update (time, delta) {
        this.player.update(time, delta);
    }

}


export default defaultScene;
