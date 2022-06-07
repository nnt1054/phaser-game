import Phaser from 'phaser';
var GetValue = Phaser.Utils.Objects.GetValue;

class FrameAnimator extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
    }

    handler(animation, animationFrame, gameObject) {
        let index = animationFrame.index;
        let ref_x = gameObject.parentContainer.ref_x;
        let ref_y = gameObject.parentContainer.ref_y;
        if (animationFrame.config) {
            let config = animationFrame.config;
            gameObject.setPosition(config.translateX, config.translateY);
            gameObject.setAngle(config.rotate);
        } else {
            gameObject.setPosition(0, 0);
            gameObject.setAngle(0);
        }
    }

    add(gameObject) {
        // include ANIMATION_START for single frame animations
        gameObject.on(Phaser.Animations.Events.ANIMATION_START, this.handler, this);
        gameObject.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.handler, this);
    }

    frameAnimatorUpdateFrames(manager, config) {
        var animation = manager.get(config.key);
        var len = animation.frames.length;

        var frame;
        var frameConfig;

        for (var i = 0; i < len; i++)
        {
            frame = animation.frames[i];
            frameConfig = config.frames[i];
            frame.config = {
                translateX: GetValue(frameConfig, 'translateX', 0),
                translateY: GetValue(frameConfig, 'translateY', 0),
                rotate: GetValue(frameConfig, 'rotate', 0),
                scale: GetValue(frameConfig, 'rotate', 1),
            }
        }

        return animation;
    }

    frameAnimatorUpdateFramesFromJSON(manager, data) {
        for (var i = 0; i < data.anims.length; i++)
        {
            this.frameAnimatorUpdateFrames(manager, data.anims[i]);
        }
    }
}

export default FrameAnimator;