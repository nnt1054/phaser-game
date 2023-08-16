import store from '../../store/store';

import {
    addItemCount,
    subractItemCount,
} from '../../store/inventory';


const InventoryMixin = {

    inventory: null,

    initializeInventoryMixin(config) {
        this.inventory = new Map();

        const { inventory } = config;
        for (let item in inventory) {
            this.addItem(item, inventory[item])
        }
    },

    addItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key) || 0;
        const newItemCount = itemCount + amount;
        this.inventory.set(key, newItemCount);

        if (this.isClientPlayer) {
            store.dispatch(addItemCount({
                name: key,
                value: newItemCount - itemCount,
            }))
        }
    },

    removeItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key);
        const newItemCount = Math.max(0, itemCount - amount);
        this.inventory.set(key, newItemCount);

        if (this.isClientPlayer) {
            store.dispatch(subractItemCount({
                name: key,
                value: itemCount - newItemCount,
            }))
        }
    },

    hasItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key);
        if (itemCount && itemCount >= amount) {
            return true;
        } else {
            return false;
        }
    },

}

export default InventoryMixin;
