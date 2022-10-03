import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import { reducerMap } from './HotBar';


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
        setKeyPressed(state => ({...state, [event.keyCode]: true}))
        callback && callback(input, event.type);
      }

      // if (event.ctrlKey) {
      //   event.preventDefault();
      // }
    };

    const upHandler = event => {
      const input = {
          key: event.keyCode,
          shift: event.shiftKey,
          ctrl: event.ctrlKey,
          alt: event.alt,
      }
      setKeyPressed(state => ({...state, [event.keyCode]: false}))
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

    const getActionFromInput = (input) => {
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

      const keybind = keymap[input.key]
      if (!keybind) return;

      let actionKey, action;
      switch (keybind.type) {
        case 'hotbar':
          const hotbar = hotbars[keybind.hotbar];
          if (!hotbar) return;

          actionKey = hotbar.slots[keybind.slot];
          if (!actionKey) return;

          // TODO: move reducerMap out of ui/HotBar.js
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
        switch (eventType) {
          case 'keydown':
            let action = getActionFromInput(input);
            if (action && action.action) dispatch(action.action);
            break;

          case 'keyup':
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
