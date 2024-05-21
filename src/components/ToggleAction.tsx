import React, { FC, useState } from 'react';
import { DropdownOpts, FieldOpts, ToggleActionOpts } from '../App.type';
import FoodieText from '../core/FoodieText';
import FoodieToggle from '../core/FoodieToggle';
import Dropdown from '../core/Dropdown';

export const BASE_SEQCHOICE_OPTS = {
    type: 'number',
    label: 'default example',
    size: 5,
    selected: '4',
    callback: (selectedChoice: string) => {
        alert(`This is chosen: ${selectedChoice}`);
    }
}

const SUPPORTED_COMPONENTS: any = {
    'text': FoodieText,
    'dropdown': Dropdown
}

const supportOps: FieldOpts | DropdownOpts  = {
    'text': (isOn: boolean, activeValue: string, opts: FieldOpts) : FieldOpts => {
        return isOn ? {
            ...opts,
            value: activeValue,
            readOnly: true
        } : {
            ...opts,
            readOnly: false
        };
    },
    'dropdown': (isOn: boolean, activeValue: string, opts: DropdownOpts, readOnly: boolean) : DropdownOpts => {
        return {
            ...opts,
            ...(activeValue && { selectedValue: activeValue}),
            readOnly
        }
    }
}

/*
 * Displays N sequenced choices
 */
const ToggleAction: FC<ToggleActionOpts> = ({ toggleFor, fieldName, active, info, child, readOnly, activeValue }) => {
    const [isActive, setIsActive] = useState(active);
    
    const { placement, component, defaultShow } = child;

    const [opts, setOpts] = useState(active ? supportOps[component](true, activeValue, child.opts, readOnly): child.opts);

    const childDefaultVisibility = defaultShow 
        ? 'block'
        : 'hidden group-has-[:checked]/toggle:block'

    const isRow = placement && placement === 'row'? true: false;

    const coreComponent: FC<FieldOpts | DropdownOpts> = SUPPORTED_COMPONENTS[component];

    const activate = (isOn: boolean) => {

        const processedOpts: (FieldOpts | DropdownOpts) = supportOps[component](isOn, activeValue, opts);

        if (isOn) {
            alert(`${component} : ${JSON.stringify(processedOpts)}`);
        }

        setOpts(processedOpts);
    }

    return (<div className='min-w-full ps-10 flex flex-col group/toggle'>
        <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-900">
            {toggleFor}
        </label>
        <div className={`mt-4 md:min-w-full w-full flex ${isRow? 'flex-row justify-between gap-10': 'flex-col gap-1'}`}>
            <FoodieToggle label={info} active={isActive} action={activate} readOnly={readOnly} />
            <div className={`${childDefaultVisibility} w-80`}>
                {React.createElement(coreComponent, opts)}
            </div>
        </div>
    </div>);
}

export default ToggleAction;