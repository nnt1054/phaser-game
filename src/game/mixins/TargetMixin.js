import store from '../../store/store';

import {
    setTarget,
    removeTarget,
    setCotarget,
    removeCotarget,
    setTargetCast,
} from '../../store/targetInfo';


const TargetMixin = {

    targetId: null,

    currentTarget: null,
    isTargetable: true,

    isTargeted: false,
    isCotargeted: false,

    targetObjectFromId: function(id) {
        if (this.currentTarget && this.currentTarget.id === id) return;
        if (id) {
            const gameObject = this.scene.getObjectFromId(id);
            if (gameObject) {
                this.targetObject(gameObject);
            }
        } else {
            this.untargetObject();
        }
    },

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

export default TargetMixin;
