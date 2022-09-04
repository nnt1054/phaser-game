import {
    ArcadeContainer,
    CompositeSprite,
} from './utils'

export class Player extends ArcadeContainer {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(32, 48);
        this.setMaxVelocity(800);
        this.ref_x = this.body.width / 2;
        this.ref_y = this.body.height;

        this.name = scene.add.text(0, 0, 'Lamb Seel', {
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
            'torso': 'torso',
            'arm_front': 'arm_front',
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

    queueAbility(ability) {
        if (this.gcdQueue) return;
        if (this.gcdTimer > 1000) return;
        this.gcdQueue = ability;
    }

    update (time, delta) {
        let anim = 'idle';
        if (this.cursors.left.isDown || this.cursors.leftArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(-80);
                anim = 'run'
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
                this.character.scaleX = -Math.abs(this.character.scaleX);
            } else {
                this.setVelocityX(-140);
                anim = 'run'
                this.composite.scaleX = -Math.abs(this.composite.scaleX);
                this.character.scaleX = -Math.abs(this.character.scaleX);
            }
        } else if (this.cursors.right.isDown || this.cursors.rightArrow.isDown) {
            if (this.cursors.shift.isDown) {
                this.setVelocityX(80);
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

        if (this.body.onFloor()) {
            this.setGravityY(1600);
            if (this.cursors.down.isDown && this.cursors.space.isDown) {
                this.setVelocityY(-30);
                this.platformColliders.forEach(collider => {
                    collider.active = false;
                    this.time.addEvent({
                        delay: 250,
                        callback: () => {collider.active = true},
                        callbackScope: this, 
                    })
                })
            } else if (this.cursors.space.isDown) {
                this.setVelocityY(-480);
            } else if (this.cursors.down.isDown) {
                anim = 'idle'
                this.setVelocityX(0);
            }
        } else {
            anim = 'run'
            if (this.body.velocity.y >= 0) {
                this.setGravityY(800);
            }
        }

        if (this.gcdTimer > 0) {
            this.gcdTimer = Math.max(0, this.gcdTimer - delta)
        }

        if (this.gcdQueue && this.gcdTimer == 0) {
            const ability = this.gcdQueue;
            ability.execute(this);
            this.gcdTimer += ability.cooldown;
            this.gcdQueue = null;
        }

        this.composite.sort('depth');

        if (!this.isAttacking) {
            this.character.play(anim, true);
        }
    }

    autoZoom(zoom) {
        this.name.setScale(1 / zoom);
    }
}
