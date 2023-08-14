const AnimationController = {

    setCharacterDirection(facingRight) {  
        this.facingRight = facingRight;
        this.updateCharacterDirection();
    },

    updateCharacterDirection() {
        if (this.facingRight) {
            this.character.scaleX = Math.abs(this.character.scaleX);
        } else {
            this.character.scaleX = -Math.abs(this.character.scaleX);
        }
    },

    updateAnimationState(delta) {
        let anim = 'idle';

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
        }

        if (this.isClimbing) {
            anim = 'crouch';
        }

        this.updateCharacterDirection();
        this.currentAnim = anim;

        if (!this.paused) {
            this.character.play(this.currentAnim, true);
        }
    },
}

export default AnimationController;
