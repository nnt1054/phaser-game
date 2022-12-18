import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles,
    createTiledMap,
} from '../game/utils'

import { Player } from '../game/Player';
import {
    NPC,
} from '../game/NPC';
import {
    SignPost,
} from '../game/npcs/Sign';
import {
    Lamb,
} from '../game/npcs/Lamb';
import {
    Booma,
} from '../game/npcs/Booma';

import jumpquest_map from '../assets/tilemaps/jq_map.json';
import jumpquest_bg from '../assets/jq.png';
import kugane_bg from '../assets/kugane.jpg';

import {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
    setPlayerMaxHealth,
    setPlayerHealth,   
} from '../store/playerHealth';

import {
    clearQueuedAbility,
    clearInputQueues,
} from '../store/playerState';

import store from '../store/store';

// animations loaders
import { animationPreload, animationCreate } from '../animations';


class defaultScene extends Phaser.Scene {
    constructor() {
        super('default');
    }

    preload () {
        this.load.image('jumpquest_bg', jumpquest_bg);
        this.load.image('kugane_bg', kugane_bg);
        this.load.tilemapTiledJSON('jumpquest_map', jumpquest_map);
        animationPreload(this);
    }

    create () {
        // this.input.enableDebug();
        this.frameAnimator = this.plugins.get('frameAnimator');
        animationCreate(this);

        this.map = createTiledMap(this, 'jumpquest_map');
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + (32 * 6));

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
        map_bg.setOrigin(0, 1);

        const inputUnderlay = this.add.rectangle(
            0, 0,
            this.map.widthInPixels, this.map.heightInPixels,
        );
        inputUnderlay.setOrigin(0, 0);
        inputUnderlay.setInteractive();
        inputUnderlay.on('clicked', (object) => {
            this.player.untargetObject();
        })

        // Player
        // this.player = new Player(this, 32 * 18, 32 * 1.5);
        this.player = new Player(this, 32 * 3, 32 * 56);

        // NPC
        this.sign = new SignPost(this, 32 * 3, 32 * 26.5, 'Inconspicuous Sign');
        this.lamb = new Lamb(this, 32 * 20, 32 * 1.5, 'Auspicious Friend');

        this.booma1 = new Booma(this, 32 * 12, 32 * 58.5, 'Hostile Enemy A');
        this.booma2 = new Booma(this, 32 * 14.5, 32 * 58.5, 'Hostile Enemy B');
        this.booma3 = new Booma(this, 32 * 17, 32 * 58.5, 'Hostile Enemy C');

        this.npcs = [
            this.sign,
            this.lamb,
            this.booma1,
            this.booma2,
            this.booma3,
        ];

        this.player.availableTargets = this.npcs;
        this.player.setCollideWorldBounds(true);
        this.player.addPlatforms([layer2]);
        this.player.addCollision([layer1]);
        // this.player.addCollision([layer1, spikes]);

        this.cameras.main.startFollow(this.player, false, 1, 1);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.scale.on(Phaser.Scale.Events.RESIZE, () => {
            this.autoZoomCamera();
        });

        this.zoom = 2;
        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.zoom -= deltaY * 0.001;
            this.autoZoomCamera();
        });
        this.autoZoomCamera();

        this.mouse = null;
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            this.mouse = gameObject;
        }, this);
        this.input.on('gameobjectup', (pointer, gameObject) => {
            if (gameObject === this.mouse) {
                gameObject.emit('clicked', gameObject);
            }
            this.mouse = null;
        }, this);
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
        for (const npc of this.npcs) {
            npc.autoZoom(this.zoom);
        }
    }
}


export default defaultScene;
