import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import ToggleComplex from "@/components/ToggleComplex";
import { DYNA_TYPE, DynamicFieldProps, ToggleCore, ToggleState, Option } from "@/App.type";
// import CustomOptionForm from '@/core/CustomOptionForm';

const CASCADE_OPTIONS: Option[] = [
    { value: 'brand-category', name: 'Brand Category' }
];

async function fetchUIResource(uiType: string, id: string) {  
    return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
}

const Showcase= () => {

    const [cascades, setCascades] = useState<Option[]>([{ value: '', name: ' --- please select --- '}]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    // const [isPacket, setIsPacket] = useState<boolean>(false);
    // const [preset, setPreset] = useState<number | undefined>();
    // const [isSameAsName, setIsSameAsName] = useState<boolean>(true);

   /*  const textComponent: DynamicFieldProps = {
        type: DYNA_TYPE.TEXT,
        fieldProps: {
            label: 'Value',
            fieldName: 'value',
            readOnly: true,
            value: ''
        }
    }

    const toggleDuplicateText: ToggleCore = {
        fieldName: 'value',
        toggleName: 'Value',
        state: ToggleState.On,
        info: 'keep value same as the option name',
        onToggleChange: setIsSameAsName
    }

    const packetToggle: ToggleCore = {
        fieldName: 'packet',
        toggleName: 'Packet Status',
        state: isPacket ? ToggleState.Off: ToggleState.On,
        info: 'is not a packet',
        readOnly: false,
        onToggleChange: (isOn: boolean) => {
          setIsPacket(isOn);
        }
    } 

    const component: DynamicFieldProps = {
        type: DYNA_TYPE.CHOICE,
        fieldProps: {
            label: 'Consumption', 
            size: 5, 
            selectedCallback(s: string ) { console.log(s) }
        }
    }
 */
   

   /*  const offComponent: DynamicFieldProps = {
        type: DYNA_TYPE.TEXT,
        fieldProps: {
            label: 'Not a unit', 
            error: 'use caution'
        }
    } */

    const visibilityToggle: ToggleCore = {
        fieldName: 'cascade',
        toggleName: 'Visibility',
        state: ToggleState.On,
        info: 'is part of cascade dropdown',
        // readOnly: !!readOnly || !!name,
        onToggleChange: (isOn: boolean) => {
          alert(`Visibility: ${isOn}`);
        //   setVisibility(isOn);
        }
    }

    const serverDropdownComponent: DynamicFieldProps = {
        type: DYNA_TYPE.DROPDOWN,
        fieldProps: {
            options: CASCADE_OPTIONS,
            name: 'Cascade',
            selectedCallback: function (valueObj: any) {  
                let val = valueObj.value;
                alert(`Cascade chosen : ${val}`);
                // setCascadeType(val);
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
        enabled: true
    });

    /* const addToList = (name: string, value: string) => {
        alert(`${name}: ${value}`)
    } */

    /* useEffect(() => {
        async function update() {
            setTimeout(() => {
                // alert(5);
                setCascades([
                    { name: 'Brand Type', value: 'brand-type' },
                    { name: 'Brand Category', value: 'brand-category' },
                ])
            }, 2000);
        }
        update();
    }, []); */

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

    return (<div className='lg-w-full mx-auto space-y-10'>
        <p>Showcase test of Toggle Complex</p>

        {/* <ToggleComplex toggle={toggleDuplicateText} component={textComponent} placement={Placement.BELOW}/> */}

        {/* <ToggleComplex toggle={packetToggle} component={component} linkedExternalVal={preset} /> */}

        <ToggleComplex toggle={visibilityToggle} component={serverDropdownComponent} linkedExternalVal={cascades}
            isLoading={isLoading}/>

        {/* <CustomOptionForm action={addToList} /> */}
    </div>)
}

export default Showcase;