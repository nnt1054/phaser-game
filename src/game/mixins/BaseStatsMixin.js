import { BASE_STATS } from '../../constants';


const BaseStatsMixin = {

    baseStrength: 1,
    baseIntelligence: 1,
    baseHealth: 1,
    baseMana: 1,

    updateBaseStats() {
        // TODO: base stats will also include class modifiers
        const level = this.currentLevel;

        this.baseStrength = BASE_STATS.at(level);
        this.baseIntelligence = BASE_STATS.at(level);

        this.baseHealth = Math.ceil(100 * BASE_STATS.at(level));
        this.setMaxHealth(this.baseHealth);

        this.baseMana = Math.ceil(100 * BASE_STATS.at(level));
    },

    getStrengthStat: function() {
        return this.baseStrength
    },

    getIntelligenceStat: function() {
        return this.baseIntelligence
    },
}

export default BaseStatsMixin;
