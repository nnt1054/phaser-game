import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import reducerMap from './HotBarItems';
import {
    setSlotActive,
} from '../store/hotBars';

import Phaser from 'phaser';
const KeyCodes = Phaser.Input.Keyboard.KeyCodes;


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
      if (event.keyCode == KeyCodes.SPACE) {
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


const InputManager = () => {
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

    const setHotbarSlotState = (input, active) => {
      const keybind = getKeybindFromInput(input);
      if (!keybind) return;
      if (keybind.type === 'hotbar') {
        dispatch(setSlotActive({
          key: keybind.hotbar,
          index: keybind.slot,
          active: active,
        }))
      }
    }

    const getActionFromInput = (input) => {
      const keybind = getKeybindFromInput(input);
      if (!keybind) return;

      let actionKey, action;
      switch (keybind.type) {
        case 'hotbar':
          const hotbar = hotbars[keybind.hotbar];
          if (!hotbar) return;

          const slot = hotbar.slots[keybind.slot]
          if (!slot) return;

          actionKey = slot.name;
          if (!actionKey) return;

          action = reducerMap[actionKey];
          if (!action) return;

          return action;

        case 'cursor':
          let cursorKey = keybind.cursor
          if (!cursorKey) return;

          let cursor = reducerMap[cursorKey];
          if (!cursor) return;

          return cursor;

        case 'simple':
          actionKey = keybind.key;
          if (!actionKey) return;

          action = reducerMap[actionKey];
          if (!action) return;

          return action
      }
    }

    const releaseKeyPress = (input, keymap) => {
      const keybind = keymap[input.key]
      if (!keybind || keybind.type !== 'cursor') return;

      let cursorKey = keybind.cursor
      if (!cursorKey) return;

      let cursor = reducerMap[cursorKey];
      if (!cursor) return;

      if (cursor && cursor.upAction) dispatch(cursor.upAction);
    }

    useKeyPress(
      (input, eventType) => {
        let keybind, action;
        switch (eventType) {
          case 'keydown':
            setHotbarSlotState(input, true);
            action = getActionFromInput(input);
            if (action && action.action) dispatch(action.action);
            break;

          case 'keyup':
            setHotbarSlotState(input, false);

            // release all modifiers
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
