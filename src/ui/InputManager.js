import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import { reducerMap } from './HotBar';

const useKeyPress = callback => {
  const [keyPressed, setKeyPressed] = useState();

  useEffect(() => {

    const downHandler = (event) => {
      const input = {
          key: event.keyCode,
          shift: event.shiftKey,
          ctrl: event.ctrlKey,
      }
      if (keyPressed !== input) {
        setKeyPressed(input);
        callback && callback(input);
      }

      // if (event.ctrlKey) {
      //   event.preventDefault();
      // }
    };

    const upHandler = () => {
      setKeyPressed(null);
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

    const getActionFromInput = (input, keymap) => {
      const slot = keymap[input.key]
      if (!slot) return;

      const hotbar = hotbars[slot.hotbar];
      if (!hotbar) return;

      const actionKey = hotbar.slots[slot.slot];
      if (!actionKey) return;

      const action = reducerMap[actionKey];
      if (!action) return;

      return action;
    }

    useKeyPress(input => {
      let action;
      if (input.shift) {
        action = getActionFromInput(input, inputManager.shiftKeymap);
      } else if (input.ctrl) {
        action = getActionFromInput(input, inputManager.ctrlKeymap);
      // } else if (input.alt) {
      //   action = getActionFromInput(input, inputManager.altKeymap);
      } else {
        action = getActionFromInput(input, inputManager.keymap);
      }

      if (action) dispatch(action.action);

      // 1. get event.keyCode; also check modifiers
      // 2. retrieve which hotbar slot it maps to using keyMap
      // 3. check what ability is stored in hotbar slot
      // 4. execute ability callback

      // what happens if it's a UI thing?
      // ok so SOMEWHERE we define all hotbar-able things
      // every hotbar will have their own callbacks
      // we have a "reducerMap" in HotBar.js
    })

    return null;
}

        // // TODO: move to react code; find better input library
        // this.input.keyboard.on('keydown', (event) => {
        //     const hotbarSlot = this.keyMap[event.keyCode];
        //     if (!hotbarSlot) return;
        //     const ability = this.hotbarMap[hotbarSlot];
        //     if (!ability) return;
        //     this.player.queueAbility(ability);
        // });

        // // this is replaced by the one in hotbar redux store
        // this.hotbarMap = {
        //     1: basicAttack,
        //     2: basicAbility,
        // }
        // this.keyMap = {
        //     [KeyCodes.Q]: {
        //       hotbar: 1,
        //       slot: 1,
        //     },
        //     [KeyCodes.E]: {
        //       hotbar: 1,
        //       slot: 2,
        //     },
        //     [KeyCodes.R]: {
        //       hotbar: 1,
        //       slot: 3,
        //     },
        // };

        // lets talk myself though these issues lmao
        // 

        // could also map tooooo selectors?

export default InputManager;