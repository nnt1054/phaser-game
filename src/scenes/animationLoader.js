import Phaser from 'phaser';

import faces_demo from '../assets/faces_demo.png';

// base spritesheets
import arms from '../assets/spritesheets/arms.png';
import torso from '../assets/spritesheets/torso.png';
import ears from '../assets/spritesheets/ears.png';
import hair from '../assets/spritesheets/hair.png';
import head from '../assets/spritesheets/head.png';
import legs from '../assets/spritesheets/legs.png';
import pants from '../assets/spritesheets/pants.png';

// armor spritesheets
import armor_body from '../assets/spritesheets/armor_body.png';

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
  	let spritesheets_512 = {
        'face': faces_demo,
  		'legs': legs,
  		'arms': arms,
  		'torso': torso,
  		'head': head,
  		'ears': ears,
  		'hair': hair,
        'armor_body': armor_body,
        'pants': pants,
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
    this.compositeToTextureMap = {
        arm_front: 'arms',
        torso: 'torso',
        arm_back: 'arms',
        head: 'head',
        ears: 'ears',
        hair_front: 'hair',
        hair_back: 'hair',
        face: 'face',
        legs: 'legs',
        pants: 'pants',
        armor_body: 'armor_body',
        armor_body_collar: 'armor_body',
        armor_body_front_sleeve: 'armor_body',
        armor_body_back_sleeve: 'armor_body',
    }

    let faceIdle = {
        key: `face_1_idle`,
        frameRate: 1,
        frames: [
            { key: 'face', frame: 0},
            { key: 'face', frame: 0, translateY: 4},
        ],
    }

    let faceWalk = {
        key: `face_1_walk`,
        frameRate: 6,
        frames: [
            { key: 'face', frame: 0, translateY: 2},
            { key: 'face', frame: 0, translateY: 0},
            { key: 'face', frame: 0, translateY: 0},
            { key: 'face', frame: 0, translateY: 0},
        ]
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
            armor_body_front_sleeve: [
                { key: 'armor_body', frame: 2, rotate: 45, translateX: -112, translateY: -32},
                { key: 'armor_body', frame: 2, rotate: 45, translateX: -112, translateY: -32},
                { key: 'armor_body', frame: 2, rotate: 46, translateX: -112, translateY: -28},
            ],
            torso: [
                { key: 'torso', frame: 0, rotate: 12},
                { key: 'torso', frame: 0, rotate: 12},
                { key: 'torso', frame: 0, rotate: 12, translateY: 4},
            ],
            armor_body: [
                { key: 'armor_body', frame: 0, rotate: 12},
                { key: 'armor_body', frame: 0, rotate: 12},
                { key: 'armor_body', frame: 0, rotate: 12, translateY: 4},
            ],
            armor_body_collar: [
                { key: 'armor_body', frame: 1, rotate: 12},
                { key: 'armor_body', frame: 1, rotate: 12},
                { key: 'armor_body', frame: 1, rotate: 12, translateY: 4},
            ],
            arm_back: [
                { key: 'arms', frame: 0, rotate: 45, translateX: -64, translateY: -32},
                { key: 'arms', frame: 0, rotate: 45, translateX: -64, translateY: -32},
                { key: 'arms', frame: 0, rotate: 46, translateX: -64, translateY: -28},
            ],
            armor_body_back_sleeve: [
                { key: 'armor_body', frame: 2, rotate: 45, translateX: -64, translateY: -32},
                { key: 'armor_body', frame: 2, rotate: 45, translateX: -64, translateY: -32},
                { key: 'armor_body', frame: 2, rotate: 46, translateX: -64, translateY: -28},
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

    let walkAnimation = {
        key: 'walk',
        frameRate: 6,
        frames: {
            arm_front: [
                { key: 'arms', frame: 0, rotate: -45, translateX: 128, translateY: -72},
                { key: 'arms', frame: 0, rotate: -23, translateX: 72, translateY: -24 },
                { key: 'arms', frame: 0, rotate: 0, translateX: 0, translateY: 2},
                { key: 'arms', frame: 0, rotate: -23, translateX: 72, translateY: -24 },
            ],
            armor_body_front_sleeve: [
                { key: 'armor_body', frame: 2, rotate: -45, translateX: 128, translateY: -72},
                { key: 'armor_body', frame: 2, rotate: -23, translateX: 72, translateY: -24 },
                { key: 'armor_body', frame: 2, rotate: 0, translateX: 0, translateY: 2},
                { key: 'armor_body', frame: 2, rotate: -23, translateX: 72, translateY: -24 },
            ],
            torso: [
                { key: 'torso', frame: 0, translateY: 2 },
                { key: 'torso', frame: 0, translateY: 0 },
                { key: 'torso', frame: 0, translateY: 0 },
                { key: 'torso', frame: 0, translateY: 0 },
            ],
            armor_body: [
                { key: 'armor_body', frame: 0, translateX: 0, translateY: 2 },
                { key: 'armor_body', frame: 0, translateX: 0, translateY: 0 },
                { key: 'armor_body', frame: 0, translateX: 0, translateY: 0 },
                { key: 'armor_body', frame: 0, translateX: 0, translateY: 0 },
            ],
            armor_body_collar: [
                { key: 'armor_body', frame: 1, translateX: 0, translateY: 2 },
                { key: 'armor_body', frame: 1, translateX: 0, translateY: 0 },
                { key: 'armor_body', frame: 1, translateX: 0, translateY: 0 },
                { key: 'armor_body', frame: 1, translateX: 0, translateY: 0 },
            ],
            arm_back: [
                { key: 'arms', frame: 1, rotate: 45, translateX: -128, translateY: 72},
                { key: 'arms', frame: 1, rotate: 23, translateX: -72, translateY: 24 },
                { key: 'arms', frame: 1, rotate: 0, translateX: 0, translateY: 2},
                { key: 'arms', frame: 1, rotate: 23, translateX: -72, translateY: 24 },
            ],
            armor_body_back_sleeve: [
                { key: 'armor_body', frame: 3, rotate: 45, translateX: -128, translateY: 72},
                { key: 'armor_body', frame: 3, rotate: 23, translateX: -72, translateY: 24 },
                { key: 'armor_body', frame: 3, rotate: 0, translateX: 0, translateY: 2},
                { key: 'armor_body', frame: 3, rotate: 23, translateX: -72, translateY: 24 },
            ],
            head: [
                { key: 'head', frame: 0, translateY: 2},
                { key: 'head', frame: 0, translateY: 0},
                { key: 'head', frame: 0, translateY: 0},
                { key: 'head', frame: 0, translateY: 0},
            ],
            ears: [
                { key: 'ears', frame: 0, translateY: 2},
                { key: 'ears', frame: 0, translateY: 0},
                { key: 'ears', frame: 0, translateY: 0},
                { key: 'ears', frame: 0, translateY: 0},
            ],
            hair_front: [
                { key: 'hair', frame: 0, translateY: 2},
                { key: 'hair', frame: 0, translateY: 0},
                { key: 'hair', frame: 0, translateY: 0},
                { key: 'hair', frame: 0, translateY: 0},
            ],
            hair_back: [
                { key: 'hair', frame: 1, translateY: 2},
                { key: 'hair', frame: 1, translateY: 0},
                { key: 'hair', frame: 1, translateY: 0},
                { key: 'hair', frame: 1, translateY: 0},
            ],
            legs: [
                { key: 'legs', frame: 1, rotate: 2, translateY: 2 },
                { key: 'legs', frame: 2, rotate: 0, translateY: 0 },
                { key: 'legs', frame: 3, rotate: 0, translateY: 0 },
                { key: 'legs', frame: 4, rotate: 0, translateY: 0 },
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
            armor_body_front_sleeve: [
                { key: 'armor_body', frame: 2},
                { key: 'armor_body', frame: 2, translateY: 4},
            ],
            torso: [
                { key: 'torso', frame: 0},
                { key: 'torso', frame: 0, translateY: 4},
            ],
            armor_body: [
                { key: 'armor_body', frame: 0},
                { key: 'armor_body', frame: 0, translateY: 4},
            ],
            armor_body_collar: [
                { key: 'armor_body', frame: 1},
                { key: 'armor_body', frame: 1, translateY: 4},
            ],
            arm_back: [
                { key: 'arms', frame: 1},
                { key: 'arms', frame: 1, translateY: 4},
            ],
            armor_body_back_sleeve: [
                { key: 'armor_body', frame: 3},
                { key: 'armor_body', frame: 3, translateY: 4},
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

    this.loadCompositeAnimation(idleAnimation);
    this.loadCompositeAnimation(walkAnimation);
    this.loadCompositeAnimation(runAnimation);

    let animationJSON = {
        anims: [
            faceIdle,
            faceRun,
            faceWalk,
        ]
    }
    this.anims.fromJSON(animationJSON);
    this.frameAnimator.frameAnimatorUpdateFramesFromJSON(this.anims, animationJSON);
    setTimeout(() => this.scene.start('default'), 1)
  }

  loadCompositeAnimation(config) {
    for (const [key, frames] of Object.entries(config.frames)) {
        let textureKey = this.compositeToTextureMap[key];
        let texture = this.textures.list[textureKey];
        let rows = texture.customData.rows;
        let columns = texture.customData.columns;
        for (var i = 0; i < rows; i++) {
            let data = {
                key: `${key}_${i}_${config.key}`,
                frameRate: config.frameRate,
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
  }

}

export default AnimationLoader;