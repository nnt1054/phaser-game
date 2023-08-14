import {
    ArcadeContainer,
    ArcadeRectangle,
    CompositeSprite,
} from './utils'

import store from '../store/store';
import {
    setGCD,
    setComboAction,
} from '../store/playerState';
import {
    setTarget,
    removeTarget,
    setCotarget,
    setTargetCast,
    cancelTargetCast,
} from '../store/targetInfo';
import {
    HealthMixin,
    TargetMixin,
    DialogueMixin,
    BuffMixin,
    EquipmentMixin,
    InventoryMixin,
    EnemyListMixin,
    CastingMixin,
    CooldownMixin,
    LevelMixin,
    ExperienceMixin,
    BaseStatsMixin,
    CombatMixin,
    JobMixin,
    MessagingMixin,
    AnimationEditorMixin,
    MovementController,
    ActionController,
    AnimationController,
} from './mixins';

import {
    setAlert,
} from '../store/alert';

import helmets from './equipment/helmets';
import armors from './equipment/armors';

const TARGET_CONSTANTS = {
    CURRENT_TARGET: 'CURRENT_TARGET',
}

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
    'face': 'face',
    'headband': 'headband',
    'hair_front': 'hair',
};


export class Player extends ArcadeContainer {

    mixins = [
        HealthMixin,
        TargetMixin,
        EquipmentMixin,
        InventoryMixin,
        EnemyListMixin,
        BuffMixin,
        CastingMixin,
        CooldownMixin,
        CombatMixin,
        ExperienceMixin,
        BaseStatsMixin,
        LevelMixin,
        JobMixin,
        MovementController,
        ActionController,
        AnimationEditorMixin,
        DialogueMixin,
        MessagingMixin,
        AnimationController,
    ]

    constructor(id, scene, x, y, config, isClientPlayer) {
        const compositeConfigIndexes = {
            'hair_back': 1,
            'legs': 1,
            'pants': 1,
            'arm_back': 1,
            'armor_body_back_sleeve': 1,
            'torso': 1,
            'armor_body': 1,
            'arm_front': 1,
            'armor_body_front_sleeve': 1,
            'armor_body_collar': 1,
            'head': 1,
            'ears': 1,
            'face': 0,
            'headband': 1,
            'hair_front': 1,
        };

        super(scene, x, y);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

        this.id = id;
        this.isPlayer = true;
        this.isClientPlayer = isClientPlayer;

        // physics setup
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(20, 48);
        this.setDepth(100);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(800);
        this.setGravityY(1600);

        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.displayName = config.displayName;

        this.ladderHitbox = new ArcadeRectangle(scene, 0, 0, 20, 36);
        this.ladderHitbox.setOrigin(0.5, 1);
        this.ladderHitbox.setPosition(this.ref_x, this.ref_y);

        this.hitboxRect = new ArcadeRectangle(scene, this.ref_x, this.ref_y, 24, 42);
        this.hitboxRect.setOrigin(0.5, 1);

        this.name = scene.add.text(
            this.ref_x,
            this.ref_y,
            this.displayName,
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '16px',
                fill: '#FFF',
                stroke: '#000',
                strokeThickness: 8,
            }
        );
        this.name.setOrigin(0.5, 0);
        this.name.setInteractive();
        this.name.on('clicked', (object) => {
            this.handleClick();
        });

        this.character = new CompositeSprite(
            scene,
            this.ref_x,
            this.ref_y + 1.5,
            compositeConfig,
            config.spriteConfig,
        );

        this.clickRect = scene.add.rectangle(0, 0, 32, 64,);
        this.clickRect.setOrigin(0.5, 1);
        this.clickRect.setPosition(this.ref_x, this.ref_y);
        this.clickRect.setInteractive();
        this.clickRect.on('clicked', (object) => {
            this.handleClick();
        });

        this.chatBubble = scene.add.dom(0, 0,
            'div',
            '',
            this.currentMessage,
        );
        this.chatBubble.setClassName('chat-bubble-hidden');
        this.chatBubble.setOrigin(0.5, 1);
        this.chatBubble.setPosition(this.ref_x + 0, -8);

        this.healthBarWidth = 32;
        this.healthBar = scene.add.rectangle(0, 0, 32, 4, 0x00ff00);
        this.healthBar.setOrigin(0.5, 1);
        this.healthBar.setPosition(this.ref_x, 0);

        this.healthBarUnderlay = scene.add.rectangle(0, 0, 33, 5, 0x000000);
        this.healthBarUnderlay.setOrigin(0.5, 1);
        this.healthBarUnderlay.setPosition(this.ref_x, 0.5);

        this.add([
            this.chatBubble,
            this.name,
            this.character,
            this.clickRect,
            this.hitboxRect,
            this.ladderHitbox,
            this.healthBarUnderlay,
            this.healthBar,
        ]);

        this.initializeEnemyListMixin();
        this.initializeBuffMixin();
        this.initializeMovementController();
        this.initializeCooldowns();
        this.initializeExperienceMixin();

        this.reduxCursors = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            jump: 0,
        }

        const { inventory, equipment } = config;
        for (let item in inventory) {
            this.addItem(item, inventory[item])
        }
        this.equipHelmet(equipment.helmet);
        this.setJob(this.equipped.helmet.job);

        this.state = {
            id: this.id,
            x: this.x,
            y: this.y,
            currentAnim: null,
        }

        // this.state = {
        //     partyId: null,
        //     targetId: null,
        //     character: null,
        //     equipment: null,
        // }
    }

    setInput(input) {
        this.reduxCursors = {
            up: input.up,
            down: input.down,
            left: input.left,
            right: input.right,
            jump: input.jump,
        }

        if (input.queuedAbility) {
            this.queueAbility(
                input.queuedAbility,
                input.queuedTarget,
            );
        }

        if (input.systemAction) {
            this.queueSystemAction(
                input.systemAction,
                input.systemActionTarget,
            );
        }
    }

    handleClick() {
        const clientPlayer = this.scene.clientPlayer;
        clientPlayer.targetObjectFromId(this.id);
    }

    update(time, delta) {
        this.updateDialogue(delta);
        this.updateMovement(delta);
        this.updateCooldowns(delta);
        this.updateBuffs(delta);
        this.updateCast(delta);
        this.updateAbilityState(delta);
        this.updateSystemAction(delta);
        this.updateAnimationState(delta);
        this.clearLadders();

        this.updateState();
        this.updateFromState();
    }

    setState(state) {
        this.state = state;
        this.updateFromState();
    }

    updateState() {
        this.state.displayName = this.displayName;
        this.state.x = this.x;
        this.state.y = this.y;
        this.state.facingRight = this.facingRight;
        this.state.currentAnim = this.currentAnim;
        this.state.health = this.health;
        this.state.maxHealth = this.maxHealth;
    }

    updateFromState() {
        this.displayName = this.state.displayName;
        this.setPosition(this.state.x, this.state.y);
        this.setCharacterDirection(this.state.facingRight);
        this.character.play(this.state.currentAnim, true);
        this.setHealth(this.state.health, this.state.maxHealth);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
        this.chatBubble.setScale(1 / zoom);
    }
}
