import store from '../../store/store';

import {
    updateEquipment,
} from '../../store/inventory';

import {
    updatePreview
} from '../../store/characterPreview';

import helmets from '../equipment/helmets';


const EquipmentMixin = {
    hasEquipment: true,

    equipped: {},

    initializeEquipmentMixin() {
        this.equipped = {
            weapon: null,
            helmet: null,
            armor: null,
            pants: null,
        };

        this.equipHelmetFromId(this.state.equipment.helmet);

        if (this.hasJob) {
            this.setJob(this.equipped.helmet.job);
        }
    },

    equipHelmetFromId(id) {
        const helmet = helmets[id];
        if (helmet) {
            this.equipHelmet(helmet);
        }
    },

    equipHelmet: function(item) {
        this.equipped.helmet = item;
        this.updateCharacterSprite(item);
        this.updateEquipmentStore();
    },

    equipArmor: function(item) {
        this.equipped.armor = item;
        this.updateCharacterSprite(item);
        this.updateEquipmentStore();
    },

    updateCharacterSprite: function(item) {
        if (item) {
            this.character.updateIndexes(item.sprites);
        } else {
            Object.entries(this.equipped).forEach(([key, item]) => {
                if (item) this.character.updateIndexes(item.sprites);
            });
        }
        this.updateCharacterPreview();
    },

    updateEquipmentStore: function() {
        if (this.isClientPlayer) {
            store.dispatch(updateEquipment({
                weapon: this.equipped.weapon?.name,
                helmet: this.equipped.helmet?.name,
                armor: this.equipped.armor?.name,
                pants: this.equipped.pants?.name,
            }))
        }
    },

    updateCharacterPreview: function() {
        if (this.isClientPlayer) {
            store.dispatch(updatePreview(this.character.indexes));
        }
    },

}

export default EquipmentMixin;
