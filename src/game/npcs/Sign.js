import {
    StaticCompositeSprite,
} from '../utils';

import {
    TargetMixin,
    DialogueMixin,
} from '../mixins';

import store from '../../store/store';
import {
    setDialogue,
    clearDialogue,
} from '../../store/dialogueBox';


export class SignPost extends Phaser.GameObjects.Container {

    mixins = [
        TargetMixin,
        DialogueMixin,
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
        this.name.setInteractive();
        this.name.on('clicked', (object) => {
            this.handleClick();
        });

        let clickPadding = { width: 24, height: 48 };
        this.clickRect = scene.add.rectangle(
            0, 0, clickPadding.width, clickPadding.height,
        );
        this.clickRect.setOrigin(0.5, 1);
        this.clickRect.setPosition(this.ref_x + 0, this.ref_y);
        this.clickRect.setInteractive();
        this.clickRect.on('clicked', (object) => {
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
            this.clickRect,
            this.interactionRect,
        ]);

        this.messages = {
            '001': {
                type: 'simple',
                messages: [
                    'hello! congrats on making it this far!',
                    'you actually get nothing for being here',
                    'goodbye!',
                ],
                next: null,
            },
        };
    }

    handleClick() {
        const player = this.scene.player;
        if (this.isTargeted) {
            this.startDialogue(player);
        } else {
            this.scene.player.targetObject(this);
        }
    }

    handleConfirm() {
        const player = this.scene.player;
        this.startDialogue(player);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }
}
