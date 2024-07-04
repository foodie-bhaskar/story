import React, { FC, useState, useEffect } from 'react';
import { DropdownOpts, FieldOpts, ToggleActionOpts, Child, SequenceChoiceOpts, SupportedComponents } from '../App.type';
import FoodieText, { isFoodieText } from '../core/FoodieText';
import FoodieToggle from '../core/FoodieToggle';
import Dropdown, { isDropdown } from '../core/Dropdown';
import SeqChoice, { isSeqChoice } from '../core/SeqChoice';
// import { Field } from '@headlessui/react';

const SUPPORTED_COMPONENTS: SupportedComponents = {
    'text': FoodieText,
    'dropdown': Dropdown,
    'seqchoices': SeqChoice
}

function renderField<T extends FieldOpts | DropdownOpts | SequenceChoiceOpts>(
    fieldComponent: FC<T>,
    props: T
  ): JSX.Element {
    // alert('renderField');
    // alert(`renderField props: ${JSON.stringify(props)}`);
    return React.createElement(fieldComponent, props); 
}

const ToggleAction: FC<ToggleActionOpts> = ({ toggle, children, linkedExternalVal, isLoading }) => {
    const borderOn = false;
    // const borderOn = true;

    const { fieldName, toggleName, state, info, onToggleChange, readOnly } = toggle;

    const [isOn, setIsOn] = useState<boolean>(!!state.valueOf());
    // const [childComponent, setChildComponent] = useState(FoodieText);
    const [childEle, setChildEle] = useState<FC<FieldOpts> | FC<DropdownOpts> | FC<SequenceChoiceOpts>>();
    const [offChildEle, setOffChildEle] = useState<FC<FieldOpts> | FC<DropdownOpts> | FC<SequenceChoiceOpts>>();
    const [isRow, setIsRow] = useState<boolean>(false);

    const getElement = (child: Child, readOnly: boolean | undefined) => {
        const { component, opts } = child;
        const coreComponent: FC<FieldOpts> | FC<DropdownOpts> | FC<SequenceChoiceOpts> = SUPPORTED_COMPONENTS[component.valueOf()];

        // let processedOpts: (FieldOpts | DropdownOpts | SequenceChoiceOpts) = opts;
        let processedOpts: FieldOpts | DropdownOpts | SequenceChoiceOpts = opts;

        // alert( `Processed opts: ${JSON.stringify(processedOpts)}`);

       /*  if (component.valueOf() == 'dropdown' && !opts.selectedCallback) {
            alert(`selectedCallback is missing: keys [${JSON.stringify(opts)}]`)
        } */

        if (readOnly) {
            processedOpts = { ...opts, readOnly: true }; 
        }

        // return renderField(coreComponent, opts)

        // let opts = processedOpts as SequenceChoiceOpts;
        // return <SeqChoice { ...processedOpts as SequenceChoiceOpts } />;

        // return <Dropdown {...processedOpts} />

        if (isFoodieText(coreComponent)) {
            // alert('Foodie');
            let opts = processedOpts as FieldOpts;
            // return React.createElement(coreComponent, opts);
            return renderField(coreComponent, opts);
        } else if (isDropdown(coreComponent)) {
            let opts = processedOpts as DropdownOpts;
            return React.createElement(coreComponent, opts);
            // return renderField(coreComponent, opts);
        } else {
            // alert ('Seq choice')
            let opts = processedOpts as SequenceChoiceOpts;
            return <SeqChoice { ...opts } />;
            // return React.createElement(coreComponent, opts)
            // return renderField(coreComponent, opts);
        }
    }

    const activate = (isToggleOn: boolean) => {
        setIsOn(isToggleOn); 
        
        
        if (onToggleChange && typeof onToggleChange === 'function') {
            onToggleChange(isToggleOn);
        }

        if (isToggleOn) {
            const { on } = children;
            if (on && linkedExternalVal) {
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

                    if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                        setChildEle(onElement);
                    }
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
                    // if (on.opts )
                    if (on.opts.selectedValue && on.opts.selectedCallback) {
                        on.opts.selectedCallback(on.opts.selectedValue);
                    }
                    // alert(JSON.stringify(onElement));
                    if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                        setChildEle(onElement);
                    }
                }

                if (typeof linkedExternalVal == 'number') {
                    // let updateValue: string = linkedExternalVal;/
                    let onElement = getElement({
                        ...on,
                        opts: {
                            ...on.opts,
                            selectedValue: `${linkedExternalVal}`
                        }
                    }, readOnly);
                    if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                        setChildEle(onElement);
                    }
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
            if (isDropdown(offElement) || isFoodieText(offElement) || isSeqChoice(offElement)) {
                setOffChildEle(offElement);
            }
            
        }
        
        if (on !== undefined) {
            let onElement = getElement(on, readOnly);
            if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                setChildEle(onElement);
            }
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
        
        if (on && linkedExternalVal) {
            // alert(`typeof linkedExternalVal ${typeof linkedExternalVal}`)
            if (typeof linkedExternalVal == 'string') {
                // let updateValue: string = linkedExternalVal;/
                let onElement = getElement({
                    ...on,
                    opts: {
                        ...on.opts,
                        value: linkedExternalVal
                    }
                }, readOnly);
                if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                    setChildEle(onElement);
                }
            }

            if (linkedExternalVal instanceof Array) {
                // alert('linkedExternalVal is arrAY')
                let onElement = getElement({
                    ...on,
                    opts: {
                        ...on.opts,
                        options: linkedExternalVal
                    }
                }, readOnly);
                // alert('Got element')

                // alert(JSON.stringify(onElement));
                if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                    setChildEle(onElement);
                }
            }

            if (typeof linkedExternalVal == 'number') {
                // let updateValue: string = linkedExternalVal;/
                let onElement = getElement({
                    ...on,
                    opts: {
                        ...on.opts,
                        selectedValue: `${linkedExternalVal}`
                    }
                }, readOnly);

                // alert(`On element is Seq Choice? : ${isSeqChoice(onElement)}`);
                if (isDropdown(onElement) || isFoodieText(onElement) || isSeqChoice(onElement)) {
                    setChildEle(onElement);
                }
            }

            if (typeof linkedExternalVal == 'object') {
                // alert(JSON.stringify(linkedExternalVal));
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


            {isOn && <>
                {isLoading && <>loading...</>}
                {!isLoading && <>{childEle}</>}
            </>}

            {!isOn && <>{offChildEle}</>}
        </div>
    </div>);
}

export default ToggleAction;