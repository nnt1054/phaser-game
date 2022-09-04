import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles,
    createTiledMap,
} from '../game/utils'

import { Player } from '../game/Player';

import jumpquest_map from '../assets/tilemaps/jq_map.json';
import jumpquest_bg from '../assets/jq.png';
import kugane_bg from '../assets/kugane.jpg';

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
        player.character.play('run', false);
        // player.sprite.on('animationcomplete', () => {
        //     player.isAttacking = false;
        // });
        setTimeout(() => player.isAttacking = false, 1000);
    },
}

const abilityMap = {
    'attack': basicAttack,
    'heal': basicAbility,
}

class defaultScene extends Phaser.Scene {
    constructor() {
        super('default');
    }

    preload () {
        this.load.image('jumpquest_bg', jumpquest_bg);
        this.load.image('kugane_bg', kugane_bg);
        this.load.tilemapTiledJSON('jumpquest_map', jumpquest_map);
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
        observeStore(store, getQueuedAbility, (abilityName) => {
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

        this.zoom = 10;
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