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

        this.messages = createMessages({
            name: this.displayName,
        })
        this.currentMessage = null;
    }

    startDialogue() {
        const player = this.scene.player;
        const inRange = Phaser.Geom.Rectangle.Overlaps(player.getBounds(), this.interactionRect.getBounds());
        if (inRange && player.body.onFloor()) {
            player.dialogueTarget = this;
            this.displayMessage(player, this.messages['001']);
        } else {
            console.log('you are not in range!');
        }
    }

    shouldEndDialogue(player) {
        const inRange = Phaser.Geom.Rectangle.Overlaps(player.getBounds(), this.interactionRect.getBounds());
        return !inRange;
    }

    displayMessage(player, message) {
        this.currentMessage = message;
        if (this.currentMessage.type == 'simple') {
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: message.messages,
            }))
            player.dialogueComplete = false;
        } else if (this.currentMessage.type == 'question') {
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: [message.message],
                options: message.options,
            }))
            player.dialogueComplete = false;
        } else {
            this.endDialogue(player);
        }
    }

    completeDialogue(player, optionIndex) {
        if (this.currentMessage) {
            if (this.currentMessage.type == 'simple') {
                if (this.currentMessage.next) {
                    const nextMessage = this.messages[this.currentMessage.next];
                    this.displayMessage(player, nextMessage);
                } else {
                    this.endDialogue(player);
                }
            } else if (this.currentMessage.type == 'question') {
                console.log('a question has been answered');
                const option = this.currentMessage.options[optionIndex]
                const nextMessage = this.messages[option.next];
                this.displayMessage(player, nextMessage);
            } else {
                this.endDialogue(player);
            }
        }
    }

    endDialogue(player) {
        player.dialogueTarget = null;
        player.dialogueComplete = true;
        store.dispatch(clearDialogue());
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


const createMessages = config => {
    return {
        '001': {
            type: 'simple',
            messages: [
                `Hello ${ config.name }`,
                'You who are our future, tell me this and tell me true.',
                'Has your journey been good? Has it been worthwhile?',
            ],
            next: '002',
        },
        '002': {
            type: 'question',
            message: 'Would you rather...',
            options: [
                { text: 'Unlimited bacon but no games', next: '003'},
                { text: 'or games, UNLIMITED GAMES... but no games', next: '004'},
            ]
        },
        '003': {
            type: 'simple',
            messages: [
                'what are you, dumb?',
                'consider using your head a little',
            ],
            next: null,
        },
        '004': {
            type: 'simple',
            messages: [
                `same here, ${ config.name }`,
                'have a good day.'
            ],
            next: null,
        }
    }
}