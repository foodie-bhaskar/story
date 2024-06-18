import { FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { Option, DropdownFormOpts, ToggleState, ToggleCore, DYNA_TYPE, DynamicFieldProps } from '../App.type';
import CustomList from '../core/CustomList';
import FoodieText from '../core/FoodieText';
import ToggleComplex from '@/components/ToggleComplex';
import CustomOptionForm from '../core/CustomOptionForm';

async function fetchUIResource(uiType: string, id: string) {  
  return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
      headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
      }
  })
}

const DropdownResource: FC<DropdownFormOpts> = ({ name, cascade, cascadeOptions, options, callbackFn, readOnly }) => {

  // dev
  let borderOn = false;
  // borderOn = true;

  const [ddnOptions, setDdnOptions] = useState<Option[]>(options || []);
  const [valid, setValid] = useState(false);

  const [dropdownName, setDropdownName] = useState(name);
  const [cascadeType, setCascadeType] = useState(cascade || 'global');
  const [visibility, setVisibility] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cascades, setCascades] = useState<Option[]>(cascadeOptions || [{ value: '', name: ' --- please select --- '}]);
 
  const visibilityToggle: ToggleCore = {
    fieldName: 'cascade',
    toggleName: 'Visibility',
    state: cascade == 'global' || !cascade ? ToggleState.Off: ToggleState.On,
    info: 'is part of cascade dropdown',
    readOnly: !!readOnly || !!name,
    onToggleChange: (isOn: boolean) => {
      setVisibility(isOn);
    }
  }

  const serverDropdownComponent: DynamicFieldProps = {
    type: DYNA_TYPE.DROPDOWN,
    fieldProps: {
      options: cascades,
      name: 'Cascade',
      selectedCallback: function (valueObj: any) {  
          let val = valueObj.value;
          alert(`Cascade chosen : ${val}`);
          setCascadeType(val);
      }
    }
  }

  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ['dropdown', 'cascade'],
    queryFn: async () => {
      try {
        const data = await fetchUIResource('dropdown', 'cascade');
        // alert(JSON.stringify(data.data.result.options))
        return data.data;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: Infinity,
    enabled: !name
  });

  const deleteOption = (value: string) => {
    // alert(`Deleting ${value}`)
    setDdnOptions(ddnOptions.filter(o => o.value !== value));
  }

  const addToList = (name: string, value: string) => {

    const names = ddnOptions.map(o => o.name);
    const values = ddnOptions.map(o => o.value);

    if (!names.includes(name.trim()) && !values.includes(value.trim())) {
      if (name.trim() == value.trim()) {
        let tokens = value.trim().split(' ');
        let valueString = tokens.map(t => t.toLowerCase()).join('-');
        setDdnOptions([...ddnOptions, { name: name.trim(), value: valueString }]);
      } else {
        setDdnOptions([...ddnOptions, { name: name.trim(), value: value.trim() }]);
      }
    } else {
      if (names.includes(name)) {
        alert(`Option name [${name}] already exists`);
      }

      if (values.includes(value)) {
        alert(`Option value [${value}] already exists`);
      }
    }
  }

  useEffect(() => {
    // alert(`Visibility[${visibility}] :: cascadeType[${cascadeType}]`);
    if (dropdownName && cascadeType && dropdownName.trim() && ddnOptions.length) {
      let validOptions = (visibility && cascadeType !== 'global') || !visibility;

      // alert(`validOptions ${validOptions}`)
      setValid(validOptions);
    } else {
      setValid(false);
    }

  }, [dropdownName, cascadeType, ddnOptions, visibility]);

  useEffect(() => {
    if (isFetching) {
      // alert(`IsPending: ${isFetching}`)
      setIsLoading(true)
    } else if (!isPending) {
      setIsLoading(false);

      if (error) {
        if (axios.isAxiosError(error)) {
          if (error.response)
          alert(error.response.data);
        } else {
          alert(error.message);
        }
      } else {
        if (data.result && data.result.options) {
            setCascades([
                { value: '', name: ' --- please select --- '},
                ...data.result.options
            ])
        }
      }  
    }
  }, [isPending, isFetching, error, data]);

    return (<div className=' bg-white rounded-lg border border-gray-400 py-10 h-max'>
      <div className={`${borderOn ? 'border-red-800': ''} mt-10 flex flex-row min-h-10 min-w-max justify-between`}>

        <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-4/6 max-w-[600px]`}>

          <form className={`${borderOn ? 'border border-red-700': ''} ml-10 pe-10 space-y-8 `}>
            <div className={`${borderOn ? 'border border-green-800' : ''}`}>
              <FoodieText label='Name' fieldName='name' action={setDropdownName} value={dropdownName} size='w-full'
                readOnly={!!name || !!readOnly}
              />
            </div>
            <div className={`${borderOn ? 'border border-green-800' : ''}`}>
              <ToggleComplex toggle={visibilityToggle} component={serverDropdownComponent} linkedExternalVal={cascades}
                isLoading={isLoading} />
              {/* <ToggleAction toggle={visibilityToggle}
                children={children} isLoading={isLoading} linkedExternalVal={cascadeOptions}/> */}
            </div>
            {!readOnly && <><div className={`${borderOn ? 'border border-green-800' : ''}`}>
              <CustomOptionForm action={addToList} />
            </div>
            <div className={`${borderOn ? 'border border-blue-900' : ''} pe-10`}>
              <div className='inline-flex gap-2 flex-row w-full'>
                <button 
                  type='button' 
                  disabled={!valid}
                  onClick={() => {
                    if (callbackFn && typeof callbackFn == 'function') {
                      callbackFn({
                        dropdownName,
                        cascadeType,
                        visibility,
                        ddnOptions
                      })
                    }
                  }}
                  className={`py-2.5 px-6 text-sm rounded-md uppercase
                      ${valid || isFetching
                        ? 'cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100'
                        : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                      font-semibold text-center shadow-xs `}>
                      {name ? 'Updat': 'Creat' }e Dropdown
                  </button>
              </div>
            </div>
            </>}
          </form>
        </main>
        <aside className=" basis-2/6">
          {ddnOptions.length > 0 && 
            <div className="sticky top-0 p-4 w-full h-full rounded-lg border-l border-pink-500">
              <CustomList options={ddnOptions} optionAction={deleteOption} readOnly={readOnly} />
            </div>
          }
        </aside>
      </div> 
    </div>);
}

export default DropdownResource;
