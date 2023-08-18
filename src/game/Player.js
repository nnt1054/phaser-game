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
    CharacterSpriteMixin,
    DisplayNameMixin,
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
        CharacterSpriteMixin,
        DisplayNameMixin,
    ]

    constructor(id, scene, x, y, config, isClientPlayer) {
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

        // todo: remove
        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.state = {
            x: x,
            y: y,
            width: 20,
            height: 48,
            facingRight: true,
            currentAnim: 'idle',
            health: 100,
            maxHealth: 100,
            character: {
                config: compositeConfig,
                indexes: config.spriteConfig,
            },
            displayName: config.displayName,
            equipment: config.equipment,
        }

        this.initializeCompositeSprite();
        this.initializeMovementController();
        this.initializeDisplayName();
        this.initializeTargetMixin();
        this.initializeMessagingMixin();
        this.initializeHealthBars();
        this.initializeEnemyListMixin();
        this.initializeBuffMixin();
        this.initializeCooldowns();
        this.initializeExperienceMixin();
        this.initializeEquipmentMixin();
        this.initializeInventoryMixin(config);

        this.hitboxRect = new ArcadeRectangle(
            this.scene, this.state.width / 2, this.state.height, 24, 42,
        );
        this.hitboxRect.setOrigin(0.5, 1);

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

        this.inputCursors = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            jump: 0,
        }
    }

    setInput(input) {
        this.inputCursors = {
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

        this.updateState();
        this.updateFromState();

        this.clearLadders();
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
        this.state.character = {
            config: this.character.config,
            indexes: this.character.indexes,
        };
        this.state.equipment = {
            weapon: this.equipped.weapon ? this.equipped.weapon.id : null,
            helmet: this.equipped.helmet ? this.equipped.helmet.id : null,
            armor: this.equipped.armor ? this.equipped.armor.id : null,
            pants: this.equipped.pants ? this.equipped.pants.id : null,
        };
    }

    updateFromState() {
        this.setDisplayName(this.state.displayName);
        this.setPosition(this.state.x, this.state.y);
        this.setCharacterDirection(this.state.facingRight);
        this.playAnimation(this.state.currentAnim);
        this.setHealth(this.state.health, this.state.maxHealth);
        this.character.updateIndexes(this.state.character.indexes);
        this.equipHelmetFromId(this.state.equipment.helmet);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
        this.chatBubble.setScale(1 / zoom);
    }
}
