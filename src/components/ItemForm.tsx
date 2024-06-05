import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { DropdownOpts, Option, DropdownFormOpts, ToggleState, ToggleCore, ToggleChildren, Component } from '../App.type';
import CustomList from '../core/CustomList';
import FoodieText from '../core/FoodieText';
import ToggleAction, { BASE_TA_ROW_DROPDOWN } from '../components/ToggleAction';
import CustomOptionForm from '../core/CustomOptionForm';

const ItemForm = ({ readOnly}) => {
    // const borderOn = false;
    const borderOn = true;

    const [id, setId] = useState();
    const [name, setName] = useState();

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
        </form>
    </div>)
}

export default ItemForm;