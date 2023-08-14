import store from '../../store/store';

import {
    setPlayerCurrentHealth,
    setPlayerHealth,
} from '../../store/playerHealth';

import {
    setTargetCurrentHealth,
    setCotargetCurrentHealth,
    setTargetHealth,
    setCotargetHealth,
} from '../../store/targetInfo';


const HealthMixin = {

    hasHealth: true,
    health: 100,
    maxHealth: 100,
    // hitboxRect: null,

    setHealth(health, maxHealth) {
        this.currentHealth = health;
        this.maxHealth = maxHealth;
        this.updateHealthStore();
    },

    setMaxHealth(value) {
        this.maxHealth = value;
        this.updateHealthStore();
    },

    setCurrentHealth: function(value, generateText) {
        let diff = this.health - value;
        let health = Math.max(value, 0);
        health = Math.min(health, this.maxHealth);
        this.health = health;
        this.updateHealthStore();

        if (generateText) {
            if (diff > 0) {
                this.generateDamageNumbers(diff);
            } else if (diff < 0) {
                this.generateHealNumbers(-diff);
            }
        }
    },

    increaseHealth: function(value, delay) {
        if (!delay) delay = 0;
        this.health = Math.min(this.health + value, this.maxHealth);
        this.scene.time.delayedCall(delay, () => {
            this.generateHealNumbers(value)
        })
        this.updateHealthStore();
    },

    reduceHealth: function(value, delay) {
        if (!delay) delay = 0;
        this.health = Math.max(this.health - value, 0);

        this.scene.time.delayedCall(delay, () => {
            this.generateDamageNumbers(value)
            this.updateHealthStore();
            if (this.health <= 0) {
                if (this.handleDeath) {
                    this.handleDeath();
                }
            }     
        })
    },

    updateHealthStore: function() {
        if (this.healthBar) {
            const percentHealth = this.health / this.maxHealth;
            this.healthBar.width = this.healthBarWidth * percentHealth;

            if (percentHealth >= 1) {
                this.healthBar.setVisible(false);
                this.healthBarUnderlay.setVisible(false);
            } else {
                this.healthBar.setVisible(true);
                this.healthBarUnderlay.setVisible(true);
            }
        }

        if (this.isClientPlayer) {
            store.dispatch(
                setPlayerHealth({
                    currentHealth: this.health,
                    maxHealth: this.maxHealth,
                })
            )
        }

        if (this.isTargeted) {
            store.dispatch(
                setTargetHealth({
                    currentHealth: this.health,
                    maxHealth: this.maxHealth,
                })
            )
        }

        if (this.isCotargeted) {
            store.dispatch(
                setCotargetHealth({
                    currentHealth: this.health,
                    maxHealth: this.maxHealth,
                })
            )
        }
    },

    generateDamageNumbers(value) {
        let text = this.scene.add.text(this.x, this.y, `-${ value }`, {
            fontFamily: 'Comic Sans MS',
            fontSize: '24px',
            fill: '#F00',
            stroke: '#000',
            strokeThickness: 8,
        });
        text.setScale(1 / this.scene.zoom);
        let tween = this.scene.tweens.add({
            targets: [ text ],
            y: this.y - 32,
            duration: 500,
            hold: 500,
            ease: 'Sine.easeOut',
        });
        tween.on('complete', () => {
            text.destroy();
        })
    },

    generateHealNumbers(value) {
        let text = this.scene.add.text(this.x, this.y, `+${ value }`, {
            fontFamily: 'Comic Sans MS',
            fontSize: '24px',
            fill: '#0F0',
            stroke: '#000',
            strokeThickness: 8,
        });
        text.setScale(1 / this.scene.zoom);
        let tween = this.scene.tweens.add({
            targets: [ text ],
            y: this.y - 32,
            duration: 500,
            hold: 500,
            ease: 'Sine.easeOut',
        });
        tween.on('complete', () => {
            text.destroy();
        })
    },

    receiveDamage(source, damage, type, delay) {
        const isPhysical = type == 'physical';
        const isMagical = type == 'magical';

        for (const buff of this._buffs) {
            if (buff.modifyDamageReceived) {
                damage = buff.modifyDamageReceived(damage);
            }

            if (isPhysical && buff.modifyPhysicalDamageReceived) {
                damage = buff.modifyPhysicalDamageReceived(damage);
            }

            if (isMagical && buff.modifyMagicalDamageReceived) {
                damage = buff.modifyMagicalDamageReceived(damage);
            }
        };

        damage = Math.max(0, Math.ceil(damage));
        this.reduceHealth(damage, delay);
        if (this.hasAggro) {
            this.addAggro(source, damage);
        }
    },
}

export default HealthMixin;
