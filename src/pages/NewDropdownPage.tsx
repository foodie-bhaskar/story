import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import DropdownResource from '../components/DropdownResource';
import { Option } from '../App.type';


// Define the data shape for your resource
interface UIResource {
    uiType: string,
    name: string,
    cascade: string,
    options: Option[],
    defaultValue?: string
}

async function createUIResource(data: UIResource) {
    // try {
        const { uiType } = data;
        return axios.post(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}`, 
            data,
            {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
                }
            }
        );
    // } catch (error) {
    //     throw new Error('Hello');
    //     // throw new Error(error.response?.data.errorMessage); // Additional error details from the server
    // }
}

const NewDropdownPage = () => {
    // const [dropdown ] = useState<DropdownFormOpts>();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (uiItem: UIResource) => {
            try {
                const response = await createUIResource(uiItem);
                return response.data;
            } catch (err) {
                const error = err as AxiosError;
                throw error;
            }
        },
        onSuccess: (data, variables, context) => {
            console.log(data, variables);
            console.log('context', context)
          // Query Invalidation (Recommended)
          queryClient.invalidateQueries({ queryKey: ['dropdown'] }); // Refetch the 'posts' query
    
          // Or, if you prefer, you can update the cache directly
          // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating post:', error);
          console.log('variables', variables);
            console.log('context', context)
            if (axios.isAxiosError(error)) {
                alert(error.response?.data.errorMessage);
            }
          
          // You can also use `context` to rollback optimistic updates if needed
        },
    });

    const update = async (obj: any) => {
        // alert(JSON.stringify(obj));

        const { dropdownName, cascadeType, ddnOptions, visibility } = obj;

        let tokens = dropdownName.trim().split(' ');
        let nameString = tokens.map((t: string) => t.toLowerCase()).join('-');

        let uiItem = {
            uiType: 'dropdown',
            name: nameString,
            cascade: visibility ? cascadeType: 'global',
            options: ddnOptions
        }
        // alert(JSON.stringify(uiItem));
        // let creationResponse = 
        await mutation.mutateAsync(uiItem);
        // alert(JSON.stringify(creationResponse));
    }

    return (<div className="flex flex-col border h-max ml-10">
    <div className="border-gray-900/10 w-full min-w-full text-center mt-10">
        <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500">New Dropdown</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
            Provide details to create a new dropdown resource either as a part of cascade hierarchy or global
        </p>
    </div>
    
    {/* <div className="flex flex-col mt-10 p-10 md:w-5/6 mx-auto border border-gray-700 bg-gray-500 rounded-sm h-max"> */}
        {mutation.isError && (
            <p>Error: {mutation.error && axios.isAxiosError(mutation.error)? mutation.error.response?.data.errorMessage : 'An error occurred'}</p>
        )}
        {mutation.isPending ? 'Creating...' : <DropdownResource 
            name={''} 
            cascadeOptions={[]} 
            callbackFn={update}
            options={[]}
        />}
    {/* </div> */}
</div>);
}

export default NewDropdownPage;