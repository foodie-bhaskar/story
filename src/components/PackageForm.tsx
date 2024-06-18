import { FC, useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Dropdown from "@/core/Dropdown";
import Choice from "@/core/Choice";
import SeqChoice from "@/core/SeqChoice";
import FoodieText from "@/core/FoodieText";
import { Option } from '../App.type';
import CascadeCombo from '../components/CascadeCombo';

async function fetchUIResource(uiType: string, id: string) {  
  return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
      headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
      }
  })
}

type PackageFormOpts = {
  callbackFn: Function
}

const PackageForm: FC<PackageFormOpts> = ({ callbackFn }) => {
  const [size, setSize] = useState<string>('S');
  const [type, setType] = useState<string>();
  const [containerTypes, setContainerTypes] = useState<Option[]>([{ value: '', name: ' --- please select --- '}]);
  const [compartments, setCompartments] = useState<number>(1);
  const [pkgCost, setPkgCost] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [packagingTypeCombo, setPackagingTypeCombo] = useState([]);

  const [valid, setValid] = useState(false);

  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ['dropdown', 'container-type'],
    queryFn: async () => {
      try {
        const data = await fetchUIResource('dropdown', 'container-type');
        // alert(data);
        return data.data;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: Infinity,
    enabled: true
  });

  let borderOn = false;
  // borderOn = true;

  useEffect(() => {
      if (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            alert(error.response.data);
          }
        }
      } else if (data && data.result && data.result.options) {
          setContainerTypes([
            { value: '', name: ' --- please select --- '},
            ...data.result.options
          ]);
        }
  }, [isPending, isFetching, error, data]);

  useEffect(() => {
    if (type && size && compartments && pkgCost) {
      setValid(true);
    } else {
      setValid(false);
    }

  }, [type, size, compartments, pkgCost]);

  return (<div className={`${borderOn ? 'border border-red-700': ''} pe-10 space-y-10 `}>
      <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row`}>
            <div className='basis-1/3'>
              {isPending 
                ? 'Fetching container types ....'
                : <Dropdown 
                    options={containerTypes}
                    selectedCallback={(valObj: Option) => setType(valObj.value)} 
                    name='Container Type'
                  />
              }
            </div>
            <div className='basis-2/3'>
              <Choice
                choices={["S", "M", "L"]}
                label="Size"
                selectedValue={size}
                selectedCallback={setSize}
                position="BELOW"
              />
            </div>            
          </div>
     

    <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row space-x-10`}>
      <div className=''>
        <FoodieText label='Capacity (in mL)' fieldName='capacity' action={(ml: string) => setCapacity(parseInt(ml))}  size='w-80'/>
      </div>

      <div className='basis-2/3'>
        <SeqChoice
          label='Compartments'
          size={9} 
          step={1}
          selectedValue={'1'}
          selectedCallback={(c: string) => setCompartments(parseInt(c))} 
          position="BELOW"
          />
      </div>
    </div>
    <div className={`${borderOn ? 'border border-green-800' : ''} flex flex-row space-x-10`}>
      <div className=''>
        <FoodieText label='Packaging Cost' fieldName='pkgCost' action={(cost: string) => setPkgCost(parseInt(cost))}  size='w-80'/>
      </div>
      <div className='basis-2/3'>
        <FoodieText label='Image URL' fieldName='imgURL' action={setImgUrl}  size='w-full'/>
      </div>
    </div>
    <CascadeCombo 
      cascade='packaging-type' 
      hierarchy={['packaging-type', 'packaging-sub-type']} 
      update={setPackagingTypeCombo}
    />
    <div className={`${borderOn ? 'border border-blue-900' : ''} pe-10`}>
      <div className='inline-flex gap-2 flex-row w-full'>
        <button 
          type='button' 
          disabled={!valid}
          onClick={() => callbackFn({
            type, size, compartments, 
            pkgCost, capacity, imgUrl,
            packagingTypeCombo
          })}
          className={`py-2.5 px-6 text-sm rounded-md uppercase
              ${valid 
                ? 'cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100'
                : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
              font-semibold text-center shadow-xs `}>
              Create Packaging
          </button>
      </div>
    </div>
  </div>);
}

export default PackageForm;