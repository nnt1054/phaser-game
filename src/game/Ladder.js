import {
    ArcadeContainer,
    CompositeSprite,
} from './utils'

import store from '../store/store';
import {
    clearInputQueues,
    clearQueuedAbility,
    setGCD,
    clearSystemAction,
    setRefreshCooldown,
} from '../store/playerState';
import {
    setTarget,
    removeTarget,
    setCotarget,
    setTargetCast,
    cancelTargetCast,
} from '../store/targetInfo';
import {
    HealthMixin,
    TargetMixin,
    BuffMixin,
    EquipmentMixin,
    InventoryMixin,
    EnemyListMixin,
    CastingMixin,
    CooldownMixin,
} from './mixins';
import {
    setAlert,
} from '../store/alert';

export class Ladder extends ArcadeContainer {

    mixins = []

    constructor(scene, x, y, height, width, children) {
        super(scene, x, y, children);
        this.mixins.forEach(mixin => {
            Object.assign(this, mixin);
        })

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(height, width);

        this.ladderRect = scene.add.rectangle(
            0, 0, height, width,
            0x0000ff, 0.5,
        );
        this.ladderRect.setOrigin(0, 0);

        this.add([
            this.ladderRect,
        ]);
    }

}