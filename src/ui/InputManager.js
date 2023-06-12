import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

import actionMap from './actions';
import {
    setSlot,
    setSlotActive,
} from '../store/hotBars';
import store from '../store/store';
import {
  getActiveItemKey,
  checkIsSetting,
  getSettingName,
} from './utils';
import {
  activeStates,
  setInventoryState,
} from '../store/inventory';
import {
    activeStates as skillsActiveStates,
    setActiveState as setSkillsActiveState,
} from '../store/skillsMenu';
import {
  setRefreshCooldown,
} from '../store/playerState';

import { TARGET_CONSTANTS } from './../constants'; 


// Hook
const useKeyPress = callback => {
  const [keyPressed, setKeyPressed] = useState({});

  useEffect(() => {

    const downHandler = event => {
      const input = {
          key: event.keyCode,
          shift: event.shiftKey,
          ctrl: event.ctrlKey,
          alt: event.alt,
      }

      if (!keyPressed[event.keyCode]) {
        setKeyPressed(state => ({...state, [event.keyCode]: true}));
        callback && callback(input, event.type);
      }

      // if (event.ctrlKey) {
      //   event.preventDefault();
      // }
      if (event.keyCode == KeyCodes.SPACE) {
        // event.preventDefault();
      }
      if (event.keyCode == KeyCodes.ENTER) {
        event.preventDefault();
      }
      if (event.keyCode == KeyCodes.TAB) {
        event.preventDefault();
      }
    };

    const upHandler = event => {
      const input = {
          key: event.keyCode,
          shift: event.shiftKey,
          ctrl: event.ctrlKey,
          alt: event.alt,
      };
      setKeyPressed(state => ({...state, [event.keyCode]: false}));
      callback && callback(input, event.type);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });

  return keyPressed;
};


const hotbarIndexToName = {
  1: 'Hotbar 1',
  2: 'Hotbar 2',
};

const InputManager = () => {
    const currentJob = useSelector(state => state.playerState.currentJob);
    const targetName = useSelector(state => state.targetInfo.targetName);

    const inputManager = useSelector(state => state.inputManager);
    const hotbars = useSelector(state => state.hotBars);
    const dispatch = useDispatch();

    const getKeybindFromInput = (input) => {
      let keymap;
      if (input.shift) {
        keymap = inputManager.shiftKeymap;
      } else if (input.ctrl) {
        keymap = inputManager.ctrlKeymap;
      } else if (input.alt) {
        keymap = inputManager.altKeymap;
      } else {
        keymap = inputManager.keymap;
      }

      return keymap[input.key]
    }

    const setHotbarSlotState = (input) => {
      const keybind = getKeybindFromInput(input);
      if (!keybind) return;

      if (keybind.type === 'hotbar') {
        const hotbarName = hotbarIndexToName[keybind.hotbar]
        dispatch(setSlotActive({
          key: hotbarName,
          index: keybind.slot,
          active: true,
        }))
      }
    }

    const getActionFromInput = (input) => {
      const keybind = getKeybindFromInput(input);
      if (!keybind) return;

      let actionKey, action;
      switch (keybind.type) {
        case 'hotbar':
          const hotbarName = hotbarIndexToName[keybind.hotbar]
          const hotbar = hotbars[hotbarName];
          if (!hotbar) return;

          const slots = hotbar.slotsMap[currentJob];
          const slot = slots[keybind.slot];
          if (!slot) return;

          actionKey = slot.name;
          if (!actionKey) return;

          action = actionMap[actionKey];
          if (!action) return;

          return action;

        case 'cursor':
          let cursorKey = keybind.cursor
          if (!cursorKey) return;

          let cursor = actionMap[cursorKey];
          if (!cursor) return;

          return cursor;

        case 'simple':
          actionKey = keybind.key;
          if (!actionKey) return;

          action = actionMap[actionKey];
          if (!action) return;

          return action
      }
    }

    const releaseKeyPress = (input, keymap) => {
      const keybind = keymap[input.key]
      if (!keybind) return;
      if (keybind.type === 'hotbar') {
        const hotbarName = hotbarIndexToName[keybind.hotbar]
        dispatch(setSlotActive({
          key: hotbarName,
          index: keybind.slot,
          active: false,
        }))
      }

      // cursor logic
      if (keybind.type !== 'cursor') return;
      let cursorKey = keybind.cursor
      if (!cursorKey) return;

      let cursor = actionMap[cursorKey];
      if (!cursor) return;

      if (cursor && cursor.upAction) {
        cursor.upAction();
      }
    }

    useKeyPress(
      (input, eventType) => {
        let keybind, action;
        switch (eventType) {
          case 'keydown':

            const state = store.getState();

            // check if attempting to set ability to hotbar
            const isSetting = checkIsSetting(state);
            if (isSetting) {
              const keybind = getKeybindFromInput(input);
              if (!keybind) break;
              if (keybind.type === 'hotbar') {
                const name = getSettingName(state);
                const hotbarName = hotbarIndexToName[keybind.hotbar]
                dispatch(setSlot({
                    job: currentJob,
                    hotbar: hotbarName,
                    slot: keybind.slot,
                    name: name,
                }))
                dispatch(setInventoryState(activeStates.default));
                dispatch(setSkillsActiveState(skillsActiveStates.default));
                dispatch(setRefreshCooldown(true));
                break;
              }
            }

            action = getActionFromInput(input);
            if (action && state.menuStates.chatInputIsActive) {
              if (!['close', 'confirm'].includes(action.label)) return;
            }

            setHotbarSlotState(input, true);
            if (action && action.action) {
              if (targetName) {
                action.action(TARGET_CONSTANTS.CURRENT_TARGET)
              } else {
                action.action();
              }
            }
            break;

          case 'keyup':
            // release all modified versions of input
            releaseKeyPress(input, inputManager.shiftKeymap);
            releaseKeyPress(input, inputManager.ctrlKeymap);
            releaseKeyPress(input, inputManager.altKeymap);
            releaseKeyPress(input, inputManager.keymap);
            break;
        }
      },
    )

    return null;
}

export default InputManager;
