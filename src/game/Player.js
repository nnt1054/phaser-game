import {
    ArcadeContainer,
    CompositeSprite,
} from './utils'

import actionMap from './actions';

// redux imports
import store from '~/src/store/store';
import {
    clearInputQueues,
} from '~/src/store/playerState';


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


export class Player extends ArcadeContainer {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(32, 48);
        this.setMaxVelocity(800);
        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.name = scene.add.text(0, 0, 'Player 1', {
            fontFamily: 'Comic Sans MS',
            fontSize: '16px',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8,
        });
        this.name.setOrigin(0.5, 1);
        this.name.setPosition(this.ref_x + 0, this.ref_y - this.body.height);
        this.name.setScale(0.3);

        this.composite = scene.add.container(0, 0);
        this.composite.setPosition(this.ref_x, this.ref_y + 1);
        this.composite.setScale(0.1);

        let compositeConfig = {
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
        }
        this.character = new CompositeSprite(scene, 0, 0, compositeConfig);
        this.character.setPosition(this.ref_x, this.ref_y + 1);
        this.character.setScale(0.1);

        this.add([
            this.name,
            this.character,
        ]);

        this.platformColliders = [];

        this.gcdQueue = null;
        this.gcdTimer = 0;

        this.isAttacking = false;
        this.paused = false;

        this.reduxCursors = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        }

        this.jumpOnNextUpdate = false;

        const getPlayerState = state => state.playerState;
        this.observer = observeStore(store, getPlayerState, (playerState) => {
            let clearInputs = false;

            if (playerState.queuedAbility) {
                this.queueAbility(playerState.queuedAbility);
                clearInputs = true;
            }

            this.jumpOnNextUpdate = playerState.jump;
            // if (playerState.jump) {
            //     this.jumpOnNextUpdate = true;
            //     clearInputs = true;
            // }

            if (clearInputs) {
                store.dispatch(clearInputQueues());
            }

            this.reduxCursors = {
                up: playerState.up,
                down: playerState.down,
                left: playerState.left,
                right: playerState.right,
            }
        });
    }

    addPlatforms(platforms) {
        platforms.forEach(platform => {
            let collider =  this.physics.add.collider(this, platform);
            this.platformColliders.push(collider)
        })
    }

    addCollision(objects) {
        objects.forEach(object => {
            this.physics.add.collider(this, object);
        })
    }

    queueAbility(abilityName) {
        // need to import action Map here instead
        if (!abilityName) return;
        const ability = actionMap[abilityName];
        if (!ability) return;

        if (this.gcdQueue) return;
        if (this.gcdTimer > 1000) return;
        this.gcdQueue = ability;
    }

    update_2(time, delta) {
        if (this.gcdTimer > 0) {
            this.gcdTimer = Math.max(0, this.gcdTimer - delta)
        }
        if (this.gcdQueue && this.gcdTimer == 0) {
            const ability = this.gcdQueue;
            ability.execute(this);
            this.gcdTimer += ability.cooldown;
            this.gcdQueue = null;
        }

        if (!this.paused) {
            this.character.play('run', true);
        }
    }

    update(time, delta) {
        let anim = 'idle';

        // horizontal position changes
        if (this.reduxCursors.left) {
            if (this.reduxCursors.down) {
                this.setVelocityX(-80);
                // anim = 'walk'
                anim = 'run'
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
                this.character.scaleX = -Math.abs(this.character.scaleX);
            } else {
                this.setVelocityX(-140);
                anim = 'run'
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
                this.character.scaleX = -Math.abs(this.character.scaleX);
            }
        } else if (this.reduxCursors.right) {
            if (this.reduxCursors.down) {
                this.setVelocityX(80);
                // anim = 'walk'
                anim = 'run'
                this.composite.scaleX = Math.abs(this.composite.scaleX);
                this.character.scaleX = Math.abs(this.character.scaleX);
            } else {
                this.setVelocityX(140);
                anim = 'run'
                this.composite.scaleX = Math.abs(this.composite.scaleX);
                this.character.scaleX = Math.abs(this.character.scaleX);
            }
        } else {
            this.setVelocityX(0);
        }

        // vertical position changes
        if (this.body.onFloor()) {
            this.setGravityY(1600);
            if (this.reduxCursors.down && this.jumpOnNextUpdate) {
                this.setVelocityY(-30);
                this.platformColliders.forEach(collider => {
                    collider.active = false;
                    this.time.addEvent({
                        delay: 250,
                        callback: () => {collider.active = true},
                        callbackScope: this, 
                    })
                })
            } else if (this.jumpOnNextUpdate) {
                this.setVelocityY(-480);
            }
        } else {
            anim = 'run'
            if (this.body.velocity.y >= 0) {
                this.setGravityY(800);
            }
        }
        // this.jumpOnNextUpdate = false;


        // TODO: move this later? does this even work
        this.composite.sort('depth');

        // execute queued ability when appropriate
        if (this.gcdTimer > 0) {
            this.gcdTimer = Math.max(0, this.gcdTimer - delta)
        }
        if (this.gcdQueue && this.gcdTimer == 0) {
            const ability = this.gcdQueue;
            ability.execute(this);
            this.gcdTimer += ability.cooldown;
            this.gcdQueue = null;
        }

        // play animation if not currently locked in another animation
        if (!this.isAttacking && !this.paused) {
            this.character.play(anim, true);
        }
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }
}
