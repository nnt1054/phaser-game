import React, { Component } from "react";
import Phaser from 'phaser';

import defaultScene from './scenes/default.js'

var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.ScaleModes.NONE,
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
    parent: 'phaser-container'
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
