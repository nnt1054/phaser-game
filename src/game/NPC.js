import {
    StaticCompositeSprite,
} from './utils';
import {
    HealthMixin,
    TargetMixin,
} from './mixins';

// redux imports
import store from '../store/store';

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

export class NPC extends Phaser.GameObjects.Container {

    mixins = [
        // HealthMixin,
        TargetMixin,
    ]

    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

        this.displayName = 'Lamb Seel';

        scene.add.existing(this);
        let textureMap = {
            hair_back: 'hair',
            legs: 'legs',
            arm_back: 'arms',
            armor_body_back_sleeve: 'armor_body',
            torso: 'torso',
            armor_body: 'armor_body',
            arm_front: 'arms',
            armor_body_front_sleeve: 'armor_body',
            armor_body_collar: 'armor_body',
            head: 'head',
            ears: 'ears',
            face: 'face',
            hair_front: 'hair',
        };
        let indexes = {
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
        let frames = {
            'hair_back': 1,
            'legs': 0,
            'arm_back': 1,
            'armor_body_back_sleeve': 3,
            'torso': 0,
            'armor_body': 0,
            'arm_front': 0,
            'armor_body_front_sleeve': 2,
            'armor_body_collar': 1,
            'head': 0,
            'ears': 0,
            'face': 0,
            'hair_front': 0,
        };

        let width = 32;
        let height = 48;
        this.ref_x = width / 2;
        this.ref_y = height;

        this.name = scene.add.text(0, 0, 'Lamb Seel', {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8,
        });
        this.name.setOrigin(0.5, 1);
        this.name.setPosition(this.ref_x + 0, this.ref_y - height);

        this.character = new StaticCompositeSprite(scene, 0, 0, textureMap);
        this.character.setPosition(this.ref_x, this.ref_y + 1);
        this.character.setState({
            indexes: indexes,
            frames: frames,
        });
        this.character.setScale(0.1);
        this.character.scaleX = -Math.abs(this.character.scaleX);

        this.add([
            this.name,
            this.character,
        ]);

        let padding = 24
        this.setInteractive(
            new Phaser.Geom.Rectangle(0 - (padding/2), 0 - padding, 32 + padding, 48 + padding),
            Phaser.Geom.Rectangle.Contains
        );
        this.on('clicked', (object) => {
            this.handleClick();
        });

        this.targetted = false;
    }

    handleClick() {
        if (this.targetted) {
            // check distance and maybe start dialogue
            console.log('hey');
        } else {
            this.scene.player.targetObject(this);
        }
    }

    target() {
        this.targetted = true;
        this.name.text = '> Lamb Seel <';
        this.name.style.setFontSize('18px');
        this.name.style.setFill('yellow');
    }

    untarget() {
        this.targetted = false;
        this.name.text = 'Lamb Seel';
        this.name.style.setFontSize('16px');
        this.name.style.setFill('white');
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }
}
