import Phaser from 'phaser';
var GetValue = Phaser.Utils.Objects.GetValue;

class FrameAnimator extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        var eventEmitter = this.game.events;
        // eventEmitter.on('destroy', this.destroy, this);

        this.game.textures.on(
            Phaser.Textures.Events.ADD,
            this.setCustomData,
        )
    }

    setCustomData(key, texture) {
        var width = texture.source[0].width;
        var height = texture.source[0].height;

        // need to assume margin and spacing are 0
        var margin = 0;
        var spacing = 0;
        var frameWidth = 512;
        var frameHeight = 512;

        var rows = Math.floor((height - margin + spacing) / (frameHeight + spacing));
        var columns = Math.floor((width - margin + spacing) / (frameWidth + spacing));

        texture.customData['rows'] = rows;
        texture.customData['columns'] = columns;
    }

    handler(animation, animationFrame, gameObject) {
        let index = animationFrame.index;
        let ref_x = gameObject.parentContainer.ref_x;
        let ref_y = gameObject.parentContainer.ref_y;
        let config = animationFrame.config;
        if (config) {
            gameObject.setPosition(config.translateX, config.translateY);
            gameObject.setAngle(config.rotate);
            gameObject.setDepth(config.depth);
            gameObject.setScale(config.scale);
        }

        if (gameObject.parentContainer && gameObject.parentContainer.type === 'Container') {
            // todo: optimize to run once per frame
            gameObject.parentContainer.sort('depth');
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
                baseFrame: GetValue(frameConfig, 'baseFrame', 0),
                translateX: GetValue(frameConfig, 'translateX', 0),
                translateY: GetValue(frameConfig, 'translateY', 0),
                rotate: GetValue(frameConfig, 'rotate', 0),
                scale: GetValue(frameConfig, 'scale', 1),
                depth: GetValue(frameConfig, 'depth', 0),
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