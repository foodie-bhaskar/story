import { FC, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

async function createUIResource(data: UIResource) {
    try {
        const { uiType } = data;
        return axios.post(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}`, 
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

const ShowcaseDropdownForm = () => {
    const [dropdown, setDropdown ] = useState(BASE_DROPDOWN);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (uiItem: UIResource) => {
          const response = await createUIResource(uiItem);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
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
        let nameString = tokens.map(t => t.toLowerCase()).join('-');

        let uiItem = {
            uiType: 'dropdown',
            name: nameString,
            cascade: cascadeType,
            options: ddnOptions
        }
        let creationResponse = await mutation.mutateAsync(uiItem);
        alert(creationResponse);
    }

    return (<div className="flex flex-col mt-10 p-10 md:w-5/6 mx-auto border border-gray-700 bg-gray-500 rounded-sm h-max">
        {mutation.isError && (
            <p>Error: {mutation.error instanceof Error ? mutation.error.response.data.errorMessage : 'An error occurred'}</p>
        )}
        {mutation.isPending ? 'Creating...' : 
            <DropdownResource 
            name={dropdown.name} 
            cascadeOptions={dropdown.cascadeOptions} 
            callbackFn={update}
            options={dropdown.options}
        />}
    </div>);
}

export default ShowcaseDropdownForm;