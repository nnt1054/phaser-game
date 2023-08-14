import store from '../../store/store';

import {
    updateEnemyList,
} from '../../store/enemyList';


const EnemyListMixin = {

    hasEnemyList: true,
    enemyList: [],
    enemyAggroMap: new Map(),

    initializeEnemyListMixin() {
        this.enemyList = [];
        this.enemyAggroMap = new Map();
    },

    addToEnemyList: function(enemy, aggro) {
        if (!this.enemyList.includes(enemy)) {
            this.enemyList.push(enemy);
            this.enemyAggroMap.set(enemy, aggro);
            this.updateEnemyListStore();
        }
    },

    removeEnemyFromEnemyList: function(enemy) {
        this.enemyList = this.enemyList.filter(item => !Object.is(item, enemy));
        this.updateEnemyListStore();
    },

    updateEnemyListStore: function() {
        const newState = this.enemyList.map(enemy => {
            return {
                name: enemy.displayName,
                isTarget: Object.is(enemy, this.currentTarget),
            }
        })
        if (this.isClientPlayer) {
            store.dispatch(updateEnemyList(newState));            
        }
    },
 
    targetEnemyFromEnemyList: function(index) {
        const enemy = this.enemyList[index]
        if (!enemy) return;

        this.targetObject(enemy);
        this.updateEnemyListStore();
    },

    cycleTargetFromEnemyList: function(isReverse=false) {
        if (this.enemyList.length === 0) return;

        let index;
        if (this.currentTarget) {

            const prevIndex = this.enemyList.findIndex(
                enemy => Object.is(enemy, this.currentTarget)
            );

            if (isReverse) {
                index = prevIndex - 1
            } else {
                index = prevIndex + 1
            }

            if (index >= this.enemyList.length) {
                index = 0;
            } else if (index < 0) {
                index = this.enemyList.length - 1
            }

        } else {
            index = 0;
        }

        const enemy = this.enemyList[index];
        if (!enemy) return;

        this.targetObject(enemy);
        this.updateEnemyListStore();
    },
}

export default EnemyListMixin;
