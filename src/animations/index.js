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
import headband from '../assets/spritesheets/headbands.png';

// armor spritesheets
import armor_body from '../assets/spritesheets/armor_body.png';

import idleJson from './idle.json';
import walkJson from './walk.json';
import runJson from './run.json';
import jumpJson from './jump.json';
import jumpIdleJson from './jumpIdle.json';
import crouchJson from './crouch.json';
import flossJson from './floss.json';


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
        'pants': pants,
        'headband': headband,
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
    const playerTextureMap = {
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
        headband: 'headband',
        armor_body: 'armor_body',
        armor_body_collar: 'armor_body',
        armor_body_front_sleeve: 'armor_body',
        armor_body_back_sleeve: 'armor_body',
    };

    loadCompositeAnimation(scene, idleJson, playerTextureMap);
    loadCompositeAnimation(scene, walkJson, playerTextureMap);
    loadCompositeAnimation(scene, runJson, playerTextureMap);
    loadCompositeAnimation(scene, jumpJson, playerTextureMap);
    loadCompositeAnimation(scene, jumpIdleJson, playerTextureMap);
    loadCompositeAnimation(scene, crouchJson, playerTextureMap);
    loadCompositeAnimation(scene, flossJson, playerTextureMap);
}


function loadCompositeAnimation(scene, config, playerTextureMap) {
    for (const [key, frames] of Object.entries(config.frames)) {
        let textureKey = playerTextureMap[key];
        let texture = scene.textures.list[textureKey];
        let rows = texture.customData.rows;
        let columns = texture.customData.columns;
        for (var i = 0; i < rows; i++) {
            let data = {
                key: `${key}_${i}_${config.key}`,
                repeat: config.repeat ?? 0,
                frameRate: config.frameRate,
                frames: frames.map(frame => {
                    return {
                        key: textureKey,
                        baseFrame: frame.frame,
                        frame: (i * columns) + frame.frame,
                        translateX: frame.translateX,
                        translateY: frame.translateY,
                        rotate: frame.rotate,
                        depth: frame.depth ?? 0,
                        scale: frame.scale ?? 1,
                    }
                }),
            }
            scene.anims.create(data);
            scene.frameAnimator.frameAnimatorUpdateFrames(scene.anims, data);   
        }
    }
}
