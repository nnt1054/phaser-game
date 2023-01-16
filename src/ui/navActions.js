import store from '../store/store';
import {
	shortcutActions,
	items,
	equipment,
	inventoryActions,
    skillActions,
} from './actions';
import {
	openActionsMenu,
    setInventoryState,
	activeStates as inventoryActiveStates,
	setActionOptions,
	setInventoryActiveIndex,
	setInventoryActiveActionsIndex,
    closeActionsMenu,
} from '../store/inventory';
import {
    openMenu,
    closeMenu,
    setActiveIndex,
} from '../store/menuStates';
import {
    getNextMessage,
    submitCurrentOption,
    setCurrentOption,
} from '../store/dialogueBox';
import {
    activeStates as skillsActiveStates,
    setActiveState as setSkillsActiveState,
    setActiveIndex as setSkillsActiveIndex,
    setActiveActionsIndex as setSkillsActiveActionsIndex,
} from '../store/skillsMenu';

const gameMenuNavActions = {
    close: () => {
        store.dispatch(closeMenu());
    },
    confirm: () => {
        const state = store.getState();
        const currentIndex = state.menuStates.activeIndex;
        const key = state.menuStates.gameMenuOptions[currentIndex];
        const option = shortcutActions[key];
        if (option) option.action();
    },
    up: () => {
        const state = store.getState();
        const currentIndex = state.menuStates.activeIndex;
        const maxIndex = state.menuStates.gameMenuOptions.length - 1;
        let newIndex = currentIndex;
        if (currentIndex == 0) {
            newIndex = maxIndex;
        } else {
            newIndex = currentIndex - 1;
        }
        store.dispatch(setActiveIndex(newIndex));
    },
    down: () => {
        const state = store.getState();
        const currentIndex = state.menuStates.activeIndex;
        const maxIndex = state.menuStates.gameMenuOptions.length - 1;
        let newIndex = currentIndex;
        if (currentIndex == maxIndex) {
            newIndex = 0;
        } else {
            newIndex = currentIndex + 1;
        }
        store.dispatch(setActiveIndex(newIndex));
    },
    left: () => {
        const state = store.getState();
        const currentIndex = state.menuStates.activeIndex;
        const maxIndex = state.menuStates.gameMenuOptions.length - 1;
        let newIndex = currentIndex;
        if (currentIndex == 0) {
            newIndex = maxIndex;
        } else {
            newIndex = currentIndex - 1;
        }
        store.dispatch(setActiveIndex(newIndex));
    },
    right: () => {
        const state = store.getState();
        const currentIndex = state.menuStates.activeIndex;
        const maxIndex = state.menuStates.gameMenuOptions.length - 1;
        let newIndex = currentIndex;
        if (currentIndex == maxIndex) {
            newIndex = 0;
        } else {
            newIndex = currentIndex + 1;
        }
        store.dispatch(setActiveIndex(newIndex));
    },
}

const inventoryNavActions = {
    close: () => {
        const state = store.getState();
        if (state.inventory.state === inventoryActiveStates.default) {
            store.dispatch(openMenu('gameMenu'));
        } else if (state.inventory.state === inventoryActiveStates.actions) {
            store.dispatch(closeActionsMenu());
        } else if (state.inventory.state === inventoryActiveStates.setting) {
            store.dispatch(setInventoryState(inventoryActiveStates.actions));
        }
    },
    confirm: () => {
        const state = store.getState();
        if (state.inventory.state === inventoryActiveStates.default) {
            const currentIndex = state.inventory.activeIndex;
            const item = state.inventory.items[currentIndex];
            if (!item || item.name === 'empty') return;

            if (equipment[item.name]) {
                store.dispatch(setActionOptions([
                    'equipActiveItem',
                    'setActiveItem',
                ]));
                store.dispatch(openActionsMenu());
            } else if (items[item.name]) {
                store.dispatch(setActionOptions([
                    'useActiveItem',
                    'setActiveItem',
                ]));
                store.dispatch(openActionsMenu());
            }

        } else if (state.inventory.state === inventoryActiveStates.actions) {
            const actionsIndex = state.inventory.activeActionsIndex;
            const actionOptions = state.inventory.actionOptions;
            const actionKey = actionOptions[actionsIndex];

            const action = inventoryActions[actionKey];
            if (action.action) action.action();
        }
    },
    up: () => {
        const state = store.getState();
        if (state.inventory.state === inventoryActiveStates.default) {
            const currentIndex = state.inventory.activeIndex;
            const newIndex = Math.max(0, currentIndex - 6);
            store.dispatch(setInventoryActiveIndex(newIndex));
        } else if (state.inventory.state === inventoryActiveStates.actions) {
            const currentIndex = state.inventory.activeActionsIndex;
            const maxIndex = state.inventory.actionOptions.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == 0) {
                newIndex = maxIndex;
            } else {
                newIndex = currentIndex - 1;
            }
            store.dispatch(setInventoryActiveActionsIndex(newIndex));
        }
    },
    down: () => {
        const state = store.getState();
        if (state.inventory.state === inventoryActiveStates.default) {
            const currentIndex = state.inventory.activeIndex;
            const maxIndex = 47;
            const newIndex = Math.min(maxIndex, currentIndex + 6);
            store.dispatch(setInventoryActiveIndex(newIndex));
        } else if (state.inventory.state === inventoryActiveStates.actions) {
            const currentIndex = state.inventory.activeActionsIndex;
            const maxIndex = state.inventory.actionOptions.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == maxIndex) {
                newIndex = 0;
            } else {
                newIndex = currentIndex + 1;
            }
            store.dispatch(setInventoryActiveActionsIndex(newIndex));
        }
    },
    left: () => {
        const state = store.getState();
        if (state.inventory.state === inventoryActiveStates.default) {
            const currentIndex = state.inventory.activeIndex;
            const newIndex = Math.max(0, currentIndex - 1);
            store.dispatch(setInventoryActiveIndex(newIndex));
        } else if (state.inventory.state === inventoryActiveStates.actions) {
            const currentIndex = state.inventory.activeActionsIndex;
            const maxIndex = state.inventory.actionOptions.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == 0) {
                newIndex = maxIndex;
            } else {
                newIndex = currentIndex - 1;
            }
            store.dispatch(setInventoryActiveActionsIndex(newIndex));
        }
    },
    right: () => {
        const state = store.getState();
        if (state.inventory.state === inventoryActiveStates.default) {
            const currentIndex = state.inventory.activeIndex;
            const maxIndex = 47;
            const newIndex = Math.min(maxIndex, currentIndex + 1);
            store.dispatch(setInventoryActiveIndex(newIndex));
        } else if (state.inventory.state === inventoryActiveStates.actions) {
            const currentIndex = state.inventory.activeActionsIndex;
            const maxIndex = state.inventory.actionOptions.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == maxIndex) {
                newIndex = 0;
            } else {
                newIndex = currentIndex + 1;
            }
            store.dispatch(setInventoryActiveActionsIndex(newIndex));
        }
    },
}

const dialogueNavActions = {
    close: () => {
        store.dispatch(getNextMessage());
    },
    confirm: () => {
        const state = store.getState();
        if (state.dialogueBox.options.length) {
            store.dispatch(submitCurrentOption());
        } else {
            store.dispatch(getNextMessage());
        }
    },
    up: () => {
        const state = store.getState();
        if (state.dialogueBox.options.length) {
            const currentIndex = state.dialogueBox.currentOption;
            const maxIndex = state.dialogueBox.options.length - 1;
            let newIndex = currentIndex;
            if (currentIndex <= 0) {
                newIndex = maxIndex;
            } else {
                newIndex = currentIndex - 1;
            }
            store.dispatch(setCurrentOption(newIndex));
        }
    },
    down: () => {
        const state = store.getState();
        if (state.dialogueBox.options.length) {
            const currentIndex = state.dialogueBox.currentOption;
            const maxIndex = state.dialogueBox.options.length - 1;
            let newIndex = currentIndex;
            if (currentIndex >= maxIndex) {
                newIndex = 0;
            } else {
                newIndex = currentIndex + 1;
            }
            store.dispatch(setCurrentOption(newIndex));
        }
    },
    left: () => {},
    right: () => {},
}

const skillsMenuNavActions = {
    close: () => {
        const state = store.getState();
        if (state.skills.state === skillsActiveStates.default) {
            store.dispatch(openMenu('gameMenu'));
        } else if (state.skills.state === skillsActiveStates.actions) {
            store.dispatch(setSkillsActiveState(skillsActiveStates.default));
        } else if (state.skills.state === skillsActiveStates.setting) {
            store.dispatch(setSkillsActiveState(skillsActiveStates.actions));
        }

    },
    confirm: () => {

        const state = store.getState();
        if (state.skills.state === skillsActiveStates.default) {
            const currentIndex = state.skills.activeIndex;
            const skill = state.skills.options[currentIndex];
            store.dispatch(setSkillsActiveState(skillsActiveStates.actions));
        } else if (state.skills.state === skillsActiveStates.actions) {
            const actionsIndex = state.skills.activeActionsIndex;
            const actionOptions = state.skills.actionOptions;
            const actionKey = actionOptions[actionsIndex];
            const action = skillActions[actionKey];
            if (action.action) action.action();
        }

    },
    up: () => {
        const state = store.getState();
        if (state.skills.state === skillsActiveStates.default) {
            const currentIndex = state.skills.activeIndex;
            const maxIndex = state.skills.options.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == 0) {
                newIndex = maxIndex;
            } else {
                newIndex = currentIndex - 1;
            }
            store.dispatch(setSkillsActiveIndex(newIndex));
        } else if (state.skills.state === skillsActiveStates.actions) {
            const currentIndex = state.skills.activeActionsIndex;
            const maxIndex = state.skills.actionOptions.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == 0) {
                newIndex = maxIndex;
            } else {
                newIndex = currentIndex - 1;
            }
            store.dispatch(setSkillsActiveActionsIndex(newIndex));
        }
    },
    down: () => {
        const state = store.getState();
        if (state.skills.state === skillsActiveStates.default) {
            const currentIndex = state.skills.activeIndex;
            const maxIndex = state.skills.options.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == maxIndex) {
                newIndex = 0;
            } else {
                newIndex = currentIndex + 1;
            }
            store.dispatch(setSkillsActiveIndex(newIndex));
        } else if (state.skills.state === skillsActiveStates.actions) {
            const currentIndex = state.skills.activeActionsIndex;
            const maxIndex = state.skills.actionOptions.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == maxIndex) {
                newIndex = 0;
            } else {
                newIndex = currentIndex + 1;
            }
            store.dispatch(setSkillsActiveActionsIndex(newIndex));
        }
    },
    left: () => {
        const state = store.getState();
        if (state.skills.state === skillsActiveStates.default) {
            const currentIndex = state.skills.activeIndex;
            const maxIndex = state.skills.options.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == 0) {
                newIndex = maxIndex;
            } else {
                newIndex = currentIndex - 1;
            }
            store.dispatch(setSkillsActiveIndex(newIndex));
        } else if (state.skills.state === skillsActiveStates.actions) {
        }
    },
    right: () => {
        const state = store.getState();
        if (state.skills.state === skillsActiveStates.default) {
            const currentIndex = state.skills.activeIndex;
            const maxIndex = state.skills.options.length - 1;
            let newIndex = currentIndex;
            if (currentIndex == maxIndex) {
                newIndex = 0;
            } else {
                newIndex = currentIndex + 1;
            }
            store.dispatch(setSkillsActiveIndex(newIndex));
        } else if (state.skills.state === skillsActiveStates.actions) {
        }
    },
}

export default {
    'gameMenu': gameMenuNavActions,
    'inventory': inventoryNavActions,
    'dialogue': dialogueNavActions,
    'skills': skillsMenuNavActions,
}
