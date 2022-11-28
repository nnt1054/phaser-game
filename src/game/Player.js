import {
    ArcadeContainer,
    CompositeSprite,
} from './utils'

import actionMap from './actions';

// redux imports
import store from '../store/store';
import {
    clearInputQueues,
    clearQueuedAbility,
    setCooldowns,
    setGCD,
    setCast,
} from '../store/playerState';
import {
    incrementHealth,
    setPlayerCurrentHealth
} from '../store/playerHealth';

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


class CooldownManager {
    constructor() {
        this._cooldowns = new Map();
        this.cooldown_updater = setInterval(this.updateStore.bind(this), 50);
    }

    getTimer(key) {
        return this._cooldowns.get(key) || [0, 0];
    }

    startTimer(key, time) {
        this._cooldowns.set(key, [time, time]);
    }

    update(delta) {
        for (var [key, value] of this._cooldowns.entries()) {
            this._cooldowns.set(key, [Math.max(0, value[0] - delta), value[1]]);
        }
    }

    updateStore() {
        store.dispatch(
            setCooldowns(
                Object.fromEntries(this._cooldowns)
            )
        );
    }
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
        };

        let compositeConfigIndexes = {
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

        this.character = new CompositeSprite(scene, 0, 0, compositeConfig, compositeConfigIndexes);
        this.character.setPosition(this.ref_x, this.ref_y + 1);
        this.character.setScale(0.1);

        this.add([
            this.name,
            this.character,
        ]);

        this.platformColliders = [];

        this.coyoteTime = 0;
        this.jumpUsed = true;
        this.setGravityY(1600);

        this.gcdQueue = null;
        this.gcdTimer = 0;
        this.abilityTimer = 0;

        this.casting = null;
        this.castingTimer = 0;

        this.paused = false;

        this.reduxCursors = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        }

        // experimental timers
        this.regenTimer = 3000;
        this.previousVelocityY = 0;

        this.current_anim = null;

        const getPlayerState = state => state.playerState;
        this.observer = observeStore(store, getPlayerState, (playerState) => {
            let clearInputs = false;

            if (playerState.queuedAbility) {
                this.queueAbility(playerState.queuedAbility);
                clearInputs = true;
            }

            if (clearInputs) {
                store.dispatch(clearQueuedAbility());
            }

            this.reduxCursors = {
                up: playerState.up,
                down: playerState.down,
                left: playerState.left,
                right: playerState.right,
                jump: playerState.jump,
            }
        });

        this.currentFrame = 0;
        const getFrameIndex = state => state.aniEditor;
        this.observer_animation = observeStore(store, getFrameIndex, (animState) => {
            if (animState.frameIndex != this.currentFrame) {
                this.currentFrame = animState.frameIndex;
                this.queueAbility(`frame${animState.frameIndex}`);
            }
            this.character.setActiveCompositeStates(animState.compositeStates);
        })

        this.cooldownManager = new CooldownManager();
        this.inventory = new Map();
        this.inventory.set('potion', 3);
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
        if (ability.gcd && this.gcdTimer > 500) return;
        if (this.casting && this.castingTimer > 500) return;
        this.gcdQueue = ability;
    }

    startCast(ability) {
        this.casting = ability;
        this.castingTimer = ability.castTime;
        store.dispatch(setCast({
            key: ability.name,
            duration: ability.castTime,
        }));
    }

    cancelCast() {
        this.casting = null;
        this.castingTimer = 0;
        store.dispatch(setCast({
            key: '',
            duration: 0,
        }));

        this.gcdTimer = 0
        store.dispatch(setGCD(0));
    }

    updateMovement(delta) {
        // horizontal position changes
        if (this.reduxCursors.left) {
            if (this.reduxCursors.down) {
                this.setVelocityX(-80);
            } else {
                this.setVelocityX(-140);
            }
        } else if (this.reduxCursors.right) {
            if (this.reduxCursors.down) {
                this.setVelocityX(80);
            } else {
                this.setVelocityX(140);
            }
        } else {
            this.setVelocityX(0);
        }

        if (this.body.onFloor()) {
            this.coyoteTime = 0;
            this.jumpUsed = false;
            if (this.reduxCursors.down && this.reduxCursors.jump) {
                this.executeDownJump();
            } else if (this.reduxCursors.jump) {
                this.executeJump();
            }
        } else {
            if (this.reduxCursors.jump && this.coyoteTime < 240 && !this.jumpUsed) {
                this.executeJump();
            }
            this.coyoteTime += delta;
        }
        this.previousVelocityY = this.body.velocity.y;

        if (this.body.velocity.y > 0) {
            this.setGravityY(800);
        } else {
            this.setGravityY(1600);
        }

        const moving = (this.body.velocity.y || this.body.velocity.x)
        if (moving && this.casting && this.castingTimer > 750) {
            this.cancelCast();
        }
    }

    executeDownJump() {
        this.jumpUsed = true;
        this.platformColliders.forEach(collider => {
            collider.active = false;
            this.time.addEvent({
                delay: 250,
                callback: () => {collider.active = true},
                callbackScope: this, 
            })
        })
    }

    executeJump() {
        this.jumpUsed = true;
        this.setVelocityY(-480);
    }

    calculateAnimationState() {
        let anim = this.current_anim ?? 'idle';
        if (this.casting) anim = 'crouch';

        const speedX = Math.abs(this.body.velocity.x);
        if (speedX > 100) {
            anim = 'run';
        } else if (speedX > 0) {
            anim = 'walk';
        }
        if (!this.body.onFloor() || this.reduxCursors.jump) {
            if (this.body.velocity.x && this.body.velocity.y > 90) {
                anim = 'jump';
            } else if (this.body.velocity.x == 0) {
                anim = 'jumpIdle';
            }
        }
        if (this.body.onFloor() && this.reduxCursors.down && this.body.velocity.x == 0) {
            anim = 'crouch';
            this.current_anim = null;
        }

        if (this.body.velocity.x > 0) {
            this.character.scaleX = Math.abs(this.character.scaleX);
        } else if (this.body.velocity.x < 0) {
            this.character.scaleX = -Math.abs(this.character.scaleX);
        }

        if (anim !== this.current_anim) this.current_anim = null;
        return anim;
    }

    updateAbilityState(delta) {
        const previousGCD = this.gcdTimer;
        this.gcdTimer = Math.max(0, this.gcdTimer - delta);
        this.abilityTimer = Math.max(0, this.abilityTimer - delta);
        if (previousGCD && this.gcdTimer == 0) {
            store.dispatch(setGCD(0));
        }
        const ability = this.gcdQueue;
        if (ability && this.abilityTimer == 0 && this.castingTimer == 0) {
            if (ability.gcd) {
                if (this.gcdTimer == 0) {
                    if (!(ability.canExecute && !ability.canExecute(this))) {
                        if (ability.castTime) {
                            this.startCast(ability);
                        } else {
                            ability.execute(this);
                            this.abilityTimer += 500;
                        }
                        this.gcdTimer += ability.cooldown;
                        store.dispatch(setGCD(ability.cooldown));
                        this.cooldownManager.updateStore();
                    } 
                    this.gcdQueue = null;
                }
            } else {
                if (!(ability.canExecute && !ability.canExecute(this))) {
                    ability.execute(this);
                    this.abilityTimer += 750;
                    this.cooldownManager.updateStore();
                }
                this.gcdQueue = null;
            }
        }
    }

    updateCast(delta) {
        this.castingTimer = Math.max(0, this.castingTimer - delta);
        if (this.casting && this.castingTimer === 0) {
            const ability = this.casting;
            ability.execute(this);
            this.abilityTimer += 500;
            this.cooldownManager.updateStore();
            this.casting = null;
            store.dispatch(setCast({
                key: '',
                duration: 0,
            }));
        }
    }

    update(time, delta) {

        // test fall damage
        if (this.body.onFloor() && this.previousVelocityY >= 800) {
            store.dispatch(setPlayerCurrentHealth(1));
        }

        // test regen
        // this.regenTimer -= delta;
        // if (this.regenTimer <= 0) {
        //     store.dispatch(incrementHealth(10));
        //     this.regenTimer += 3000;
        // }

        this.updateMovement(delta);
        this.updateCast(delta);
        this.updateAbilityState(delta);
        const anim = this.calculateAnimationState();
        if (!this.paused) {
            this.character.play(anim, true);
        }

        this.cooldownManager.update(delta);
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }

    doEmote(emote) {
        this.current_anim = emote;
        this.character.play(emote);
    }
}
