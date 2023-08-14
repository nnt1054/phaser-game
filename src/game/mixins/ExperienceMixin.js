import store from '../../store/store';

import {
    updateExperience,
} from '../../store/playerState';


const ExperienceMixin = {
    hasExperience: true,

    currentExperience: 0,
    maxExperience: 394,

    jobExperienceMap: {},

    initializeExperienceMixin() {
        this.currentExperience = 0;
        this.jobExperienceMap = {
            'TMP': 0,
            'HEAL': 0,
            'MELEE': 0,
            'SPELL': 0,
            'HUNTER': 0,
            'KNIGHT': 0,
        };
        this.setLevel(this.getExperienceLevel());
        this.updateExpStore();
    },

    refreshExperience() {
        this.currentExperience = this.jobExperienceMap[this.currentJob.name];
        this.setLevel(this.getExperienceLevel());
        this.updateExpStore();
    },

    gainExperience(exp) {
        if (this.hasJob) {
            const updatedExp = Math.min(this.jobExperienceMap[this.currentJob.name] + exp, this.maxExperience)
            this.jobExperienceMap[this.currentJob.name] = updatedExp;
            this.currentExperience = updatedExp;
        } else {
            this.currentExperience += exp;
            this.currentExperience = Math.min(this.currentExperience, this.maxExperience);
        }

        this.updateExperienceLevel();
        this.updateExpStore();
    },

    updateExperienceLevel() {
        if (this.getExperienceLevel() > this.currentLevel) {
            this.handleLevelUp();
        }
    },

    updateExpStore() {
        if (this.isClientPlayer) {
            const maxExp = this.getNextLevelRequiredExperience(this.currentLevel);
            const baseExp = this.getNextLevelRequiredExperience(this.currentLevel - 1);
            const expProgress = (this.currentExperience - baseExp) / (maxExp - baseExp);
            store.dispatch(
                updateExperience({
                    currentExp: this.currentExperience - baseExp,
                    maxExp: maxExp - baseExp,
                    expProgress: expProgress,
                })
            );
        }
    },

    getNextLevelRequiredExperience(level) {
        switch(level) {
            case 0:
                return 0;
            case 1:
                return 15;
            case 2:
                return 32;
            case 3:
                return 52;
            case 4:
                return 74;
            case 5:
                return 101;
            case 6:
                return 131;
            case 7:
                return 166;
            case 8:
                return 205;
            case 9:
                return 251;
            case 10:
                return this.maxExperience;
            return this.maxExperience;
        }
    },

    getExperienceLevel() {
        const inLevelRange = (min, max) => {
            return min <= this.currentExperience && this.currentExperience < max;
        }

        switch(true) {
            case inLevelRange(0, 15):
                return 1;
            case inLevelRange(15, 32):
                return 2;
            case inLevelRange(32, 52):
                return 3;
            case inLevelRange(52, 74):
                return 4;
            case inLevelRange(74, 101):
                return 5;
            case inLevelRange(101, 131):
                return 6;
            case inLevelRange(131, 166):
                return 7
            case inLevelRange(166, 205):
                return 8;
            case inLevelRange(205, 251):
                return 9;
            case inLevelRange(251, 304+1):
                return 10;
        }

        return 1;
    },

    handleLevelUp() {
        console.log('Level Up!');
        this.setLevel(this.getExperienceLevel());
        this.setCurrentHealth(this.maxHealth);
    },
};

export default ExperienceMixin;
