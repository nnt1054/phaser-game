import { useSelector, useDispatch } from 'react-redux';

import { abilities, skillActions } from './actions';
import {
    activeStates,
    setActiveState,
    setActiveIndex,
} from '../store/skillsMenu';
import { menus } from '../store/menuStates';
import Tooltip from './Tooltip';

import * as styles from './../App.module.css';


const skillEntryStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
}

const containerStyles = {
    height: `100vh`,
    right: '12px',
    zIndex: '10',
}

const flexRowReverse = {
    display: 'flex',
    flexDirection: 'row-reverse',
    columnGap: '12px',
    height: '100vh',
}

const flexColumn = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '12px 0px',
    rowGap: '12px',
    minWidth: '420px',
    maxWidth: '512px',
};


const SkillsActionOption = (props) => {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state.skills.activeActionsIndex);
    const isActive = (activeIndex === props.index);

    const option = skillActions[props.option];

    const buttonStyle = {
        height: '48px',
        width: '128px',
        border:  '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: isActive ? 'rgba(100, 100, 100, .5)' : 'rgba(0, 0, 0, .5)',
    }

    const onClick = (event) => {
        // dispatch(setInventoryActiveActionsIndex(props.index));
        // option.action();
        // dispatch(closeActionsMenu());
    }

    return (
        <button onClick={ onClick } style={ buttonStyle }> { option.label } </button>
    )
}

const SkillsOptions = (props) => {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state.skills.activeIndex);
    const isActive = (activeIndex === props.index);

    const skill = abilities[props.option];

    const buttonStyle = {
        fontSize: '12pt',
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'white',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        padding: '4px 0px',
    }

    const onClick = (event) => {
        dispatch(setActiveIndex(props.index));
    }

    const text = isActive ? `> ${ skill.label }` : skill.label
    return (
        <button onClick={ onClick } style={ buttonStyle }> { text } </button>
    )
}

const SkillsMenu = () => {
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const activeIndex = useSelector(state => state.skills.activeIndex);
    const options = useSelector(state => state.skills.options);
    const actionOptions = useSelector(state => state.skills.actionOptions)
    const skillsState = useSelector(state => state.skills.state);
    const abilityKey = options[activeIndex];

    const isActive = (activeMenu === menus.skills);
    const isSetting = skillsState === activeStates.setting;
    const shouldDisplay = isActive && !isSetting;
    const shouldDisplayButtons = (skillsState === activeStates.actions);

    const containerStyles = {
        display: shouldDisplay ? 'block' : 'none',
        height: `100vh`,
        right: '12px',
        zIndex: 10,
    }

    const skillsMenuStyle = {
        display: 'flex',
        flexDirection: `column`,
        flexGrow: 3,
        overflow: 'hidden',
        border: '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        padding: '0px 12px',
        gap: '8px',
    };

    const buttonsContainerStyle = {
        visibility: shouldDisplayButtons ? 'visible' : 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'end',
    }

    return (
        <div style={ containerStyles }>
            <div style={ flexRowReverse }>
                <div style={ flexColumn }>
                    <div style={ skillsMenuStyle }>
                        <h3> Skills </h3>
                        <div style={ skillEntryStyle }>
                            {
                                options.map((option, i) => {
                                    return <SkillsOptions
                                        key={ i }
                                        index={ i }
                                        option={ option }
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div style={ flexColumn }>
                    <Tooltip abilityKey={ abilityKey }/>
                    <div style={ buttonsContainerStyle }>
                        {
                            actionOptions.map((actionOption, i) => {
                                return <SkillsActionOption
                                    key={ i }
                                    index={ i }
                                    option={ actionOption }
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkillsMenu;
