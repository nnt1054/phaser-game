import Phaser from 'phaser';

import arms from '../assets/spritesheets/arms.png';
import torso from '../assets/spritesheets/torso.png';
import ears from '../assets/spritesheets/ears.png';
import hair from '../assets/spritesheets/hair.png';
import head from '../assets/spritesheets/head.png';
import legs from '../assets/spritesheets/legs.png';

import faces_demo from '../assets/faces_demo.png';
// import arms from '../assets/arms.png';
// import base_body from '../assets/base_body.png';
// import ears from '../assets/ears.png';
// import haircuts from '../assets/haircuts.png';
// import head_base from '../assets/head_base.png';
// import legs_base from '../assets/legs_base.png';

export class AnimationLoader extends Phaser.Scene {

  constructor() {
    super('animationLoader');
  }

  preload() {
    // let spritesheets_512 = {
    //     'legs': legs,
    //     'arms': arms,
    //     'torso': torso,
    //     'head': head,
    //     'ears': ears,
    //     'hair': hair,
    //     'face': faces_demo,
    // }

  	let spritesheets_512 = {
  		'legs': legs,
  		'arms': arms,
  		'torso': torso,
  		'head': head,
  		'ears': ears,
  		'hair': hair,
  		'face': faces_demo,
  	}
  	for (const [key, source] of Object.entries(spritesheets_512)) {
	    this.load.spritesheet(key, source, {
	        frameWidth: 512,
	        frameHeight: 512,
	    })
  	}
  }

  create() {
    this.frameAnimator = this.plugins.get('frameAnimator');

    let legsWalk = {
        key: 'legs_walk',
        frames: this.anims.generateFrameNumbers('legs', { start: 1, end: 4 }),
        frameRate: 8,
        repeat: -1,
    }
    let legsJump = {
        key: 'legs_jump',
        frames: this.anims.generateFrameNumbers('legs', { start: 9, end: 9 }),
        frameRate: 8,
        repeat: -1,
    }
    let legsCrouch = {
        key: 'legs_crouch',
        frames: this.anims.generateFrameNumbers('legs', { start: 10, end: 10 }),
        frameRate: 8,
        repeat: -1,
    }

    let faceIdle = {
        key: `face_1_idle`,
        frameRate: 1,
        frames: [
            { key: 'face', frame: 0},
            { key: 'face', frame: 0, translateY: 4},
        ],
    }

    let faceRun = {
        key: `face_1_run`,
        frameRate: 12,
        frames: [
            { key: 'face', frame: 0, rotate: 12},
            { key: 'face', frame: 0, rotate: 12},
            { key: 'face', frame: 0, rotate: 12, translateY: 4},
        ]
    }

    let runAnimation = {
        key: 'run',
        frameRate: 12,
        frames: {
            arm_front: [
                { key: 'arms', frame: 0, rotate: 45, translateX: -112, translateY: -32},
                { key: 'arms', frame: 0, rotate: 45, translateX: -112, translateY: -32},
                { key: 'arms', frame: 0, rotate: 46, translateX: -112, translateY: -28},
            ],
            torso: [
                { key: 'torso', frame: 0, rotate: 12},
                { key: 'torso', frame: 0, rotate: 12},
                { key: 'torso', frame: 0, rotate: 12, translateY: 4},
            ],
            arm_back: [
                { key: 'arms', frame: 0, rotate: 45, translateX: -64, translateY: -32},
                { key: 'arms', frame: 0, rotate: 45, translateX: -64, translateY: -32},
                { key: 'arms', frame: 0, rotate: 46, translateX: -64, translateY: -28},
            ],
            head: [
                { key: 'head', frame: 0, rotate: 12},
                { key: 'head', frame: 0, rotate: 12},
                { key: 'head', frame: 0, rotate: 12, translateY: 4},
            ],
            ears: [
                { key: 'ears', frame: 0, rotate: 12},
                { key: 'ears', frame: 0, rotate: 12},
                { key: 'ears', frame: 0, rotate: 12, translateY: 4},
            ],
            hair_front: [
                { key: 'hair', frame: 0, rotate: 12},
                { key: 'hair', frame: 0, rotate: 12},
                { key: 'hair', frame: 0, rotate: 12, translateY: 4},
            ],
            hair_back: [
                { key: 'hair', frame: 1, rotate: 12},
                { key: 'hair', frame: 1, rotate: 12},
                { key: 'hair', frame: 1, rotate: 12, translateY: 4},
            ],
            legs: [
                { key: 'legs', frame: 5, translateY: -8, rotate: 12},
                { key: 'legs', frame: 5, translateY: -8, rotate: 12},
                { key: 'legs', frame: 6, translateY: 0, rotate: 12},
                { key: 'legs', frame: 7, translateY: -8, rotate: 12},
                { key: 'legs', frame: 7, translateY: -8, rotate: 12},
                { key: 'legs', frame: 8, translateY: 0, rotate: 12},
            ]
        }
    }


    let idleAnimation = {
        key: 'idle',
        frameRate: 1,
        frames: {
            arm_front: [
                { key: 'arms', frame: 0},
                { key: 'arms', frame: 0, translateY: 4},
            ],
            torso: [
                { key: 'torso', frame: 0},
                { key: 'torso', frame: 0, translateY: 4},
            ],
            arm_back: [
                { key: 'arms', frame: 1},
                { key: 'arms', frame: 1, translateY: 4},
            ],
            head: [
                { key: 'head', frame: 0},
                { key: 'head', frame: 0, translateY: 4},
            ],
            ears: [
                { key: 'ears', frame: 0},
                { key: 'ears', frame: 0, translateY: 4},
            ],
            hair_front: [
                { key: 'hair', frame: 0},
                { key: 'hair', frame: 0, translateY: 4},
            ],
            hair_back: [
                { key: 'hair', frame: 1},
                { key: 'hair', frame: 1, translateY: 4},
            ],
            legs: [
                { key: 'legs', frame: 0},
                { key: 'legs', frame: 0},
            ]
        }
    }

    let compositeToTextureMap = {
        arm_front: 'arms',
        torso: 'torso',
        arm_back: 'arms',
        head: 'head',
        ears: 'ears',
        hair_front: 'hair',
        hair_back: 'hair',
        face: 'face',
        legs: 'legs'
    }

    for (const [key, frames] of Object.entries(idleAnimation.frames)) {
        let textureKey = compositeToTextureMap[key];
        let texture = this.textures.list[textureKey];
        let rows = texture.customData.rows;
        let columns = texture.customData.columns;
        for (var i = 0; i < rows; i++) {
            let data = {
                key: `${key}_${i}_${idleAnimation.key}`,
                frameRate: idleAnimation.frameRate,
                frames: frames.map(frame => {
                    return {
                        key: textureKey,
                        frame: (i * columns) + frame.frame,
                        translateX: frame.translateX,
                        translateY: frame.translateY,
                        rotate: frame.rotate,
                    }
                }),
            }
            this.anims.create(data);
            this.frameAnimator.frameAnimatorUpdateFrames(this.anims, data);   
        }
    }

    for (const [key, frames] of Object.entries(runAnimation.frames)) {
        let textureKey = compositeToTextureMap[key];
        let texture = this.textures.list[textureKey];
        let rows = texture.customData.rows;
        let columns = texture.customData.columns;
        for (var i = 0; i < rows; i++) {
            let data = {
                key: `${key}_${i}_${runAnimation.key}`,
                frameRate: runAnimation.frameRate,
                frames: frames.map(frame => {
                    return {
                        key: textureKey,
                        frame: (i * columns) + frame.frame,
                        translateX: frame.translateX,
                        translateY: frame.translateY,
                        rotate: frame.rotate,
                    }
                }),
            }
            this.anims.create(data);
            this.frameAnimator.frameAnimatorUpdateFrames(this.anims, data);   
        }
    }


    for (const [key, value] of Object.entries(runAnimation.frames)) {
        let data = {
            key: `${key}_${runAnimation.key}`,
            frameRate: runAnimation.frameRate,
            frames: value,
        }
        this.anims.create(data);
        this.frameAnimator.frameAnimatorUpdateFrames(this.anims, data);
    }

    let animationJSON = {
        anims: [
            legsWalk,
            legsJump,
            legsCrouch,
            faceIdle,
            faceRun,
        ]
    }
    this.anims.fromJSON(animationJSON);
    this.frameAnimator.frameAnimatorUpdateFramesFromJSON(this.anims, animationJSON);
    setTimeout(() => this.scene.start('default'), 1)
  }

  loadCompositeAnimation(data) {
    for (const [key, value] of Object.entries(data.frames)) {
        let anim = {
            key: `${key}_${data.key}`,
            frameRate: data.frameRate,
            frames: value,
        }
        this.anims.create(data);
        this.frameAnimator.frameAnimatorUpdateFrames(this.anims, data);
    }
  }

}

export default AnimationLoader;