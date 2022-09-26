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

        Object.entries(this.config).forEach(([key, texture]) => {
            this.composition[key] = scene.add.sprite(0, 0, texture);
            this.add(this.composition[key]);
            this.composition[key].setOrigin(0.5, 1);
            scene.frameAnimator.add(this.composition[key]);
        })
    }

    play(anim, ignoreIfPlaying) {
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
            const frame = anim.currentAnim.getFrameAt(frameIndex);
            if (frame) {
                anim.resume();
                anim.setCurrentFrame(frame);
                anim.pause();
            }
        })
    }
}
