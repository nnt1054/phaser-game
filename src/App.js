import React, { Component } from "react";
import Phaser from 'phaser';

import defaultScene from './scenes/default.js'

class FBFPlugin extends Phaser.Plugins.BasePlugin {

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
        if (animationFrame.fbfconfig) {
            let config = animationFrame.fbfconfig;
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
}


var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        }
    },
    scene: defaultScene,
    parent: 'phaser-container',
    plugins: {
        global: [{
            key: 'fbfplugin',
            plugin: FBFPlugin,
            start: true
        }]
    }
};

class App extends Component {
  componentDidMount() {
    const game = new Phaser.Game(config)
  }

  render() {
    return <div id="phaser-container" />;
  }
}

export default App;
