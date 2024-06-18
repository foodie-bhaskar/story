import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import ItemForm from '../components/ItemForm';

interface ItemAsset {
    itemId: string,
    name: string,
    vendor: string
}

async function createItemAsset(data: ItemAsset) {
    try {
        const assetType = 'ITEM';
        // const { assetType } = data;
        return axios.post(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType}`, 
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

const NewItemPage = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (assetItem: ItemAsset) => {
            try {
                const response = await createItemAsset(assetItem);
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
          queryClient.invalidateQueries({ queryKey: ['asset','ITEM'] }); // Refetch the 'posts' query
    
          // Or, if you prefer, you can update the cache directly
          // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
            console.log('variables', variables);
            console.log('context', context)
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating post:', error);
        //   alert(error.response.data.errorMessage);
          // You can also use `context` to rollback optimistic updates if needed
        },
    });

    const update = async (obj: any) => {
        // alert(JSON.stringify(obj));

        const { id, name, vendor, weight, cost, typeCombo, cuisineCombo, isPacket, consumptionCount, isVeg } = obj;
        let assetItem = {
            itemId: id,
            name,
            vendor,
            weight,
            costBuildup: cost,
            typeCombo,
            cuisineCombo,
            isPacket,
            consumptionCount,
            isVeg
        }
        // alert(JSON.stringify(assetItem));
        await mutation.mutateAsync(assetItem);
        // alert(JSON.stringify(creationResponse));
    }

    return (<div className="flex flex-col border h-max ml-10">
        <div className="border-gray-900/10 w-full min-w-full text-center mt-10">
            <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500">New Item</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details to create a new item
            </p>
        </div>
        
        {/* <div className="flex flex-col mt-10 p-10 md:w-5/6 mx-auto border border-gray-700 bg-gray-500 rounded-sm h-max"> */}
            {mutation.isError && (
                <p>Error: {mutation.error instanceof AxiosError && mutation.error ? mutation.error.response?.data.errorMessage : 'An error occurred'}</p>
            )}
            {mutation.isPending ? 'Creating...' : <ItemForm readOnly={false} callbackFn={update} />
            }
        {/* </div> */}
    </div>)
}

export default NewItemPage;