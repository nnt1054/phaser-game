import Phaser from 'phaser';
var FromOrientationString = Phaser.Tilemaps.Parsers.FromOrientationString;
var ParseTileLayers = Phaser.Tilemaps.Parsers.Tiled.ParseTileLayers;
var ParseObjectLayers = Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers;
var MapData = Phaser.Tilemaps.MapData;
var Formats = Phaser.Tilemaps.Formats;
var Tilemap = Phaser.Tilemaps.Tilemap;


export function scaleToWidth(target, width) {
    let aspectRatio = (target.height === 0) ? 1 : target.width / target.height;
    target.displayWidth = width;
    target.displayHeight = width * (1 / aspectRatio);
}

export function setLayerCollisionTopOnly(layer, indexes) {
    indexes.forEach(index => {
        Phaser.Tilemaps.Components.SetLayerCollisionIndex(index, true, layer);
        for (var ty = 0; ty < layer.height; ty++)
        {
            for (var tx = 0; tx < layer.width; tx++)
            {
                var tile = layer.data[ty][tx];

                if (tile && (tile.index == index))
                {
                    tile.setCollision(false, false, true, false, false);
                }
            }
        }
    })
    return layer;
}

export function debugTiles(layer, index) {
    for (var ty = 0; ty < layer.height; ty++)
    {
        for (var tx = 0; tx < layer.width; tx++)
        {
            var tile = layer.data[ty][tx];

            if (tile && (tile.index == index))
            {
                console.log(tile);
            }
        }
    }
    return layer;
}

export function createTiledMap(scene, key) {
    var tilemapData = scene.cache.tilemap.get(key);
    var mapData = ParseJSONTiled(key, tilemapData.data, false);
    return new Tilemap(scene, mapData)
}

function ParseJSONTiled(name, json, insertNull) {
    var mapData = new MapData({
        width: json.width,
        height: json.height,
        name: name,
        tileWidth: json.tilewidth,
        tileHeight: json.tileheight,
        orientation: FromOrientationString(json.orientation),
        format: Formats.TILED_JSON,
        version: json.version,
        properties: json.properties,
        renderOrder: json.renderorder,
        infinite: json.infinite
    });
    mapData.layers = ParseTileLayers(json, insertNull);
    mapData.objects = ParseObjectLayers(json);
    return mapData;
}

export class ArcadeContainer extends Phaser.GameObjects.Container {

    mixins = [
        Phaser.Physics.Arcade.Components.Acceleration,
        Phaser.Physics.Arcade.Components.Angular,
        Phaser.Physics.Arcade.Components.Bounce,
        Phaser.Physics.Arcade.Components.Debug,
        Phaser.Physics.Arcade.Components.Drag,
        Phaser.Physics.Arcade.Components.Enable,
        Phaser.Physics.Arcade.Components.Friction,
        Phaser.Physics.Arcade.Components.Gravity,
        Phaser.Physics.Arcade.Components.Immovable,
        Phaser.Physics.Arcade.Components.Mass,
        Phaser.Physics.Arcade.Components.Pushable,
        Phaser.Physics.Arcade.Components.Size,
        Phaser.Physics.Arcade.Components.Velocity
    ]

    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })
        this.body = null;

        this.cursors = scene.cursors
        this.time = scene.time
        this.physics = scene.physics
    }
}

export class StaticSprite extends Phaser.Physics.Arcade.Sprite {
    // Example Usage:
    // class Spike extends StaticSprite {};

    // const spikes = this.map.createFromObjects('spikes', {
    //     gid: 71,
    //     classType: Spike,
    //     key: 'tile_spritesheet',
    //     frame: 70,
    // });
    // spikes.forEach(spike => {
    //     spike.setCollisionFromTileData(71, this.map, 'tileset');
    // });

    setCollisionFromTileData(index, map, layer) {
        this.scene.physics.add.existing(this, true);
        let tileset = map.getTileset(layer);
        let collisionGroup = tileset.getTileCollisionGroup(index);
        for (var i = 0; i < collisionGroup.objects.length; i++) {
            let collisionObject = collisionGroup.objects[i];
            this.setBodySize(collisionObject.width, collisionObject.height);
            this.setOffset(collisionObject.x, collisionObject.y);
        }
    };

}

export class CompositeSprite extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config) {
        super(scene, x, y)
        this.config = config;
        this.composition = {};
        this.currentAnim = null;

        // used for animation editing
        this.activeComposites = {};

        Object.entries(this.config).forEach(([key, texture]) => {
            this.composition[key] = scene.add.sprite(0, 0, texture);
            this.add(this.composition[key]);
            this.composition[key].setOrigin(0.5, 1);
            scene.frameAnimator.add(this.composition[key]);
        })
    }

    play(anim, ignoreIfPlaying) {
        this.currentAnim = anim;
        Object.entries(this.config).forEach(([key, texture]) => {
            const animKey = `${key}_1_${anim}`
            this.composition[key].anims.play(animKey, ignoreIfPlaying)
        })
    }

    pause() {
        Object.entries(this.config).forEach(([key, texture]) => {
            this.composition[key].anims.pause()
        })
    }

    resume() {
        Object.entries(this.config).forEach(([key, texture]) => {
            this.composition[key].anims.resume()
        })
    }

    setToFrame(frameIndex) {
        Object.entries(this.config).forEach(([key, texture]) => {
            const anim = this.composition[key].anims;
            const currentAnim = anim.currentAnim
            if (!currentAnim) return;
            const frame = currentAnim.getFrameAt(frameIndex);
            if (frame) {
                anim.resume();
                anim.setCurrentFrame(frame);
                anim.pause();
            }
        })
    }

    translateX(increment) {
        Object.entries(this.config).forEach(([key, texture]) => {
            const anims = this.composition[key].anims;
            const frame = this.composition[key].anims.currentFrame;
            if (frame) {
                frame.config.translateX += increment;
                anims.resume();
                anims.setCurrentFrame(frame);
                anims.pause();
            }
        })
    }

    setActiveCompositeStates(state) {
        this.activeComposites = state;
    }

    updateFrameConfig(configKey, increment) {
        Object.entries(this.config).forEach(([key, texture]) => {
            if (!this.activeComposites[`composite_${key}`]) return;
            const anims = this.composition[key].anims;
            const frame = this.composition[key].anims.currentFrame;
            if (frame) {
                frame.config[configKey] += increment;
                anims.resume();
                anims.setCurrentFrame(frame);
                anims.pause();
            }
        })
    }

    updateFrameKey(increment) {
        Object.entries(this.config).forEach(([key, texture]) => {
            const anims = this.composition[key].anims;
            const frame = this.composition[key].anims.currentFrame;
            if (frame) {
                var frameName = frame.frame.name += increment;
                frame.config.baseFrame += increment;
                frame.frame = this.scene.textures.get(frame.textureKey).get(frameName);
                anims.resume();
                anims.setCurrentFrame(frame);
                anims.pause();
            }
        })
    }

    toJSON() {
        let animJson = {
            key: this.currentAnim,
            frameRate: 0,
            frames: {},
        };
        Object.entries(this.config).forEach(([key, texture]) => {
            const anim = this.composition[key].anims.currentAnim;
            if (!animJson.frameRate) animJson.frameRate = anim.frameRate;
            animJson.frames[key] = anim.frames.map(frame => {
                return {
                    key: frame.textureKey,
                    frame: frame.config.baseFrame,
                    rotate: frame.config.rotate ?? 0,
                    translateX: frame.config.translateX ?? 0,
                    translateY: frame.config.translateY ?? 0,
                }
            });
        });

        let res = JSON.stringify(animJson, null, 4);
        res = res.replace(/\n                /g, ' ');
        res = res.replace(/\n            }/g, '}');
        return res;
    }
}
