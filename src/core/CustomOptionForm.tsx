import { FC, useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ToggleState, Placement, ToggleCore, DYNA_TYPE, DynamicFieldProps, FormAction } from '../App.type';
import FoodieText from './FoodieText';
import ToggleComplex from '@/components/ToggleComplex';

const CustomOptionForm: FC<FormAction> = ({ action }) => {
    let borderOn = false;
    // borderOn = true;

    const [optionName, setOptionName] = useState<string>('');
    const [optionVal, setOptionVal] = useState<string>('');
  
    const [ready, setReady] = useState<boolean>(false);
    const [isSameAsName, setIsSameAsName] = useState<boolean>(true);

    const textReadOnlyComponent: DynamicFieldProps = {
        type: DYNA_TYPE.TEXT,
        fieldProps: {
            label: 'Value',
            fieldName: 'value',
            readOnly: true,
            value: ''
        }
    }

    const textComponent: DynamicFieldProps = {
        type: DYNA_TYPE.TEXT,
        fieldProps: {
            label: 'Value',
            fieldName: 'value',
            action: setOptionVal
        }
    }

    const toggleDuplicateText: ToggleCore = {
        fieldName: 'value',
        toggleName: 'Value',
        state: ToggleState.On,
        info: 'keep value same as the option name',
        onToggleChange: setIsSameAsName
    }

    const add = () => {
        const name = `${optionName}`;
        const val = isSameAsName ? optionName: `${optionVal}`;
        
        // setOptionVal('');
        setOptionName('');
        // setReady(false);

        action(name, val);
    }

    useEffect(() => {
        if (isSameAsName) {
            if (optionName) {
                setReady(true);
            } else {
                setReady(false);
            }
        } else {
            if (optionVal && optionName) {
                setReady(true);
            } else {
                setReady(false);
            }
        }
        
    }, [optionName, optionVal, isSameAsName]);

    return (
        <fieldset className="border border-gray-500 rounded-lg pl-10 flex flex-row pt-4 pb-8 justify-between">
            <legend className='uppercase ml-10 font-medium text-gray-500 '>&nbsp;&nbsp; Create Option &nbsp;&nbsp;</legend>

            <div className={`${borderOn ? 'border border-red-800': ''} basis-5/6`}> 
                <div className="">
                    <FoodieText label='Option' fieldName='option-name' action={setOptionName} value={optionName}/>
                </div>

                <div className='mt-6'>
                    <ToggleComplex toggle={toggleDuplicateText} placement={Placement.BELOW} linkedExternalVal={optionName}
                        component={textReadOnlyComponent} offComponent={textComponent}/>
                </div>
            </div>

            <div className={`${borderOn ? 'border border-red-800': ''} basis-1/6 pt-7 text-center`}>
                <button type="button" onClick={add} disabled={!ready}
                    className={`${ready 
                        ? 'cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500'
                        : 'cursor-not-allowed bg-slate-100 text-slate-300'
                        } font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center
                    `}>
                    <PlusIcon className='size-6'/>
                </button>                
            </div>
        </fieldset>
    );
}
  
export default CustomOptionForm;
