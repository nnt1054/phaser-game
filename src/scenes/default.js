import Phaser from 'phaser';
import { v4 as uuid } from 'uuid';

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles,
    createTiledMap,
    ArcadeRectangle,
} from '../game/utils'

import { Player } from '../game/Player';
import { Enemy } from '../game/Enemy';
import { NPC } from '../game/NPC';
import {
    SignPost,
} from '../game/npcs/Sign';
import {
    Lamb,
} from '../game/npcs/Lamb';
import { Ladder } from '../game/Ladder';

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
    clearSystemAction,
    setRefreshCooldown,
} from '../store/playerState';

import store from '../store/store';

// animations loaders
import { animationPreload, animationCreate } from '../animations';


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
        this.physics.world.setFPS(120);
        this.frameAnimator = this.plugins.get('frameAnimator');
        animationCreate(this);

        this.map = createTiledMap(this, 'jumpquest_map');
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + (32 * 6));

        const background = this.add.image(0, this.map.heightInPixels, 'kugane_bg');
        background.displayHeight = this.map.heightInPixels;
        background.setOrigin(0, 1);

        const map_bg = this.add.image(0, this.map.heightInPixels, 'jumpquest_bg');
        map_bg.setOrigin(0, 1);

        const layer1 = this.map.createLayer("ground");
        layer1.setVisible(false);
        layer1.setCollision([2, 12]);

        const layer2 = this.map.createLayer("platforms");
        layer2.setVisible(false);
        setLayerCollisionTopOnly(layer2.layer, [8, 9, 10, 16, 20, 24, 25, 31, 26]);

        const inputUnderlay = this.add.rectangle(
            0, 0,
            this.map.widthInPixels, this.map.heightInPixels,
        );
        inputUnderlay.setOrigin(0, 0);
        inputUnderlay.setInteractive();
        inputUnderlay.on('clicked', (object) => {
            this.player.untargetObject();
        })

        this.staticGroup = this.add.group([layer1]);
        this.platformGroup = this.add.group([layer2]);
        this.climbableGroup = this.add.group([]);

        this.entityGroup = this.add.group([], { runChildUpdate: true })
        this.playerGroup = this.add.group([]);
        this.enemyGroup = this.add.group([]);
        this.npcGroup = this.add.group([]);

        this.physics.add.collider(this.playerGroup, this.staticGroup);
        this.physics.add.collider(this.enemyGroup, this.staticGroup);
        this.physics.add.collider(this.enemyGroup, this.platformGroup);

        // CLIMBABLES
        this.addLadder(32 * 5, 32 * 52, 12, 256);
        this.addLadder(32 * 3, 32 * 52, 12, 256);

        // PLAYERS
        this.player = this.addPlayer(uuid(), true);

        // this.player2 = this.addPlayer(uuid(), false);
        // this.player.setDepth(101);
        // this.clientPlayer = this.player;

        // ENEMIES
        this.addEnemy(32 * 12, 32 * 58, 'Hostile Enemy A');
        this.addEnemy(32 * 14.5, 32 * 58, 'Hostile Enemy B');
        this.addEnemy(32 * 17, 32 * 58, 'Hostile Enemy C');

        // NPCS
        this.addNPC(32 * 20, 32 * 1.5, 'Auspicious Friend');
        this.sign = new SignPost(this, 32 * 3, 32 * 26.5, 'Inconspicuous Sign');
        this.entityGroup.add(this.sign);
        this.npcGroup.add(this.sign);

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

        // client input
        const getPlayerState = state => state.playerState;
        this.observer = observeStore(store, getPlayerState, (playerState) => {
            const input = {
                up: playerState.up,
                down: playerState.down,
                left: playerState.left,
                right: playerState.right,
                jump: playerState.jump,
                queuedAbility: playerState.queuedAbility,
                queuedTarget: playerState.queuedTarget,
                systemAction: playerState.systemAction,
                systemActionTarget: playerState.systemActionTarget,
            };

            if (input.queuedAbility) {
                store.dispatch(clearQueuedAbility());
            }

            if (input.systemAction) {
                store.dispatch(clearSystemAction());
            }

            if (playerState.refreshCooldown) {
                store.dispatch(setRefreshCooldown(false));
                this.clientPlayer.updateCooldownsStore();
            }

            this.clientPlayer.setInput(input);
        });

        const getDialogueComplete = state => state.dialogueBox;
        this.dialogueObserver = observeStore(store, getDialogueComplete, (dialogueState) => {
            const input = {
                dialogueComplete: dialogueState.complete,
                dialogueOption: dialogueState.currentOption,
            }

            this.clientPlayer.setDialogueInput(input);
        });

        const getFrameIndex = state => state.aniEditor;
        this.animationObserver = observeStore(store, getFrameIndex, (animState) => {
            this.clientPlayer.setAnimState(animState);
        })
    }

    update (time, delta) {}

    autoZoomCamera() {
        let zoomY = this.game.canvas.height / this.map.heightInPixels;
        let zoomX = this.game.canvas.width / this.map.widthInPixels;
        this.zoom = Math.max(this.zoom, zoomX, zoomY, 1);
        this.zoom = Math.min(this.zoom, 6)
        this.cameras.main.setZoom(this.zoom);
        for (const entity of this.entityGroup.children.entries) {
            entity.autoZoom(this.zoom);
        }
    }

    getServerState() {
        const state = {
            players: {},
        };

        for (const player of this.playerGroup.children.entries) {
            state.players[player.id] = player.state;
        };

        return state;
    }

    initializeSceneFromState(state) {
        for (const [playerId, playerState] of Object.entries(state['players'])) {
            this.addPlayer(playerId, false, playerState);
        }
    }

    updateSceneFromState(state) {
        for (const [playerId, playerState] of Object.entries(state['players'])) {
            const player = this.playerGroup.children.entries.find(gameObject => gameObject.id == playerId);
            if (player) {
                player.setState(playerState);
            } else {
                this.addPlayer(playerId, false, playerState)
            }
        }
        for (const player of this.playerGroup.children.entries) {
            if (!(player.id in state['players']) && !player.isClientPlayer) {
                player.destroy();
            }
        };
    }

    getObjectFromId(id) {
        return this.playerGroup.children.entries.find(gameObject => gameObject.id == id);
    }

    addLadder(x, y, width, height) {
        const ladder = new Ladder(this, x, y, width, height);
        this.climbableGroup.add(ladder);
    }

    addEnemy(x, y, displayName) {
        const characterConfig = {
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

        const indexes = {
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

        const config = {
            character: {
                config: characterConfig,
                indexes: indexes,
            },
        }

        const enemy = new Enemy(uuid(), this, x, y, config, displayName);
        this.entityGroup.add(enemy);
        this.enemyGroup.add(enemy);
    }

    addNPC(x, y, displayName, config) {
        const spriteConfig = {
            'hair_back': 2,
            'legs': 1,
            'arm_back': 1,
            'torso': 1,
            'arm_front': 1,
            'head': 1,
            'ears': 1,
            'face': 0,
            'hair_front': 2,

            'pants': 1,
            'armor_body_back_sleeve': 3,
            'armor_body': 3,
            'armor_body_front_sleeve': 3,
            'armor_body_collar': 3,
            'headband': 2,
        };

        const npc = new NPC(uuid(), this, x, y, displayName);
        this.entityGroup.add(npc);
        this.npcGroup.add(npc);
    }

    addPlayer(id, isClientPlayer, state) {
        const spriteConfig = {
            'hair_back': 1,
            'legs': 1,
            'arm_back': 1,
            'torso': 1,
            'arm_front': 1,
            'head': 1,
            'ears': 1,
            'face': 0,
            'hair_front': 1,

            'pants': 1,
            'armor_body_back_sleeve': 1,
            'armor_body': 1,
            'armor_body_front_sleeve': 1,
            'armor_body_collar': 1,
            'headband': 1,
        };

        const equipment = {
            weapon: null,
            helmet: 1,
            armor: null,
            pants: null,
        }

        const inventory = {
            'potion': 3,
            'halo': 1,
            'horns': 1,
            'ears': 1,
            'bow': 1,
            'knights helm': 1,
        }

        const config = {
            displayName: isClientPlayer ? 'Player 1' : 'Player 2',
            spriteConfig: spriteConfig,
            equipment: equipment,
            inventory: inventory,
        }

        const player = new Player(id, this, 32 * 9, 32 * 58, config, isClientPlayer);
        player.autoZoom(this.zoom);
        if (state) {
            player.setState(state);
        }

        if (isClientPlayer) {
            this.clientPlayer = player;
        }

        this.entityGroup.add(player);
        this.playerGroup.add(player);
        return player;
    }
}

export default defaultScene;
