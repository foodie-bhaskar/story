import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import ItemForm from '../components/ItemForm';
import { FormType, ItemAsset } from '@/App.type';
import { createAsset } from '../api/api';

const assetType = 'item';

const NewItemPage = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (assetItem: ItemAsset) => {
            try {
                const response = await createAsset(assetType, assetItem);
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
            id,
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
            {mutation.isPending ? 'Creating...' : <ItemForm callbackFn={update} formType={FormType.CREATE} />
            }
        {/* </div> */}
    </div>)
}

export default NewItemPage;