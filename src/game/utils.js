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
