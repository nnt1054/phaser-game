import Phaser from 'phaser';

import faces_demo from '../assets/faces_demo.png';

// base spritesheets
import arms from '../assets/spritesheets/arms.png';
import torso from '../assets/spritesheets/torso.png';
import ears from '../assets/spritesheets/ears.png';
import hair from '../assets/spritesheets/hair.png';
import head from '../assets/spritesheets/head.png';
import legs from '../assets/spritesheets/legs.png';

// armor spritesheets
import armor_body from '../assets/spritesheets/armor_body.png';

import idleJson from './idle.json';
import walkJson from './walk.json';
import runJson from './run.json';


export function animationPreload(scene) {
  	let spritesheets_512 = {
        'face': faces_demo,
  		'legs': legs,
  		'arms': arms,
  		'torso': torso,
  		'head': head,
  		'ears': ears,
  		'hair': hair,
        'armor_body': armor_body,
  	};
  	for (const [key, source] of Object.entries(spritesheets_512)) {
	    scene.load.spritesheet(key, source, {
	        frameWidth: 512,
	        frameHeight: 512,
	    });
  	};
}

export function animationCreate(scene) {
    scene.frameAnimator = scene.plugins.get('frameAnimator');
    scene.compositeToTextureMap = {
        arm_front: 'arms',
        torso: 'torso',
        arm_back: 'arms',
        head: 'head',
        ears: 'ears',
        hair_front: 'hair',
        hair_back: 'hair',
        face: 'face',
        legs: 'legs',
        armor_body: 'armor_body',
        armor_body_collar: 'armor_body',
        armor_body_front_sleeve: 'armor_body',
        armor_body_back_sleeve: 'armor_body',
    };

    let faceIdle = {
        key: `face_1_idle`,
        frameRate: 1,
        frames: [
            { key: 'face', frame: 0},
            { key: 'face', frame: 0, translateY: 4},
        ],
    };

    let faceWalk = {
        key: `face_1_walk`,
        frameRate: 6,
        frames: [
            { key: 'face', frame: 0, translateY: 2},
            { key: 'face', frame: 0, translateY: 0},
            { key: 'face', frame: 0, translateY: 0},
            { key: 'face', frame: 0, translateY: 0},
        ]
    };

    let faceRun = {
        key: `face_1_run`,
        frameRate: 12,
        frames: [
            { "key": "face", "frame": 0, "rotate": 12, "translateX": 2, "translateY": -3},
            { "key": "face", "frame": 0, "rotate": 13, "translateX": 0, "translateY": 2},
            { "key": "face", "frame": 0, "rotate": 12, "translateX": 0, "translateY": 4},
            { "key": "face", "frame": 0, "rotate": 12, "translateX": 3, "translateY": -4},
            { "key": "face", "frame": 0, "rotate": 13, "translateX": 0, "translateY": 3},
            { "key": "face", "frame": 0, "rotate": 12, "translateX": -2, "translateY": 4}
        ]
    };

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

    loadCompositeAnimation(scene, idleJson);
    loadCompositeAnimation(scene, walkJson);
    loadCompositeAnimation(scene, runJson);

    let animationJSON = {
        anims: [
            faceIdle,
            faceRun,
            faceWalk,
        ]
    };
    scene.anims.fromJSON(animationJSON);
    scene.frameAnimator.frameAnimatorUpdateFramesFromJSON(scene.anims, animationJSON);
}


function loadCompositeAnimation(scene, config) {
    for (const [key, frames] of Object.entries(config.frames)) {
        let textureKey = scene.compositeToTextureMap[key];
        let texture = scene.textures.list[textureKey];
        let rows = texture.customData.rows;
        let columns = texture.customData.columns;
        for (var i = 0; i < rows; i++) {
            let data = {
                key: `${key}_${i}_${config.key}`,
                frameRate: config.frameRate,
                frames: frames.map(frame => {
                    return {
                        key: textureKey,
                        baseFrame: frame.frame,
                        frame: (i * columns) + frame.frame,
                        translateX: frame.translateX,
                        translateY: frame.translateY,
                        rotate: frame.rotate,
                    }
                }),
            }
            scene.anims.create(data);
            scene.frameAnimator.frameAnimatorUpdateFrames(scene.anims, data);   
        }
    }
}
