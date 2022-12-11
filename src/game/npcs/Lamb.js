import {
    CompositeSprite,
} from '../utils';

import {
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
    'hair_front': 'hair',
};

const compositeConfigIndexes = {
    'hair_back': 1,
    'legs': 1,
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
    'hair_front': 1,
};

export class Lamb extends Phaser.GameObjects.Container {

    mixins = [
        TargetMixin,
    ]

    constructor(scene, x, y, displayName='Non-Player') {
        super(scene, x, y);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

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

        this.character = new CompositeSprite(
            scene,
            this.ref_x,
            this.ref_y + 1,
            compositeConfig,
            compositeConfigIndexes
        );
        this.character.play('idle');
        this.character.setScale(0.1);
        this.character.scaleX = -Math.abs(this.character.scaleX);

        let inputPadding = { width: 24, height: 24 };
        this.inputRect = scene.add.rectangle(
            0, 0,
            this.width + inputPadding.width, this.height + inputPadding.height,
        );
        this.inputRect.setOrigin(0.5, 1);
        this.inputRect.setPosition(this.ref_x + 0, this.ref_y);
        this.inputRect.setInteractive();
        this.inputRect.on('clicked', (object) => {
            this.handleClick();
        });

        let interactionPadding = { width: 256, height: 48 };
        this.interactionRect = scene.add.rectangle(
            0, 0,
            this.width + interactionPadding.width, this.height + interactionPadding.height,
        );
        this.interactionRect.setOrigin(0.5, 1);
        this.interactionRect.setPosition(this.ref_x + 0, this.ref_y);

        this.add([
            this.name,
            this.character,
            this.inputRect,
            this.interactionRect,
        ]);

    }

    startDialogue() {
        const player = this.scene.player;
        const messages = getMessages({
            name: player.displayName,
        })
        const inRange = Phaser.Geom.Rectangle.Overlaps(player.getBounds(), this.interactionRect.getBounds());
        if (inRange && player.body.onFloor()) {
            player.dialogueTarget = this;
            player.dialogueComplete = false;
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: messages,
            }))
        } else {
            console.log('you are not in range!');
        }
    }

    shouldEndDialogue(player) {
        const inRange = Phaser.Geom.Rectangle.Overlaps(player.getBounds(), this.interactionRect.getBounds());
        return !inRange;
    }

    completeDialogue(player) {
        player.dialogueTarget = null;
        console.log('nice complete');
    }

    handleClick() {
        if (this.isTargeted) {
            this.startDialogue();
        } else {
            this.scene.player.targetObject(this);
        }
    }

    handleConfirm() {
        this.startDialogue();
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }
}

const getMessages = (config) => {
    const messages = [
        `Hello ${ config.name }`,
        'You who are our future, tell me this and tell me true.',
        'Has your journey been good? Has it been worthwhile?',
    ];
    return messages;
}
