import React, { FC, useState, useEffect } from 'react';
import { DropdownOpts, FieldOpts, ToggleActionOpts, Child, Option } from '../App.type';
import FoodieText from '../core/FoodieText';
import FoodieToggle from '../core/FoodieToggle';
import Dropdown from '../core/Dropdown';

const SUPPORTED_COMPONENTS: any = {
    'text': FoodieText,
    'dropdown': Dropdown
}

/* interface DynamicComponentProps {
    ComponentToRender: React.ComponentType<any>; // Allow any component type
    componentProps: any; // Props for the dynamic component (more on this below)
}

function DynamicComponent({ ComponentToRender, componentProps }: DynamicComponentProps) {
    return <ComponentToRender {...componentProps} />;
  } */

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
    // const [childComponent, setChildComponent] = useState(FoodieText);
    const [childEle, setChildEle] = useState<FC<FieldOpts | DropdownOpts>>();
    const [offChildEle, setOffChildEle] = useState<FC<FieldOpts | DropdownOpts>>();
    const [isRow, setIsRow] = useState<boolean>(false);

    const getElement = (child: Child, readOnly: boolean | undefined) => {
        const { component, opts } = child;
        const coreComponent: FC<FieldOpts | DropdownOpts> = SUPPORTED_COMPONENTS[component.valueOf()];

        let processedOpts: (FieldOpts | DropdownOpts) = opts;

        if (component.valueOf() == 'dropdown' && !opts.selectedCallback) {
            // alert(`selectedCallback is missing: keys [${JSON.stringify(opts)}]`)
        }
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

        if (isToggleOn) {
            const { on } = children;
            if (on && linkedExternalVal && linkedExternalVal.length > 0) {
                if (typeof linkedExternalVal == 'string') {
                    
                    // let updateValue: string = linkedExternalVal;/
                    let onElement = getElement({
                        ...on,
                        opts: {
                            ...on.opts,
                            value: 'linkedExternalVal'
                        }
                    }, readOnly);

                    /* alert(`update with linkedExternalVal : ${JSON.stringify({
                        ...on.opts,
                        value: linkedExternalVal
                    })}`); */

                    setChildEle(onElement);
                }

                if (linkedExternalVal instanceof Array) {
                    // alert(`toggle play : ${linkedExternalVal.length}`);
                    let onElement = getElement({
                        ...on,
                        opts: {
                            ...on.opts,
                            options: linkedExternalVal
                        }
                    }, readOnly);
                    if (on.opts.selectedValue && on.opts.selectedCallback) {
                        on.opts.selectedCallback(on.opts.selectedValue);
                    }
                    // alert(JSON.stringify(onElement));
                    setChildEle(onElement);
                }
            }

        } else {
            // alert('Turned off');
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
            // setChildComponent(onElement);
        }

    }, [children]);

    useEffect(() => {
        
        const { on } = children;

        /* if (linkedExternalVal && linkedExternalVal.length > 0 && on) {

            let opts = { ...on.opts };

            if (typeof linkedExternalVal == 'string') {
                opts = {
                    ...on,
                    opts: {
                        ...on.opts,
                        value: linkedExternalVal
                    }
                };
            } else if (linkedExternalVal instanceof Array) {
                opts = {
                    ...on,
                    opts: {
                        ...on.opts,
                        options: linkedExternalVal
                    }
                }
            }

            let onElement = getElement({
                ...on,
                opts
            }, readOnly);

            setChildEle(onElement);
        } */
        
        if (on && linkedExternalVal && linkedExternalVal.length > 0 ) {
            if (typeof linkedExternalVal == 'string') {
                // let updateValue: string = linkedExternalVal;/
                let onElement = getElement({
                    ...on,
                    opts: {
                        ...on.opts,
                        value: linkedExternalVal
                    }
                }, readOnly);
                setChildEle(onElement);
            }

            if (linkedExternalVal instanceof Array) {
                // alert('asdas')
                let onElement = getElement({
                    ...on,
                    opts: {
                        ...on.opts,
                        options: linkedExternalVal
                    }
                }, readOnly);

                // alert(JSON.stringify(onElement));
                setChildEle(onElement);
            }
        }
        
    }, [linkedExternalVal]);

    return (<div className={`min-w-full flex flex-col group/toggle ${borderOn ? 'border border-blue-700': ''}`}>
        <label htmlFor={fieldName} className="block text-sm font-medium leading-6 text-gray-600">
            {toggleName}
        </label>
        <div className={`${borderOn ? 'border border-green-400': ''} mt-2 md:min-w-full w-full flex 
            ${isRow ? 'flex-row justify-between gap-10': 'flex-col gap-1'}`}>
            <FoodieToggle label={info} active={!!state.valueOf()} action={activate} readOnly={readOnly} />
            {/* <>{childEle}</> */}

            {/* <DynamicComponent 
                ComponentToRender={childComponent} 
                componentProps={{ name: "Alice", value: "Welcome!" }} 
            /> */}

            {isOn && <>
                {isLoading && <>loading...</>}
                {!isLoading && <>{childEle}</>}
            </>}

            {!isOn && <>{offChildEle}</>}

            {/* {isLoading && <></>} */}

            {/* {!isLoading && isOn && <>{childEle}</>} */}
            {/* {isOn && <DynamicComponent 
                ComponentToRender={SUPPORTED_COMPONENTS[on.component.valueOf()]} 
                componentProps={on.opts}
            />} */}
            {/* {!isLoading && !isOn && <>{offChildEle}</>} */}
        </div>
    </div>);
}

export default ToggleAction;