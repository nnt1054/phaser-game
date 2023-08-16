import { ArcadeRectangle } from '../utils';

const MovementController = {
    isDashing: false,
    isClimbing: false,

    climbing: null,
    climbingDisabled: false,

    dashTween: null,

    coyoteTime: 0,
    jumpUsed: true,
    facingRight: true,
    currentAnim: null,

    directionLockTimer: 0,

    ladderHitbox: null,

    initializeMovementController() {
        this.ladderHitbox = new ArcadeRectangle(
            this.scene, 0, 0,
            this.state.width, this.state.height / 2,
        );
        this.ladderHitbox.setOrigin(0, 1);

        this.overlappingLadders = [];
        this.previousOverlappingLadders = [];
        this.walls = [];
        this.addPlatforms();
        this.addLadders();
    },

    addPlatforms(platforms) {
        this.platformColliders = this.physics.add.collider(this, this.scene.platformGroup);
    },

    disablePlatformColliders(duration) {
        this.platformColliders.active = false;
        this.time.addEvent({
            delay: duration,
            callback: () => { this.platformColliders.active = true },
            callbackScope: this, 
        }) 
    },

    addLadders() {
        this.physics.add.overlap(this.ladderHitbox, this.scene.climbableGroup, (hitbox, ladder) => {
            this.overlappingLadders.push(ladder);
        });
    },

    clearLadders() {
        this.previousOverlappingLadders = this.overlappingLadders;
        this.overlappingLadders = [];
    },

    updateMovement(delta) {

        // ladder/climbing movement
        if (this.isClimbing) {
            const ladder = this.climbing;
            const inRange = this.overlappingLadders.find(x => x == ladder);
            if (!inRange) {
                this.stopClimbing(ladder);
            } else {
                this.x = this.climbing.body.center.x - (this.body.width / 2);
            }
        } else {
            if (this.reduxCursors.up) {
                const ladder = this.overlappingLadders.find(x => !!x);
                if (ladder) {
                    if (!this.climbingDisabled) {
                        this.startClimbing(ladder);
                    }
                }
            } else if (this.reduxCursors.down) {
                const ladder = this.overlappingLadders.find(x => !!x);
                if (ladder) {
                    if (!this.climbingDisabled) {
                        this.startClimbing(ladder);
                    }
                }
            }
        }

        if (this.isClimbing) {
            if (this.reduxCursors.up) {
                this.setVelocityY(-150)
            } else if (this.reduxCursors.down) {
                this.setVelocityY(150)
                if (this.body.onFloor()) {
                    this.stopClimbing();
                }
            } else {
                this.setVelocityY(0)
            }

            if (this.reduxCursors.jump) {
                this.executeJump();
            }
            return;
        }

        this.directionLockTimer = Math.max(0, this.directionLockTimer - delta);

        if (this.body.blocked.left || this.body.blocked.right) {
            this.stopDash();
        }

        if (this.reduxCursors.left) {
            if (this.reduxCursors.down) {
                this.setVelocityX(-75);
            } else {
                this.setVelocityX(-150);
            }
            if (this.directionLockTimer <= 0) {
                this.facingRight = false;
            }
        } else if (this.reduxCursors.right) {
            if (this.reduxCursors.down) {
                this.setVelocityX(75);
            } else {
                this.setVelocityX(150);
            }
            if (this.directionLockTimer <= 0) {
                this.facingRight = true;
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

        if (this.reduxCursors.down) {
            this.ladderHitbox.setY(this.ref_y + 4);
        } else {
            this.ladderHitbox.setY(this.ref_y);
        }
    },

    executeDownJump() {
        this.jumpUsed = true;
        this.disablePlatformColliders(250);
    },

    executeJump() {
        this.jumpUsed = true;

        if (this.isClimbing) {
            this.stopClimbing();
            this.climbingDisabled = true;
            this.time.addEvent({
                delay: 480,
                callback: () => {this.climbingDisabled = false},
                callbackScope: this, 
            })
            this.setVelocityY(-360);
        } else {
            this.setVelocityY(-480);
        }
    },

    faceTarget(gameObject) {
        if (gameObject) {
            const playerX = this.clickRect.getBounds().centerX;
            const targetX = gameObject.clickRect.getBounds().centerX;
            if (playerX < targetX) {
                this.facingRight = true;
            } else if (targetX < playerX) {
                this.facingRight = false;
            }
        }
    },

    dash(targetPosition, duration) {
        let position = targetPosition;
        let dashingRight = position > this.body.x;
        let distance = position - this.body.x;

        let rectX = dashingRight ? this.body.x + this.body.width : this.body.x;
        let rect = this.scene.add.rectangle(
            rectX, this.body.y,
            distance, this.body.height, 0xff0000, 0.5,
        );
        rect.setOrigin(0, 0);
        for (const wall of this.walls) {
            if (
                Phaser.Geom.Rectangle.Overlaps(rect.getBounds(), wall.getBounds())
            ) {
                if (dashingRight) {
                    position = Math.min(position, wall.getBounds().left - this.body.width)
                } else {
                    position = Math.max(position, wall.getBounds().right)
                }
            }
        };
        rect.destroy();
        let newDistance = position - this.body.x;
        let newDuration = Math.abs((newDistance / distance) * duration);

        this.isDashing = true;
        this.dashTween = this.scene.tweens.add({
            targets: [ this ],
            x: position,
            duration: newDuration,
            ease: 'Sine.easeIn',
        });
        return this.dashTween;
    },

    stopDash() {
        this.isDashing = false;
        if (this.dashTween) this.dashTween.stop();
        this.dashTween = null;
    },

    startClimbing(ladder) {
        this.isClimbing = true;
        this.climbing = ladder;
        this.setVelocityX(0);
        this.setGravityY(0);
        this.disablePlatformColliders(250);
    },

    stopClimbing() {
        this.isClimbing = false;
        this.climbing = null;
        this.setGravityY(1600)
    },

    isMoving() {
        return Boolean(this.body.velocity.y || this.body.velocity.x);
    }
}

export default MovementController;
