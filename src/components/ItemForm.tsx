import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Weight } from '../App.type';
import { DropdownOpts, Option, DropdownFormOpts, ToggleState, ToggleCore, ToggleChildren, Component } from '../App.type';
import CustomList from '../core/CustomList';
import FoodieText from '../core/FoodieText';
import ToggleAction, { BASE_TA_ROW_DROPDOWN } from '../components/ToggleAction';
import CustomOptionForm from '../core/CustomOptionForm';
import Dropdown from '../core/Dropdown';
import WeightCombo from '../components/WeightCombo';
import BuildUpCombo from '../components/BuildUpCombo';
import CascadeCombo from '../components/CascadeCombo';

const stages = [
  { label: 'Raw Material Cost', field: 'raw'},
  { label: 'Pre Commission Cost', field: 'preComm'},
  { label: 'Post Aggregator Cost', field: 'postAgg'},
  { label: 'Post Store Cost', field: 'postStore'}
];

async function fetchUIResource(uiType: string, id: string) {  
  return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
      headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
      }
  })
}

const ItemForm = ({ readOnly, callbackFn, item }) => {
    const borderOn = false;
    // const borderOn = true;

    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [vendor, setVendor] = useState<string>('foodieverse');
    const [vendorOptions, setVendorOptions] = useState<Option[]>([{ value: '', name: ' --- please select --- '}]);
    const [isVendorOptionsLoading, setIsVendorOptionsLoading] = useState(true);
    const [weight, setWeight] = useState<Weight>({ main: 0, gravy: 0, total: 0});
    const [cost, setCost] = useState([]);

    const { isPending, isFetching, error, data } = useQuery({
      queryKey: ['dropdown', 'vendor'],
      queryFn: async () => {
          const data = await fetchUIResource('dropdown', 'vendor');
          // alert(JSON.stringify(data.data.result.options))
          return data.data;
      },
      staleTime: Infinity,
      enabled: !name
    });

    const [valid, setValid] = useState(false);

    useEffect(() => {
      if (id && id.trim() && name && name.trim() && vendor && cost.length > 0) {
        setValid(true);
      } else {
        setValid(false);
      }
  
    }, [id, name, vendor, cost]);

    useEffect(() => {
      if (isFetching) {
        // alert(`IsPending: ${isFetching}`)
        setIsVendorOptionsLoading(true)
      } else if (!isPending) {
        setIsVendorOptionsLoading(false);
  
        if (error) {
          alert(error.response.data);
          if (error.response && error.response.status == '404') {
          }
        } else {
          if (data.result && data.result.options) {
            setVendorOptions([
              { value: '', name: ' --- please select --- '},
              ...data.result.options
            ]);
          }
        }  
      }
    }, [isPending, isFetching, error, data]);


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

              <div className='basis-1/3'>
                {isVendorOptionsLoading ? 'Loading vendors...': 
                <Dropdown 
                  options={vendorOptions} selectedValue={'foodieverse'} 
                  selectedCallback={(valObj: Option) => setVendor(valObj.value)} 
                  name='Vendor' readOnly={!!readOnly}
                />}
              </div>
            </div>
            <WeightCombo update={(wt) => {
              setWeight(wt);
            }}/>
            <BuildUpCombo stages={stages} name='Cost Buildup' update={setCost}/>

            <CascadeCombo 
              cascade='item-type' 
              hierarchy={['item-type', 'item-sub-type', 'item-sub-sub-type']} 
              update={(data) => {
                alert(JSON.stringify(data.map(s => s.value).join(' > ')));
              }}/>
            <div className={`${borderOn ? 'border border-blue-900' : ''} pe-10`}>
              <div className='inline-flex gap-2 flex-row w-full'>
                <button 
                  type='button' 
                  disabled={!valid}
                  onClick={() => callbackFn({
                    id,
                    name,
                    vendor,
                    weight,
                    cost
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