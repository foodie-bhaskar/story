import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { DropdownOpts, Option, DropdownFormOpts, ToggleState, ToggleCore, ToggleChildren, Component } from '../App.type';
import CustomList from '../core/CustomList';
import FoodieText from '../core/FoodieText';
import ToggleAction, { BASE_TA_ROW_DROPDOWN } from '../components/ToggleAction';
import CustomOptionForm from '../core/CustomOptionForm';

const ItemForm = ({ readOnly, callbackFn, item }) => {
    const borderOn = false;
    // const borderOn = true;

    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');

    const [valid, setValid] = useState(false);

    useEffect(() => {
        if (id && id.trim() && name && name.trim()) {
          setValid(true);
        } else {
          setValid(false);
        }
    
      }, [id, name]);

    return (<div>
        <form className={`${borderOn ? 'border border-red-700': ''} pe-10 space-y-8 `}>
            <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row space-x-10`}>
                <div className='basis-1/3'>
                    <FoodieText label='ID' fieldName='id' action={setId} value={id} size='w-full'
                                    readOnly={!!readOnly}
                    />
              </div>
              <div className='basis-1/3'>
                <FoodieText label='Name' fieldName='name' action={setName} value={name} size='w-full'
                    readOnly={!!readOnly}
                />
                </div>
            </div>
            <div className={`${borderOn ? 'border border-blue-900' : ''} pe-10`}>
              <div className='inline-flex gap-2 flex-row w-full'>
                <button 
                  type='button' 
                  disabled={!valid}
                  onClick={() => callbackFn({
                    id,
                    name
                  })}
                  className={`py-2.5 px-6 text-sm rounded-md uppercase
                      ${valid 
                        ? 'cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100'
                        : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                      font-semibold text-center shadow-xs `}>
                      {item ? 'Update': 'Create' } Item
                  </button>
              </div>
            </div>
        </form>
    </div>)
}

export default ItemForm;