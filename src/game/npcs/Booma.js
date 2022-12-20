import {
    CompositeSprite,
} from '../utils';

import {
    HealthMixin,
    TargetMixin,
} from '../mixins';

import store from '../../store/store';
import {
    setDialogue,
    clearDialogue,
} from '../../store/dialogueBox';

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
    'headband': 'headband',
    'hair_front': 'hair',
};

const compositeConfigIndexes = {
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


export class Booma extends Phaser.GameObjects.Container {

    mixins = [
        TargetMixin,
        HealthMixin,
    ]

    constructor(scene, x, y, displayName='Non-Player') {
        super(scene, x, y);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

        this.isEnemy = true;
        this.displayName = displayName;

        scene.add.existing(this);
        this.setSize(32, 48);
        let width = 32;
        let height = 48;
        this.ref_x = width / 2;
        this.ref_y = height;

        this.name = scene.add.text(0, 0, this.displayName, {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8,
        });
        this.name.setOrigin(0.5, 1);
        this.name.setPosition(this.ref_x + 0, this.ref_y - height);
        this.name.setInteractive();
        this.name.on('clicked', (object) => {
            this.handleClick();
        });

        this.character = new CompositeSprite(
            scene,
            this.ref_x,
            this.ref_y + 1,
            compositeConfig,
            compositeConfigIndexes
        );
        this.character.setScale(0.1);
        this.character.scaleX = -Math.abs(this.character.scaleX);

        // loop animation
        this.character.play('floss', false);
        this.character.on('animationcomplete', () => {
            this.character.play('floss', false);
        })

        let clickPadding = { width: 32, height: 64 };
        this.clickRect = scene.add.rectangle(
            0, 0, clickPadding.width, clickPadding.height,
        );
        this.clickRect.setOrigin(0.5, 1);
        this.clickRect.setPosition(this.ref_x + 0, this.ref_y);
        this.clickRect.setInteractive();
        this.clickRect.on('clicked', (object) => {
            this.handleClick();
        });

        let hitboxRect = { width: 24, height: 24 };
        this.hitboxRect = scene.add.rectangle(
            0, 0,
            this.width + hitboxRect.width, this.height + hitboxRect.height,
        );
        this.hitboxRect.setOrigin(0.5, 1);
        this.hitboxRect.setPosition(this.ref_x + 0, this.ref_y);

        this.add([
            this.name,
            this.character,
            this.clickRect,
            this.hitboxRect,
        ]);

    }

    handleClick() {
        const player = this.scene.player;
        this.scene.player.targetObject(this);
    }

    handleConfirm() {
        // const player = this.scene.player;
        // this.startDialogue(player);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }

    handleDeath() {
        this.visible = false;
        if (this.isTargeted) {
            const player = this.scene.player;
            player.untargetObject();
        }
    }
}