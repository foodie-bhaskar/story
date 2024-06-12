import { FC, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Routes, Route, useParams } from 'react-router-dom';

import { capitalizeWords } from '@/lib/utils';
import DropdownResource, { BASE_DROPDOWN } from '../components/DropdownResource';
import { DropdownOpts, Option, DropdownFormOpts, ToggleState, ToggleCore, ToggleChildren, Component } from '../App.type';

// Define the data shape for your resource
interface UIResource {
    uiType: string,
    name: string,
    cascade: string,
    options: Option[],
    defaultValue?: string
}

async function updateUIResource(data: UIResource) {
    try {
        const { uiType, name } = data;
        return axios.put(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${name}`, 
            data,
            {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
                }
            }
        );
    } catch (error) {
        throw new Error('Hello');
        // throw new Error(error.response?.data.errorMessage); // Additional error details from the server
    }
}

async function fetchUIResource(uiType: string, id: string) {  
    return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}&id=${id}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
  }

const EditDropdownPage = () => {
    let { dropdownName } = useParams();
    const [dropdown, setDropdown ] = useState(BASE_DROPDOWN);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const queryClient = useQueryClient();

    const { isPending, error, data } = useQuery({
        queryKey: ['dropdown', dropdownName],
        queryFn: async () => {
            // alert(dropdownName);
            const data = await fetchUIResource('dropdown', dropdownName);
            // alert(JSON.stringify(data.data.result));
            return data.data.result;
        },
        staleTime: 60 * 1000
    });

    const mutation = useMutation({
        mutationFn: async (uiItem: UIResource) => {
          const response = await updateUIResource(uiItem);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
            alert(`data: ${JSON.stringify(data)}`);
            alert(`variables: ${JSON.stringify(variables)}`);
            // alert(`context: ${JSON.stringify(context)}`);
          // Query Invalidation (Recommended)
          queryClient.invalidateQueries({ queryKey: ['dropdown'] }); // Refetch the 'posts' query
    
          // Or, if you prefer, you can update the cache directly
          // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating post:', error);
          alert(error.response.data.errorMessage);
          // You can also use `context` to rollback optimistic updates if needed
        },
    });

    const update = async (obj: any) => {
        // alert(JSON.stringify(obj));

        const { dropdownName, cascadeType, ddnOptions} = obj;

        let tokens = dropdownName.trim().split(' ');
        let nameString = tokens.map((t: string) => t.toLowerCase()).join('-');

        let uiItem = {
            uiType: 'dropdown',
            name: nameString,
            cascade: cascadeType,
            options: ddnOptions
        }
        let creationResponse = await mutation.mutateAsync(uiItem);
        alert(creationResponse);
    }

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
            // alert(JSON.stringify(data));
            const { uiId, cascade, options } = data;
            let readOnly = false;
            let cascadeOptions = [{ 
                name: capitalizeWords(cascade), value: cascade
            }];
            setDropdown({
                name: capitalizeWords(uiId),
                cascade,
                options,
                cascadeOptions,            
            })
            /* if (data.result && data.result.options) {
              setCascadeOptions([{ name: ' --- please select --- '}, ...data.result.options]);
            } */
          }  
        }
      }, [isPending, error, data]);
    

    return (<div className="flex flex-col border h-max ml-10">
            <div className="border-gray-900/10 w-full min-w-full text-center mt-10">
                <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500">Edit Dropdown</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Only options can be added or removed
                </p>
            </div>
        {isLoading && <>loading....</>}
        {!isLoading && dropdownName && <DropdownResource 
            name={dropdown.name} 
            cascade={dropdown.cascade}
            cascadeOptions={dropdown.cascadeOptions} 
            options={dropdown.options}
            readOnly={false}
            callbackFn={update}
        />}
    </div>);
}

export default EditDropdownPage;