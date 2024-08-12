import { useState, useEffect, FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Option, FormType, Weight, ItemFormOpts } from '../App.type';
import FoodieText from '../core/FoodieText';
import FoodieCheckbox from '@/core/FoodieCheckbox';
import Dropdown from '../core/Dropdown';
import WeightCombo from '../components/WeightCombo';
import BuildUpCombo from '../components/BuildUpCombo';
import CascadeCombo from '../components/CascadeCombo';
import { fetchUIResource } from '../api/api';
import { capitalizeWords } from "@/lib/utils";

const stages = [
  { label: 'Raw Material Cost', field: 'raw'},
  { label: 'Pre Commission Cost', field: 'preComm'},
  { label: 'Post Aggregator Cost', field: 'postAgg'},
  { label: 'Post Store Cost', field: 'postStore'}
];

const ItemForm: FC<ItemFormOpts> = ({ formType, callbackFn, item }) => {
    const borderOn = false;
    // const borderOn = true;

    const [id, setId] = useState<string>(item && item.assetId? item.assetId : '');
    const [name, setName] = useState<string>(item && item.name? item.name : '');
    const [vendor, setVendor] = useState<string>(item && item.vendor? item.vendor : 'foodieverse');
    const [vendorOptions, setVendorOptions] = useState<Option[]>([{ value: '', name: ' --- please select --- '}]);
    const [isVendorOptionsLoading, setIsVendorOptionsLoading] = useState(true);
    const [weight, setWeight] = useState<Weight>(item && item.weight? item.weight : { main: 0, gravy: 0, total: 0});
    const [cost, setCost] = useState<Option []>([]);
    const [typeCombo, setTypeCombo] = useState<Option []>([]);
    const [cuisineCombo, setCuisineCombo] = useState<Option []>([]);
    const [isPacket, setIsPacket] = useState<boolean>(item ? item.isPacket: true);
    const [isVeg, setIsVeg] = useState<boolean>(item && item.isVeg? true : false);
    const [changes, setChanges] = useState({});

    const { isPending, isFetching, error, data } = useQuery({
      queryKey: ['dropdown', 'vendor'],
      queryFn: async () => {
          const data = await fetchUIResource('dropdown', 'vendor');
          // alert(JSON.stringify(data.data.result.options))
          return data.data;
      },
      staleTime: Infinity,
      enabled: formType != FormType.VIEW
    });

    const [valid, setValid] = useState(false);

    useEffect(() => {
      let isValid = false;
      if (formType == FormType.CREATE) {
        if (id && id.trim() && name && name.trim() && vendor && cost.length > 0) {
          isValid = true;
        }
      } else if (item) {
        let payload = {};
        if (name && name.trim() != item.name) {
          isValid = true;
          payload = { ...payload, name: name.trim() };
        }

        if (isVeg != item.isVeg) {
          isValid = true;
          payload = { ...payload, isVeg };
        }

        if (vendor != item.vendor) {
          isValid = true;
          payload = { ...payload, vendor };
        }

        if (isPacket != item.isPacket) {
          isValid = true;
          payload = { ...payload, isPacket };
        }

        if ((weight.main != item.weight.main) || (weight.gravy != item.weight.gravy)) {
          isValid = true;
          payload = { ...payload, weight };
        }

        if (cost.find((c, i) => (c.value != item.costBuildup[i].value))) {
          isValid = true;
          payload = { ...payload, costBuildup: cost };
        }

        if (item.typeCombo.length != typeCombo.length
          || (typeCombo.find((t, i) => (t.value != item.typeCombo[i].value)))) {
          isValid = true;
          payload = { ...payload, typeCombo };
        }

        if (item.cuisineCombo.length != cuisineCombo.length
          || (cuisineCombo.find((t, i) => (t.value != item.typeCombo[i].value)))) {
          isValid = true;
          payload = { ...payload, cuisineCombo };
        }

        setChanges(payload);
      }
      setValid(isValid);
  
    }, [id, name, vendor, cost, isVeg, isPacket, weight, cost, typeCombo, cuisineCombo, formType, item]);

    useEffect(() => {
      if (isFetching) {
        // alert(`IsPending: ${isFetching}`)
        setIsVendorOptionsLoading(true)
      } else if (!isPending) {
        setIsVendorOptionsLoading(false);
  
        if (error) {
          // if (error.response) {
          // alert(error.response.data);
          // if (error.response && error.response.status == '404') {
          // }
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


    return (<div className={`${borderOn ? 'border border-red-700': ''} pe-10 space-y-20 `}>
          <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row space-x-10`}>
            <div className='basis-1/3'>
              <FoodieText label='ID' fieldName='id' 
                action={setId} 
                value={id}
                size='w-full'
                readOnly={formType != FormType.CREATE}
              />
            </div>
            <div className='basis-1/3'>
              <FoodieText label='Name' fieldName='name' action={setName} value={name} size='w-full' 
                readOnly={formType != FormType.CREATE}
              />
            </div>            
            <div className='basis-1/3'>
              <FoodieCheckbox label='Veg' info='Is veg item?' checked={isVeg} checkFn={setIsVeg}
                readOnly={formType == FormType.VIEW}
              />
            </div>
          </div>


          <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row space-x-10`}>
           <div className='basis-1/3'>
              {formType == FormType.VIEW && item 
              ? <Dropdown 
                  readOnly={true}
                  selectedValue={vendor} 
                  options={[{ name: capitalizeWords(item.vendor), value: item.vendor}]}
                  name='Vendor'
                />
              : (isVendorOptionsLoading ? 'Loading vendors...': 
                <Dropdown 
                  options={vendorOptions} selectedValue={vendor} 
                  selectedCallback={(valObj: Option) => setVendor(valObj.value)} 
                  name='Vendor'
                />)
              }
            </div>
            <div className='basis-2/3'>
              <FoodieCheckbox label='Packet Status' info='It is a packet' checked={isPacket} checkFn={setIsPacket}
                readOnly={formType == FormType.VIEW}
              />
              {/* <ToggleComplex toggle={packetToggle} component={component} /> */}
            </div>
          </div>
          <WeightCombo update={setWeight} wt={weight} readOnly={formType == FormType.VIEW} />
          <BuildUpCombo 
            stages={stages.map((s, i) => ({ ...s, value: item ? parseInt(item.costBuildup[i].value) : 0 }))} 
            name='Cost Buildup' update={setCost}  readOnly={formType == FormType.VIEW} />

          <CascadeCombo 
            cascade='item-type' 
            hierarchy={['item-type', 'item-sub-type', 'item-sub-sub-type']} 
            update={setTypeCombo}
            value={item ? item.typeCombo: undefined}
            readOnly={formType == FormType.VIEW}
          />

          <CascadeCombo 
            cascade='cuisine' 
            hierarchy={['cuisine', 'sub-cuisine']} 
            update={setCuisineCombo}
            value={item ? item.cuisineCombo: undefined}
            readOnly={formType == FormType.VIEW}
          />

          <div className={`${borderOn ? 'border border-blue-900' : ''} pe-10`}>
            {formType != FormType.VIEW && <div className='inline-flex gap-2 flex-row w-full'>
              {callbackFn && <button 
                type='button' 
                disabled={!valid}
                onClick={() => {
                  if (formType == FormType.CREATE) {
                    callbackFn({
                      id, name, vendor, isVeg,
                      weight, cost, typeCombo,
                      cuisineCombo, isPacket
                    })
                  } else {
                    callbackFn({ ...changes })
                  }
                }}
                className={`py-2.5 px-6 text-sm rounded-md uppercase
                    ${valid 
                      ? 'cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100'
                      : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                    font-semibold text-center shadow-xs `}>
                    {item ? 'Update': 'Create' } Item
                </button>}
            </div>}
          </div>
    </div>)
}

export default ItemForm;