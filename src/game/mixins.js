import store from '../store/store';
import {
    setPlayerCurrentHealth
} from '../store/playerHealth';
import {
    setGCD,
    setCast,
    setCooldowns,
    setComboAction,
} from '../store/playerState';
import {
    setTarget,
    removeTarget,
    setTargetCurrentHealth,
    setCotarget,
    removeCotarget,
    setCotargetCurrentHealth,
    updateTargetStatuses,
    setTargetCast,
    cancelTargetCast,
} from '../store/targetInfo';
import {
    setDialogue,
    clearDialogue,
} from '../store/dialogueBox';
import {
    setAlert,
} from '../store/alert';
import {
    menus,
    openMenu,
    closeMenu,
} from '../store/menuStates';
import {
    updatePreview
} from '../store/characterPreview';
import {
    addItemCount,
    subractItemCount,
    updateEquipment,
} from '../store/inventory';
import {
    updateEnemyList,
} from '../store/enemyList';
import {
    updateStatuses,
} from '../store/statusInfo';

export const HealthMixin = {

    hasHealth: true,
    health: 100,
    maxHealth: 100,
    // hitboxRect: null,

    setCurrentHealth: function(value, generateText) {
        let diff = this.health - value;
        let health = Math.max(value, 0);
        health = Math.min(health, this.maxHealth);
        this.health = health;
        this.updateStore();

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
        setTimeout(() => this.generateHealNumbers(value), delay);
        this.updateStore();
    },

    reduceHealth: function(value, delay) {
        if (!delay) delay = 0;
        this.health = Math.max(this.health - value, 0);
        setTimeout(() => {
            this.generateDamageNumbers(value)
            this.updateStore();
            if (this.health <= 0) {
                if (this.handleDeath) {
                    this.handleDeath();
                }
            }
        }, delay);
    },

    updateStore: function() {
        if (this.isPlayer) {
            store.dispatch(
                setPlayerCurrentHealth(this.health)
            )
        }

        if (this.isTargeted) {
            store.dispatch(
                setTargetCurrentHealth(this.health)
            )
        }

        if (this.isCotargeted) {
            store.dispatch(
                setCotargetCurrentHealth(this.health)
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
}


// TargetMixin defines clientside behavior when targeted by the Player
// note: methods are NOT meant to be used when NPC targets a gameObject
export const TargetMixin = {

    currentTarget: null,
    isTargetable: true,

    // isTargeted and isCotargeted are in relation to the Player
    isTargeted: false,
    isCotargeted: false,

    // clickRect: null,

    target: function() {
        this.isTargeted = true;
        if (this.currentTarget) {
            this.currentTarget.isCotargeted = true;
        }
        this.name.text = `> ${ this.displayName } <`;
        this.name.style.setFontSize('18px');
        if (this.isPlayer) {
            this.name.style.setFill('lightblue');
        } else if (this.isEnemy) {
            this.name.style.setFill('pink');
        } else {
            this.name.style.setFill('yellow');
        }
    },

    untarget: function() {
        this.isTargeted = false;
        if (this.currentTarget) {
            this.currentTarget.isCotargeted = false;
        }
        this.name.text = this.displayName;
        this.name.style.setFontSize('16px');
        this.name.style.setFill('white');
    },

    targetObject: function(gameObject) {
        if (gameObject.isTargetable) {
            if (this.isPlayer) {
                if (this.currentTarget) this.currentTarget.untarget();
                this.currentTarget = gameObject;
                gameObject.target();

                const backgroundColor = gameObject.isEnemy ? 'pink' : 'lightblue';
                if ('health' in gameObject) {
                    store.dispatch(
                        setTarget({
                            targetName: gameObject.displayName,
                            currentHealth: gameObject.health,
                            maxHealth: gameObject.maxHealth,
                            backgroundColor: backgroundColor,
                        })
                    )
                } else {
                    store.dispatch(
                        setTarget({
                            targetName: gameObject.displayName,
                            currentHealth: null,
                            maxHealth: null,
                        })
                    )
                }

                if (gameObject.hasBuffs) {
                    gameObject.updateStatusInfoStore();
                }

                const cotarget = gameObject.currentTarget;
                if (cotarget) {
                    const cotargetBackgroundColor = cotarget.isEnemy ? 'pink' : 'lightblue';
                    if ('health' in cotarget) {
                        store.dispatch(
                            setCotarget({
                                targetName: cotarget.displayName,
                                currentHealth: cotarget.health,
                                maxHealth: cotarget.maxHealth,
                                backgroundColor: cotargetBackgroundColor,
                            })
                        )
                    } else {
                        store.dispatch(
                            setCotarget({
                                targetName: cotarget.displayName,
                                currentHealth: null,
                                maxHealth: null,
                            })
                        )
                    }
                }
                
                if (this.hasEnemyList) {
                    this.updateEnemyListStore();
                }

                if (gameObject.hasCasting && gameObject.casting) {
                    store.dispatch(setTargetCast({
                        label: gameObject.casting.name,
                        progress: gameObject.castingTimer,
                        duration: gameObject.casting.castTime,
                    }));
                } else {
                    store.dispatch(setTargetCast({
                        label: '',
                        progress: 0,
                        duration: 0,
                    }));
                }

            } else {
                this.currentTarget = gameObject;
                // if this is currently targetted by player; gameObject is now cotargeted
                if (this.isTargeted) {
                    const cotarget = gameObject;
                    cotarget.isCotargeted = true;
                    const cotargetBackgroundColor = cotarget.isEnemy ? 'pink' : 'lightblue';
                    if ('health' in cotarget) {
                        store.dispatch(
                            setCotarget({
                                targetName: cotarget.displayName,
                                currentHealth: cotarget.health,
                                maxHealth: cotarget.maxHealth,
                                backgroundColor: cotargetBackgroundColor,
                            })
                        )
                    } else {
                        store.dispatch(
                            setCotarget({
                                targetName: cotarget.displayName,
                                currentHealth: null,
                                maxHealth: null,
                            })
                        )
                    }
                }
            }
        }
    },

    untargetObject: function(gameObject) {
        if (this.currentTarget) {
            if (this.isPlayer) {
                this.currentTarget.untarget();
                store.dispatch(
                    removeTarget()
                );
            } else if (this.isTargeted) {
                this.currentTarget.isCotargeted = false;
                store.dispatch(
                    removeCotarget()
                );
            }

            this.currentTarget = null;
            if (this.isPlayer && this.hasEnemyList) {
                this.updateEnemyListStore();
            }

            store.dispatch(setTargetCast({
                label: '',
                progress: 0,
                duration: 0,
            }));
        }
    },
}


export const DialogueMixin = {

    hasDialogue: true,
    messages: {},
    currentMessage: null,
    interactionRect: null,

    isPlayerInRange: function(player) {
        return Phaser.Geom.Rectangle.Overlaps(
            player.hitboxRect.getBounds(),
            this.interactionRect.getBounds(),
        )
    },

    startDialogue: function(player) {
        if (player.dialogueTarget) {
            // do nothing if already in dialogue
        } else if (this.isPlayerInRange(player) && player.body.onFloor()) {
            player.dialogueTarget = this;
            this.displayMessage(player, this.messages['001']);
        } else {
            store.dispatch(setAlert('Target is not in range.'));
        }
    },

    displayMessage: function(player, message) {
        this.currentMessage = message;
        if (this.currentMessage.type == 'simple') {
            store.dispatch(openMenu(menus.dialogue));
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: message.messages,
            }));
            player.dialogueComplete = false;
        } else if (this.currentMessage.type == 'question') {
            store.dispatch(openMenu(menus.dialogue));
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: [message.message],
                options: message.options,
            }));
            player.dialogueComplete = false;
        } else {
            this.endDialogue(player);
        }
    },

    completeDialogue: function(player, optionIndex) {
        if (this.currentMessage) {
            if (this.currentMessage.type == 'simple') {
                if (this.currentMessage.next) {
                    const nextMessage = this.messages[this.currentMessage.next];
                    this.displayMessage(player, nextMessage);
                } else {
                    this.endDialogue(player);
                }
            } else if (this.currentMessage.type == 'question') {
                const option = this.currentMessage.options[optionIndex];
                const nextMessage = this.messages[option.next];
                this.displayMessage(player, nextMessage);
            } else {
                this.endDialogue(player);
            }
        } else {
            this.endDialogue(player);
        }
    },

    endDialogue: function(player) {
        player.dialogueTarget = null;
        player.dialogueComplete = true;
        store.dispatch(clearDialogue());
        store.dispatch(closeMenu());
    },

}


export const AggroMixin = {
    hasAggro: true,

    highestAggro: null,
    aggroMap: new Map(),

    addAggro: function(gameObject, amount) {
        if (amount == null) amount = 1;
        const currentAggro = this.aggroMap.get(gameObject) || 0;
        const newAggro = currentAggro + amount;
        this.aggroMap.set(gameObject, newAggro);

        if (this.highestAggro == null) {
            this.highestAggro = gameObject;
        } else {
            const currentHighestAggro = this.aggroMap.get(gameObject) || 0;
            if (newAggro > currentHighestAggro) {
                this.highestAggro = gameObject;
            }
        }

        if (gameObject.hasEnemyList) {
            gameObject.addToEnemyList(this);
        }
    },

    resetAggro: function() {
        this.highestAggro = null;
        this.aggroMap = new Map();
    }
}


export const BuffMixin = {
    hasBuffs: true,
    _buffs: [],

    updateStatusInfoStore() {
        const buffs = this._buffs.map(buff => {
            return {
                key: buff.key,
                duration: buff.timer,
                icon: buff.icon,
            }
        })

        if (this.isPlayer) {
            store.dispatch(updateStatuses(buffs));
        }

        if (this.isTargeted) {
            store.dispatch(updateTargetStatuses(buffs));
        }
    },

    applyBuff: function(buffClass, source) {
        const buff = buffClass(this, source);
        buff.apply();
        this._buffs.push(buff);
        this.updateStatusInfoStore();
    },

    updateBuffs: function(delta) {
        let shouldUpdate = false;

        for (const buff of this._buffs) {
            buff.timer = Math.max(0, buff.timer - delta);
            if (buff.timer <= 0) {
                buff.unapply(this);
                shouldUpdate = true;
            }
        };

        this._buffs = this._buffs.filter((buff) => buff.timer > 0);
        if (shouldUpdate) {
            this.updateStatusInfoStore();
        }

        for (const buff of this._buffs) {
            buff.update(delta);
        };
    },

    clearBuffs: function() {
        this._buffs = [];
        this.updateStatusInfoStore();
    },
}


export const EquipmentMixin = {
    hasEquipment: true,

    equipped: {
        weapon: null,
        helmet: null,
        armor: null,
        pants: null,
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
        store.dispatch(updateEquipment({
            weapon: this.equipped.weapon?.name,
            helmet: this.equipped.helmet?.name,
            armor: this.equipped.armor?.name,
            pants: this.equipped.pants?.name,
        }))
    },

    updateCharacterPreview: function() {
        store.dispatch(updatePreview(this.character.indexes));
    },

}


export const InventoryMixin = {

    inventory: new Map(),

    addItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key) || 0;
        const newItemCount = itemCount + amount;
        this.inventory.set(key, newItemCount);

        store.dispatch(addItemCount({
            name: key,
            value: newItemCount - itemCount,
        }))
    },

    removeItem: function(key, amount) {
        if (amount == null) amount = 1;
        const itemCount = this.inventory.get(key);
        const newItemCount = Math.max(0, itemCount - amount);
        this.inventory.set(key, newItemCount);

        store.dispatch(subractItemCount({
            name: key,
            value: itemCount - newItemCount,
        }))
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


export const EnemyListMixin = {

    hasEnemyList: true,
    enemyList: [],
    enemyAggroMap: new Map(),

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
        store.dispatch(updateEnemyList(newState));
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


export const CastingMixin = {

    hasCasting: true,
    casting: null,
    castTarget: null,
    castProgress: 0,
    castingTimer: 0,

    canCast: function(ability, target) {
        if (ability.canCast) {
            return ability.canCast(this, target);
        } else if (ability.canExecute) {
            return ability.canExecute(this, target);
        }
        return true;
    },

    startCast: function(ability, target) {
        this.casting = ability;
        this.castTarget = target;
        this.castingTimer = ability.castTime;

        if (ability.startCast) ability.startCast(this, target);

        if (this.isPlayer) {
            store.dispatch(setCast({
                key: ability.name,
                duration: ability.castTime,
            }));
        }

        if (this.isTargeted) {
            store.dispatch(setTargetCast({
                label: ability.name,
                progress: ability.castTime,
                duration: ability.castTime,
            }));
        }
    },

    cancelCast: function() {
        if (this.casting && this.casting.cancelCast) {
            this.casting.cancelCast(this, this.castTarget);
        }

        this.casting = null;
        this.castTarget = null;
        this.castingTimer = 0;


        if (this.isPlayer) {
            // todo figure out what to do with this
            this.directionLockTimer = 0;
            this.gcdTimer = 0;
        }

        if (this.isPlayer) {
            store.dispatch(setGCD(0));
            store.dispatch(setCast({
                key: '',
                duration: 0,
            }));
        }

        if (this.isTargeted) {
            store.dispatch(cancelTargetCast());
        }
    },

    updateCast(delta) {
        this.castingTimer = Math.max(0, this.castingTimer - delta);
        if (this.casting && this.castingTimer === 0) {
            const ability = this.casting;
            ability.execute(this, this.castTarget);
            this.casting = null;
            this.castTarget = null;

            if (this.isPlayer) {
                // todo: figure out where to put this
                this.faceTarget(this.castTarget);
                this.abilityTimer += 500;
                this.directionLockTimer += 500;
            }

            if (this.isPlayer) {
                store.dispatch(setCast({
                    key: '',
                    duration: 0,
                }));
            }

            if (this.isTargeted) {
                store.dispatch(setTargetCast({
                    label: '',
                    progress: 0,
                    duration: 0,
                }));
            }
        }
    }
};


export const CooldownMixin = {
    hasCooldowns: true,
    cooldowns: null,

    initializeCooldowns: function() {
        this.cooldowns = new Map();
    },

    getCooldown: function(key) {
        return this.cooldowns.get(key) || [0, 0]
    },

    startCooldown: function(key, duration) {
        this.cooldowns.set(key, [duration, duration]);
        if (this.isPlayer) {
            this.updateCooldownsStore();
        }
    },

    updateCooldowns(delta) {
        let shouldUpdateStore = false
        for (var [key, value] of this.cooldowns.entries()) {
            const [current, duration] = value;
            const timeLeft = Math.max(0, current - delta);
            if (timeLeft <= 0) {
                shouldUpdateStore = true;
                this.cooldowns.delete(key);
            } else {
                this.cooldowns.set(key, [timeLeft, duration]);
            }
        }
        if (shouldUpdateStore) {
            this.updateCooldownsStore(); 
        }
    },

    updateCooldownsStore() {
        if (this.isPlayer) {
            store.dispatch(
                setCooldowns(
                    Object.fromEntries(this.cooldowns)
                )
            );
        }
    },
}
