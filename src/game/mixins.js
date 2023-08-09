import store from '../store/store';
import {
    setPlayerCurrentHealth,
    setPlayerHealth,
} from '../store/playerHealth';
import {
    setGCD,
    setCast,
    setCooldowns,
    setComboAction,
    updateExperience,
    updateLevel,
    updateJob,
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
import buffs from './buffs';
import jobMap from './jobs';

export const HealthMixin = {

    hasHealth: true,
    health: 100,
    maxHealth: 100,
    // hitboxRect: null,

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


// TargetMixin defines clientside behavior when targeted by the Player
// note: methods are NOT meant to be used when NPC targets a gameObject
export const TargetMixin = {

    currentTarget: null,
    isTargetable: true,

    // isTargeted and isCotargeted are in relation to the Player
    isTargeted: false,
    isCotargeted: false,

    // clickRect: null,

    targetObject: function(gameObject) {
        if (gameObject.isTargetable) {
            const previousTarget = this.currentTarget
            this.currentTarget = gameObject;

            if (this.isClientPlayer) {
                if (previousTarget) {
                    previousTarget.untarget();
                }
                gameObject.target();
                this.updateTargetStore();
            }

            if (this.isTargeted) {
                const cotarget = gameObject;
                cotarget.isCotargeted = true;
                this.updateTargetStore();
            }
        }
    },

    untargetObject: function(gameObject) {
        if (this.currentTarget) {
            const previousTarget = this.currentTarget;
            this.currentTarget = null;

            if (this.isClientPlayer) {
                previousTarget.untarget();
                this.updateTargetStore();
            }

            if (this.isTargeted) {
                previousTarget.isCotargeted = false;
                this.updateTargetStore();
            }
        }
    },

    cycleTargets: function(isReverse=false) {
        if (!this.isPlayer) return;

        const camera = this.scene.cameras.main;
        const targets = [];
        for (const target of this.scene.npcGroup.children.entries) {
            if (
                Phaser.Geom.Rectangle.Overlaps(camera.worldView, target.getBounds())
                && target.visible
            ) {
                targets.push(target);
            }
        };


        // TODO: if no targets in current direction; check behind
        const playerX = this.body.center.x;
        let currentX = this.currentTarget ? this.currentTarget.clickRect.getBounds().centerX : playerX;
        if (this.facingRight) {
            currentX = Math.max(playerX, currentX);
        } else {
            currentX = Math.min(playerX, currentX);
        }

        let furthestTarget = null;
        let closestTarget = null;
        let nextTarget = null;

        if (this.facingRight) {
            for (const target of targets) {
                const targetX = target.clickRect.getBounds().centerX;
                if (isReverse) {
                    if (playerX < targetX && targetX < currentX) {
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (targetX > nextTarget.clickRect.getBounds().centerX) {
                            nextTarget = target;
                        }
                    }
                } else {
                    if (currentX < targetX) {
                        // check if target is to the right of currentTarget
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (targetX < nextTarget.clickRect.getBounds().centerX) {
                            nextTarget = target;
                        }
                    }
                }

                if (playerX < targetX) {
                    if (!closestTarget) {
                        closestTarget = target;
                    } else if (targetX < closestTarget.clickRect.getBounds().centerX) {
                        closestTarget = target;
                    }

                    if (!furthestTarget) {
                        furthestTarget = target;
                    } else if (targetX > furthestTarget.clickRect.getBounds().centerX) {
                        furthestTarget = target;
                    }
                }
            }
        } else {
            for (const target of targets) {
                const targetX = target.clickRect.getBounds().centerX;
                if (isReverse) {
                    if (currentX < targetX && targetX < playerX) {
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (targetX < nextTarget.clickRect.getBounds().centerX) {
                            nextTarget = target;
                        }
                    }
                } else {
                    if (targetX < currentX) {
                        // check if target is to the right of currentTarget
                        if (!nextTarget) {
                            nextTarget = target;
                        } else if (nextTarget.clickRect.getBounds().centerX < targetX) {
                            // check if target is closer to the currentTarget than current next potential target
                            nextTarget = target;
                        }
                    }
                }

               if (targetX < playerX) {
                    if (!closestTarget) {
                        closestTarget = target;
                    } else if (closestTarget.clickRect.getBounds().centerX < targetX) {
                        closestTarget = target;
                    }

                    if (!furthestTarget) {
                        furthestTarget = target;
                    } else if (targetX < furthestTarget.clickRect.getBounds().centerX) {
                        furthestTarget = target;
                    }
                }
            }
        }

        if (nextTarget && nextTarget != this.currentTarget) {
            this.targetObject(nextTarget);
        } else if (isReverse && furthestTarget && furthestTarget != this.currentTarget) {
            this.targetObject(furthestTarget);
        } else if (!isReverse && closestTarget && closestTarget != this.currentTarget) {
            this.targetObject(closestTarget);
        }
    },

    updateTargetStore: function() {
        const clientPlayer = this.scene.clientPlayer;
        const currentTarget = clientPlayer.currentTarget;
        const currentCotarget = currentTarget ? currentTarget.currentTarget : null;

        if (this.isClientPlayer) {
            if (currentTarget) {
                store.dispatch(
                    setTarget({
                        targetName: currentTarget.displayName,
                        currentHealth: currentTarget.health,
                        maxHealth: currentTarget.maxHealth,
                        backgroundColor: currentTarget.isEnemy ? 'pink' : 'lightblue',
                    })
                )

                if (currentTarget.hasBuffs) {
                    currentTarget.updateStatusInfoStore();
                }

                if (currentCotarget) {
                    store.dispatch(setCotarget({
                        targetName: currentCotarget.displayName,
                        currentHealth: currentCotarget.health,
                        maxHealth: currentCotarget.maxHealth,
                        backgroundColor: currentCotarget.isEnemy ? 'pink' : 'lightblue',
                    }));
                }

                if (currentTarget.hasCasting && currentTarget.casting) {
                    store.dispatch(setTargetCast({
                        label: currentTarget.casting.name,
                        progress: currentTarget.castingTimer,
                        duration: currentTarget.casting.castTime,
                    }));
                } else {
                    store.dispatch(setTargetCast({
                        label: '',
                        progress: 0,
                        duration: 0,
                    }));
                }
            } else {
                store.dispatch(
                    removeTarget()
                );
                store.dispatch(setTargetCast({
                    label: '',
                    progress: 0,
                    duration: 0,
                }));
            }
        } else if (this.isTargeted) {
            if (currentCotarget) {
                store.dispatch(setCotarget({
                    targetName: currentCotarget.displayName,
                    currentHealth: currentCotarget.health,
                    maxHealth: currentCotarget.maxHealth,
                    backgroundColor: currentCotarget.isEnemy ? 'pink' : 'lightblue',
                }));
            }
        }
    },

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

    initializeAggroMixin() {
        this.aggroMap = new Map();
    },

    addAggro: function(gameObject, amount) {
        if (amount == null) amount = 1;
        const currentAggro = this.aggroMap.get(gameObject) || 0;
        const newAggro = currentAggro + amount;
        this.aggroMap.set(gameObject, newAggro);

        if (!this.highestAggro) {
            this.highestAggro = gameObject;
        } else {
            const currentHighestAggro = this.aggroMap.get(this.highestAggro) || 0;
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
    _buffsApplied: [],

    initializeBuffMixin() {
        this._buffs = [];
        this._buffsApplied = [];
    },

    updateStatusInfoStore() {
        const buffs = this._buffs.map(buff => {
            return {
                key: buff.key,
                duration: buff.timer,
                icon: buff.icon,
            }
        })

        if (this.isClientPlayer) {
            store.dispatch(updateStatuses([]));
            store.dispatch(updateStatuses(buffs));
        }

        if (this.isTargeted) {
            store.dispatch(updateTargetStatuses([]));
            store.dispatch(updateTargetStatuses(buffs));
        }
    },

    getBuffCount: function(key) {
        return this._buffs.filter(x => x.key == key).length;
    },

    applyBuff: function(key, source) {
        const buffClass = buffs[key];
        const buff = buffClass(this, source);
        buff.apply();
        this._buffs.push(buff);
        this.addBuffToSource(buff);
        this.updateStatusInfoStore();
    },

    removeBuff: function(buff, updateSource=true) {
        buff.unapply(this);
        this._buffs = this._buffs.filter((x) => (x !== buff));
        if (updateSource) {
            this.removeBuffFromSource(buff);
        }
        this.updateStatusInfoStore();
    },

    getBuff: function(key) {
        return this._buffs.find(x => x.key == key);
    },

    getAndRemoveBuff: function(key) {
        const buff = this.getBuff(key);
        this.removeBuff(buff);
    },

    updateOrApplyBuff: function(key, source, duration, maxDuration) {
        const buff = this._buffs.find(x => x.key == key && x.source == source);
        if (buff) {
            buff.timer = Math.min(buff.timer + duration, maxDuration);
            if (buff.reapply) buff.reapply();
            this.updateStatusInfoStore();
        } else {
            this.applyBuff(key, source);
        }
    },

    addBuffToSource(buff) {
        const source = buff.source;
        source._buffsApplied.push(buff);
    },

    removeBuffFromSource: function(buff) {
        const source = buff.source;
        source._buffsApplied = source._buffsApplied.filter((x) => (x !== buff));
    },

    unapplyAllBuffsFromSource: function() {
        for (const buff of this._buffsApplied) {
            buff.target.removeBuff(buff, false);
        }
    },

    updateBuffs: function(delta) {
        let shouldUpdate = false;

        for (const buff of this._buffs) {
            buff.timer = Math.max(0, buff.timer - delta);
            if (buff.timer <= 0) {
                buff.unapply(this);
                this.removeBuffFromSource(buff);
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


export const InventoryMixin = {

    inventory: new Map(),

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


export const EnemyListMixin = {

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
        console.log(this.enemyList);
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

        if (this.isPlayer) this.faceTarget(this.gcdTarget);

        if (ability.startCast) ability.startCast(this, target);

        if (this.isClientPlayer) {
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

        if (this.isClientPlayer) {
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
            this.executeAbility(this.casting, this.castTarget);
            this.casting = null;
            this.castTarget = null;

            if (this.isClientPlayer) {
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
    },

    executeAbility(ability, target) {
        if (this.isPlayer) {
            this.faceTarget(target);
        }

        ability.execute(this, target);

        if (this.isPlayer) {
            this.faceTarget(target);

            const duration = ability.gcd ? 350 : 750;
            this.abilityTimer += duration;
            this.directionLockTimer += 500;
            if (ability.gcd && !ability.isComboAction) {
                this.setPlayerComboAction(ability.name);
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
        if (this.isClientPlayer) {
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
        if (this.isClientPlayer) {
            store.dispatch(
                setCooldowns(
                    Object.fromEntries(this.cooldowns)
                )
            );
        }
    },
};


export const LevelMixin = {
    hasLevel: true,
    currentLevel: 1,

    setLevel(level) {
        this.currentLevel = level;
        this.updateBaseStats();
        this.updateLevelStore();
    },

    updateLevelStore() {
        if (this.isClientPlayer) {
            store.dispatch(updateLevel(this.currentLevel));
        }
    }
}


export const ExperienceMixin = {
    hasExperience: true,

    currentExperience: 0,
    maxExperience: 394,

    jobExperienceMap: {},

    setExperience(exp) {
        // todo: update for multiple jobs
        this.currentExperience = exp;
        this.jobExperienceMap = {
            'TMP': exp,
            'HEAL': exp,
            'MELEE': exp,
            'SPELL': exp,
            'HUNTER': exp,
            'KNIGHT': exp,
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


export const BASE_STATS = [1.0, 1.0, 1.1, 1.3, 1.5, 1.7, 2.0, 2.3, 2.7, 3.1, 3.5, 4.0, 4.7, 5.4, 6.2, 7.1, 8.1, 9.4, 10.8, 12.4, 14.2, 16.4, 18.8, 21.6, 24.9, 28.6, 32.9, 37.9, 43.5, 50.1, 57.6];

export const BaseStatsMixin = {

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


export const CombatMixin = {

    inCombat() {
        if (this.hasEnemyList) {
            if (this.enemyList.length > 0) {
                return true;
            }
        }
        if (this.hasCasting && this.casting) return true;
        return false;
    },

    calculateDamageFromPotency(potency, type) {
        let damage = 0;
        if (type == 'physical') {
            const STR = this.getStrengthStat();
            damage = STR * potency;
        } else if (type == 'magical') {
            const INT = this.getIntelligenceStat();
            damage = INT * potency;
        }
        return damage
    },

    dealDamage(target, potency, type, delay) {
        const isPhysical = type == 'physical';
        const isMagical = type == 'magical';

        let damage = this.calculateDamageFromPotency(potency, type);
        for (const buff of this._buffs) {
            if (buff.modifyDamage) {
                damage = buff.modifyDamage(damage);
            }

            if (isPhysical && buff.modifyPhysicalDamage) {
                damage = buff.modifyPhysicalDamage(damage);
            }

            if (isMagical && buff.modifyMagicalDamage) {
                damage = buff.modifyMagicalDamage(damage);
            }
        };

        target.receiveDamage(this, damage, type, delay);
    },

    calculateDotDamage(potency, type, delay) {
        const isPhysical = type == 'physical';
        const isMagical = type == 'magical';

        let damage = this.calculateDamageFromPotency(potency, type);
        for (const buff of this._buffs) {
            if (buff.modifyDamage) {
                damage = buff.modifyDamage(damage);
            }

            if (isPhysical && buff.modifyPhysicalDamage) {
                damage = buff.modifyPhysicalDamage(damage);
            }

            if (isMagical && buff.modifyMagicalDamage) {
                damage = buff.modifyMagicalDamage(damage);
            }
        };
        return damage;
    },

    dealDotDamage(target, damage, type) {
        target.receiveDamage(this, damage, type);
    },
};

export const JobMixin = {
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
