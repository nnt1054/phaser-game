import store from '../store/store';
import {
	shortcutActions,
	items,
	equipment,
	inventoryActions,
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
            store.dispatch(setInventoryState(inventoryActiveStates.default));
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


export default {
    'gameMenu': gameMenuNavActions,
    'inventory': inventoryNavActions,
    'dialogue': dialogueNavActions,
}