import {
    StaticCompositeSprite,
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


export class SignPost extends Phaser.GameObjects.Container {

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
            this.inputRect,
            this.interactionRect,
        ]);

    }

    startDialogue() {
        const messages = [
            'hello! congrats on making it this far!',
            'you actually get nothing for being here',
            'goodbye!',
        ];

        const player = this.scene.player;
        const inRange = Phaser.Geom.Rectangle.Overlaps(player.getBounds(), this.interactionRect.getBounds());
        if (inRange && player.body.onFloor()) {
            player.dialogueTarget = this;
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
