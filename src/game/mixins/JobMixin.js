import store from '../../store/store';

import {
    updateJob,
} from '../../store/playerState';

import jobMap from '../jobs';


const JobMixin = {
    hasJob: true,
    currentJob: null,

    setJob(key) {
        this.unapplyAllBuffsFromSource();
        const job = jobMap[key]
        this.currentJob = job;
        this.updateJobStore();
        if (this.hasExperience) {
            this.refreshExperience();
        };
        this.updateCooldownsStore();
    },

    updateJobStore() {
        store.dispatch(updateJob(this.currentJob.name));
    }
};

export default JobMixin;
