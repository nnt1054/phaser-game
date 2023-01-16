import {
    items,
    equipment,
    abilities,
} from './actions';
import {
    activeStates as inventoryActiveStates,
} from '../store/inventory';
import {
    activeStates as skillsActiveStates,
} from '../store/skillsMenu';
import { menus } from '../store/menuStates';


export function calculatePosition(key, ref) {
    const element = ref.current;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const style = window.getComputedStyle(element);
    const temp = window.getComputedStyle(element).transform;
    const numberPattern = /-?\d+\.?\d+|\d+/g;
    const values = style.transform.match( numberPattern );
    const translateX = parseFloat(values[4]);
    const translateY = parseFloat(values[5]);
    const width = parseFloat(style.width);
    const left = parseFloat(style.left);
    const bottom = parseFloat(style.bottom);

    const newLeft = ((left + width/2 + translateX) / vw) * 100;
    const newBottom = ((bottom - translateY) / vh) * 100;

    return {
        key: key,
        x: newLeft,
        y: newBottom,
    }
};


export const getActiveItem = (state) => {
    const activeIndex = state.inventory.activeIndex;
    const inventory = state.inventory.items;

    const itemKey = inventory[activeIndex]?.name;
    if (!itemKey) return;

    const item = items[itemKey] || equipment[itemKey];
    return item;
}

export const getActiveItemKey = (state) => {
    const activeIndex = state.inventory.activeIndex;
    const inventory = state.inventory.items;

    const itemKey = inventory[activeIndex]?.name;
    return itemKey;
}

export const getActiveSkill = (state) => {
    const activeIndex = state.skills.activeIndex;
    const options = state.skills.options;

    const abilityKey = options[activeIndex];
    if (!abilityKey) return;

    const ability = abilities[abilityKey];
    return ability;
}

export const getActiveSkillKey = (state) => {
    const activeIndex = state.skills.activeIndex;
    const skills = state.skills.options;

    const abilityKey = skills[activeIndex];
    return abilityKey;
}

export const checkIsSetting = (state) => {
    const activeMenu = state.menuStates.activeMenu;
    const inventoryState = state.inventory.state;
    const skillsState = state.skills.state

    const isSettingItem = (
        activeMenu === 'inventory' &&
        inventoryState === inventoryActiveStates.setting
    )
    const isSettingSkill = (
        activeMenu === menus.skills &&
        skillsState === skillsActiveStates.setting
    )

    return isSettingItem || isSettingSkill;
}

export const getSettingName = (state) => {
    const activeMenu = state.menuStates.activeMenu;
    const inventoryState = state.inventory.state;
    const skillsState = state.skills.state

    const isSettingItem = (
        activeMenu === 'inventory' &&
        inventoryState === inventoryActiveStates.setting
    )
    const isSettingSkill = (
        activeMenu === menus.skills &&
        skillsState === skillsActiveStates.setting
    )

    if (isSettingItem) {
        return getActiveItemKey(state);
    } else if (isSettingSkill) {
        return getActiveSkillKey(state);
    }
}