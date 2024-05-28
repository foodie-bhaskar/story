import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import FoodieText from '../core/FoodieText';
import { ToggleState, Placement, Component, Child, ToggleChildren, ToggleCore, ToggleActionOpts, Option } from '../App.type';
import ToggleAction from '../components/ToggleAction';

async function fetchUIResource(uiType: string, id: string) {  
  return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
      headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
      }
  })
}

const ShowExample = ({ toggleOpts, heading, description  }) => {
    const { toggle, children } = toggleOpts;
    return (
    <div className='mt-10 min-w-max bg-white rounded-lg p-10'>
      <h6 className='text-lg uppercase text-gray-500'>{heading}</h6>
      <p className='my-2 font-light text-gray-400'>{description}</p>
      <ToggleAction toggle={toggle} children={children}/>
    </div>
    )
}

const ShowExample2 = ({ toggleOpts, heading, description  }) => {
  const { toggle, children } = toggleOpts;
  const [optionName, setOptionName] = useState<string>('');

  
  return (
  <div className='mt-10 min-w-max bg-white rounded-lg p-10'>
    <h6 className='text-lg uppercase text-gray-500'>{heading}</h6>
    <p className='my-2 font-light text-gray-400'>{description}</p>
    <div className="">
        <FoodieText label='Option' fieldName='option-name' action={setOptionName} value={optionName}/>
    </div>
    <ToggleAction toggle={toggle} children={children} linkedExternalVal={optionName}/>
  </div>
  )
}

const ShowExample3 = ({ toggleOpts, heading, description, children, selectedValue }) => {

  const [cascadeType, setCascadeType] = useState('global');
  const [visibility, setVisibility] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [childs, setChilds] = useState({});

  const [ddnOptions, setDdnOptions] = useState<Option[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['dropdown', 'cascade'],
    queryFn: async () => {
        const data = await fetchUIResource('dropdown', 'brand-category');
        return data.data;
    },
    staleTime: 60 * 1000
  });

  useEffect(() => {
    const { opts } = children.on;
    const onChild: Child = {
      ...children.on,
      opts: {
        ...opts,
        selectedCallback: (valueObj: any) => {
          let val = valueObj.value;
          setCascadeType(val);
        },
        ...(selectedValue && { selectedValue })
      }
    }
    setChilds({
      on: onChild,
      off: children.off,
      placement: children.placement
    });
  }, []);

  useEffect(() => {

    if (!visibility) {
      setCascadeType('global');
    }

  }, [visibility]);

  useEffect(() => {
    if (isPending) {
      setIsLoading(true)
    } else {
      setIsLoading(false);

      if (error) {
        alert(error.response.data);
        if (error.response && error.response.status == '404') {
        }
      } else {
        if (data.result && data.result.options) {
          setDdnOptions([{ name: ' --- please select --- '}, ...data.result.options]);
      }
    }  
  }

  }, [isPending, error, data]);
  
  return (
    <div className='mt-10 min-w-max bg-white rounded-lg p-10'>
      <h6 className='text-lg uppercase text-gray-500'>{heading}</h6>
      <p className='my-2 font-light text-gray-400'>{description}</p>
      <div className="">
          <FoodieText label='Visibility' fieldName='visibility' value={cascadeType} readOnly={true} />
      </div>
      <ToggleAction toggle={{
          ...toggleOpts, 
          onToggleChange: (isOn: boolean) => {
            setVisibility(isOn);
          }
        }} 
        children={childs} isLoading={isLoading} linkedExternalVal={ddnOptions}/>
    </div>
  );
}

const ShowcaseToggle = () => {

  const [linkedExternalVal, setLinkedExternalVal] = useState<string>('');
  
  const toggleDuplicateText: ToggleCore = {
    fieldName: 'value',
    toggleName: 'Value',
    state: ToggleState.On,
    info: 'keep value same as the option name'
  }

  const toggleCascadeSelect: ToggleCore = {
    fieldName: 'cascade',
    toggleName: 'Visibility',
    state: ToggleState.Off,
    info: 'is part of cascade dropdown'
  }

  const dropdownChildOpts: Child = {
    component: Component.DROPDOWN,
    opts: {
      options: [
        { value: '', name: 'please select'},
        { name: 'Brand Category', value: 'brand-category'},
        { name: 'Brand Format', value: 'brand-format'}
      ],
      name: 'Cascade'
    }
  }

  const dropdownEmptyChildOpts: Child = {
    component: Component.DROPDOWN,
    opts: {
      options: [
        { value: '', name: ' --- please select --- '}
      ],
      name: 'Cascade'
    }
  }

  const textChildOpts: Child = {
    component: Component.TEXT,
    opts: {
      label: 'Value',
      fieldName: 'value'
    }
  }

  const textReadOnlyChildOpts: Child = {
    component: Component.TEXT,
    opts: {
      label: 'Value',
      fieldName: 'value',
      readOnly: true,
      value: 'Wett Gravy'
    }
  }

  const children = {
    off: textChildOpts,
    linkedExternalVal: 'init value'
  }

  const taOpts = {
    toggle: toggleDuplicateText,
    children: children
  }

  const toggleOptsEx2 = {
    toggle: toggleDuplicateText,
    children: {
      on: textReadOnlyChildOpts,
      off: textChildOpts,
      placement: Placement.BELOW
    }
  }

  const toggleOptsEx3 = {
    toggle: { ...toggleDuplicateText, readOnly: true },
    children: {
      on: textReadOnlyChildOpts,
      off: textChildOpts,
      placement: Placement.BELOW
    }
  }

    /* const toggleEx1b = { ...toggleEx1, active: true };
    const toggleEx1c = { ...toggleEx1, readOnly: true, active: true };

    const toggleEx4 = {
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

    const toggleEx4b = { ...toggleEx4, active: true };
    const toggleEx4c = { ...toggleEx4, active: true, activeValue: 'brand-format' };
    const toggleEx4d = { ...toggleEx4, active: true, readOnly: true, activeValue: 'brand-format' }; */

    /* useEffect(() => {
      function keepWriting() {
        setTimeout(() => {
            setLinkedExternalVal('B');
        }, 1000);
  
        setTimeout(() => {
          setLinkedExternalVal('Bh')
        }, 2000);
  
        setTimeout(() => {
          setLinkedExternalVal('Bh')
        }, 3000);
      }
  
      keepWriting();
    }) */

    return (<div className='border border-blue-600'>
        <h1 className='uppercase w-fit'>Toggle Action Showcase</h1>
        <div className="flex flex-col py-4 w-full gap-4 border border-blue-600 pe-10">
        <div className="flex flex-row border-blue-600 justify-between">
            <ShowExample3 
              toggleOpts={{...toggleCascadeSelect, state: ToggleState.Off }}
              children={{
                on: dropdownEmptyChildOpts
              }}
              description="Allow to be a part of cascade dropdown, off and loading"
              heading="Dropdown >> right" 
            />

            <ShowExample3 
              toggleOpts={{...toggleCascadeSelect, state: ToggleState.On }}
              children={{
                on: dropdownEmptyChildOpts
              }}
              description="Allow to be a part of cascade dropdown, off and loading"
              heading="Dropdown >> right" 
              selectedValue="snacks"
            />

            <ShowExample3 
              toggleOpts={{...toggleCascadeSelect, state: ToggleState.On, readOnly: true }}
              children={{
                on: dropdownEmptyChildOpts
              }}
              description="Allow to be a part of cascade dropdown, on and loading and readOnly"
              heading="Dropdown >> right" 
              selectedValue="beverages"
            />
  
            {/* <ShowExample3 
              toggleOpts={{...toggleCascadeSelect, state: ToggleState.On, readOnly: true  }}
              children={{
                on: dropdownChildOpts
              }}
              description="Allow to be a part of cascade dropdown, on and selected"
              heading="Dropdown >> right" 
              selectedValue="brand-category"
            /> */}
          </div>
        <div className="flex flex-row border-blue-600 justify-between">
            <ShowExample3 
              toggleOpts={{...toggleCascadeSelect, state: ToggleState.On }}
              children={{
                on: dropdownChildOpts
              }}
              description="Allow to be a part of cascade dropdown, on and selected"
              heading="Dropdown >> right" 
              selectedValue="brand-format"
            />
  
            <ShowExample3 
              toggleOpts={{...toggleCascadeSelect, state: ToggleState.On, readOnly: true  }}
              children={{
                on: dropdownChildOpts
              }}
              description="Allow to be a part of cascade dropdown, on and selected"
              heading="Dropdown >> right" 
              selectedValue="brand-category"
            />
          </div>

          <div className="flex flex-row border-blue-600 justify-start gap-4">
            {<ShowExample 
              toggleOpts={taOpts}
              description="Duplicate text field, turn off to override"
              heading="Textbox >> RIGHT (Default) >> NO ON CHILD" />}
            
            {<ShowExample2 
              toggleOpts={toggleOptsEx2}
              description="Duplicate text field, readonly textfield updated externally"
              heading="Textbox >> BELOW" 
              linked={linkedExternalVal} /> 
            }
             {<ShowExample2 
              toggleOpts={toggleOptsEx3}
              description="Duplicate text field, readonly toggle"
              heading="Textbox >> BELOW" 
              linked={linkedExternalVal} /> 
            }
            
        </div>

        <div className="flex flex-row border-blue-600 justify-between">
            
          <ShowExample3 
            toggleOpts={toggleCascadeSelect}
            children={{
              on: dropdownChildOpts
            }}
            description="Allow to be a part of cascade dropdown, off"
            heading="Dropdown >> right" 
          />

          <ShowExample3 
            toggleOpts={{...toggleCascadeSelect, state: ToggleState.On }}
            children={{
              on: dropdownChildOpts
            }}
            description="cascade dropdown, on, nothing selected"
            heading="Dropdown >> right" 
          />
        </div>
            {/*
        <div className="flex flex-row border-blue-600 justify-between">
            
            <ShowExample 
                toggle={toggleEx4c} 
                description="cascade dropdown, on and selected"
                heading="Dropdown >> right" />
  
              <ShowExample 
                toggle={toggleEx4d} 
                description="On, pre selected and readonly"
                heading="Dropdown >> right" />
          </div> */}
      </div>
  </div>)
}

export default ShowcaseToggle;