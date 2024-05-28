import React, { FC, useState, useEffect } from 'react';
import { DropdownOpts, FieldOpts, ToggleActionOpts, Child, Option } from '../App.type';
import FoodieText from '../core/FoodieText';
import FoodieToggle from '../core/FoodieToggle';
import Dropdown from '../core/Dropdown';

export const BASE_TA_ROW_DROPDOWN = {
    fieldName: 'cascade',
    toggleFor: 'Visibility',
    info: 'is part of cascade dropdown',
    child: {
      component: 'dropdown',
      opts: {
        options: [
          { name: 'Brand Category', value: 'brand-category'},
          { name: 'Brand Format', value: 'brand-format'}
        ],
        name: 'Cascade'
      },
      placement: 'row'
    }
}

const SUPPORTED_COMPONENTS: any = {
    'text': FoodieText,
    'dropdown': Dropdown
}

interface DynamicComponentProps {
    ComponentToRender: React.ComponentType<any>; // Allow any component type
    componentProps: any; // Props for the dynamic component (more on this below)
}

function DynamicComponent({ ComponentToRender, componentProps }: DynamicComponentProps) {
    return <ComponentToRender {...componentProps} />;
  }

/* 
const supportOps: FieldOpts | DropdownOpts  = {
    'text': (activeValue, eldOpts,) : FieldOpts => {
        return isOn ? {
            ...opts,
            value: activeValue,
           
    },
    'dropdown': (activeValue, opdownOpts, readOnly: boolean) : DropdownOpts => {
        return {
            ...opts,
            ...(activeValue && { selectedValue: activeValue}),
            readOnly
        }
    }
} */

/*
 * Displays N sequenced choices
 */
const ToggleAction: FC<ToggleActionOpts> = ({ toggle, children, linkedExternalVal, isLoading }) => {
    const borderOn = false;
    // const borderOn = true;

    const { fieldName, toggleName, state, info, onToggleChange, readOnly } = toggle;

    const [isOn, setIsOn] = useState<boolean>(!!state.valueOf());
    const [childEle, setChildEle] = useState<FC<FieldOpts | DropdownOpts>>();
    const [offChildEle, setOffChildEle] = useState<FC<FieldOpts | DropdownOpts>>();
    const [isRow, setIsRow] = useState<boolean>(false);

    const getElement = (child: Child, readOnly: boolean | undefined) => {
        const { component, opts } = child;
        const coreComponent: FC<FieldOpts | DropdownOpts> = SUPPORTED_COMPONENTS[component.valueOf()];

        let processedOpts: (FieldOpts | DropdownOpts) = opts;
        if (readOnly && !opts.readOnly) {
            processedOpts = { ...opts, readOnly: true }
        }
        
        return React.createElement(coreComponent, processedOpts)
    }

    const activate = (isToggleOn: boolean) => {
        setIsOn(isToggleOn); 
        
        if (onToggleChange && typeof onToggleChange === 'function') {
            onToggleChange(isToggleOn);
        }
    }

    useEffect(() => {
        
        const { off, on, placement } = children;
        setIsRow(placement ? placement.valueOf() === 'row':  true);

        if (off !== undefined) {
            let offElement = getElement(off, readOnly);
            setOffChildEle(offElement);
        }
        
        if (on !== undefined) {
            let onElement = getElement(on, readOnly);
            setChildEle(onElement);
        }

    }, [children]);

    useEffect(() => {
        
        const { on } = children;
 
        if (linkedExternalVal && linkedExternalVal.length > 0 && typeof linkedExternalVal == 'string') {
            let updateValue: string = linkedExternalVal;
            let onElement = getElement({
                ...on,
                opts: {
                    ...on.opts,
                    value: updateValue
                }
            }, readOnly);

            setChildEle(onElement);
        }
        // alert(`linkedExternal ${linkedExternalVal?.length}: ${linkedExternalVal instanceof Array}`);
        if (linkedExternalVal && linkedExternalVal.length > 0 && linkedExternalVal instanceof Array) {
            
            let onElement = getElement({
                ...on,
                opts: {
                    ...on.opts,
                    options: linkedExternalVal
                }
            }, readOnly);

            setChildEle(onElement);
        }
        
    }, [linkedExternalVal]);

    return (<div className={`min-w-full flex flex-col group/toggle ${borderOn ? 'border border-blue-700': ''}`}>
        <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-600">
            {toggleName}
        </label>
        <div className={`${borderOn ? 'border border-green-400': ''} mt-2 md:min-w-full w-full flex 
            ${isRow ? 'flex-row justify-between gap-10': 'flex-col gap-1'}`}>
            <FoodieToggle label={info} active={!!state.valueOf()} action={activate} readOnly={readOnly} />

            {isLoading && <>Loading....</>}

            {!isLoading && isOn && <>{childEle}</>}
            {/* {isOn && <DynamicComponent 
                ComponentToRender={SUPPORTED_COMPONENTS[on.component.valueOf()]} 
                componentProps={on.opts}
            />} */}
            {!isLoading && !isOn && <>{offChildEle}</>}
        </div>
    </div>);
}

export default ToggleAction;