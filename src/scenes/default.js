import Phaser from 'phaser';

import {
    scaleToWidth,
    setLayerCollisionTopOnly,
    debugTiles,
    createTiledMap,
    ArcadeRectangle,
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

import helmets from '../game/equipment/helmets';
import armors from '../game/equipment/armors';

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

        this.ladder = new Ladder(this, 32 * 5, 32 * 52, 12, 256);
        this.ladder2 = new Ladder(this, 32 * 3, 32 * 52, 12, 256);

        const inputUnderlay = this.add.rectangle(
            0, 0,
            this.map.widthInPixels, this.map.heightInPixels,
        );
        inputUnderlay.setOrigin(0, 0);
        inputUnderlay.setInteractive();
        inputUnderlay.on('clicked', (object) => {
            this.player.untargetObject();
        })

        this.staticGroup = this.add.group([layer1])
        this.platformGroup = this.add.group([layer2]);
        this.climbableGroup = this.add.group([this.ladder, this.ladder2]);

        this.playerGroup = this.add.group([], { runChildUpdate: true });
        this.player = this.addPlayer(1, true);
        this.player2 = this.addPlayer(2, false);
        this.player.setDepth(101);
        this.clientPlayer = this.player;

        this.sign = new SignPost(this, 32 * 3, 32 * 26.5, 'Inconspicuous Sign');
        this.lamb = new Lamb(this, 32 * 20, 32 * 1.5, 'Auspicious Friend');
        this.booma1 = new Booma(this, 32 * 12, 32 * 58, 'Hostile Enemy A');
        this.booma2 = new Booma(this, 32 * 14.5, 32 * 58, 'Hostile Enemy B');
        this.booma3 = new Booma(this, 32 * 17, 32 * 58, 'Hostile Enemy C');

        this.physics.add.collider(this.playerGroup, this.staticGroup);

        this.enemyGroup = this.add.group(
            [this.booma1, this.booma2, this.booma3],
            { runChildUpdate: true }
        );
        this.physics.add.collider(this.enemyGroup, this.staticGroup);
        this.physics.add.collider(this.enemyGroup, this.platformGroup);

        this.npcGroup = this.add.group([
            this.sign,
            this.lamb,
            this.booma1,
            this.booma2,
            this.booma3,
        ]);

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

        // this._testClientInput();
    }

    update (time, delta) {}

    autoZoomCamera() {
        let zoomY = this.game.canvas.height / this.map.heightInPixels;
        let zoomX = this.game.canvas.width / this.map.widthInPixels;
        this.zoom = Math.max(this.zoom, zoomX, zoomY, 1);
        this.zoom = Math.min(this.zoom, 6)
        this.cameras.main.setZoom(this.zoom);
        for (const player of this.playerGroup.children.entries) {
            player.autoZoom(this.zoom);
        }
        for (const npc of this.npcGroup.children.entries) {
            npc.autoZoom(this.zoom);
        }
    }

    getServerState() {
        this.state = {
            players: {
                player_id: {
                    id: 1,
                    displayName: '',
                    x: 0,
                    y: 0,
                    facingRight: true,
                    currentAnim: null,
                    partyId: null,
                    targetId: null,
                    character: null,
                    equipment: null,
                },
            },
            enemies: {

            },
            npcs: {

            },
        };
    }

    addPlayer(id, isClientPlayer) {
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

        const ears = helmets[1];
        const equipment = {
            weapon: null,
            helmet: ears,
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

        this.playerGroup.add(player);
        return player;
    }


    _testClientInput() {
        this.time.delayedCall(1500, () => {
            this.player2.setInput({
                up: 0,
                down: 0,
                left: 0,
                right: 0,
                jump: false,
                systemAction: 'cycleTarget',
            })
        })
        this.time.delayedCall(2500, () => {
            this.player2.setInput({
                up: 0,
                down: 0,
                left: 1,
                right: 0,
                jump: false,
            })
        })
        this.time.delayedCall(3500, () => {
            this.player2.setInput({
                up: 0,
                down: 0,
                left: 0,
                right: 0,
                jump: false,
                queuedAbility: 'jolt',
            })
        })
        this.time.delayedCall(6500, () => {
            this.player2.setInput({
                up: 0,
                down: 0,
                left: 0,
                right: 0,
                jump: false,
                queuedAbility: 'jolt',
            })
        })
        this.time.delayedCall(9500, () => {
            this.player2.setInput({
                up: 0,
                down: 0,
                left: 0,
                right: 0,
                jump: false,
                queuedAbility: 'jolt',
            })
        })
        this.time.delayedCall(12500, () => {
            this.player2.setInput({
                up: 0,
                down: 0,
                left: 0,
                right: 0,
                jump: false,
                queuedAbility: 'jolt',
            })
        })
    }
}


export default defaultScene;
