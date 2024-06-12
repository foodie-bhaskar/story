import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PackageForm from "@/components/PackageForm";

interface PackageAsset {
    assetType: string
}

async function createPackageAsset(data: PackageAsset) {
    try {
        const assetType = 'PACKAGE';
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

const NewPackagingPage = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (assetItem: PackageAsset) => {
          const response = await createPackageAsset(assetItem);
          return response.data;
        },
        onSuccess: (data, variables, context) => {
          // Query Invalidation (Recommended)
          queryClient.invalidateQueries({ queryKey: ['asset','PACKAGE'] }); // Refetch the 'posts' query
    
          // Or, if you prefer, you can update the cache directly
          // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating post:', error);
          alert(JSON.stringify(error));
        //   alert(error.response.data.errorMessage);
          // You can also use `context` to rollback optimistic updates if needed
        },
    });
    const update = async (obj: any) => {
        alert(JSON.stringify(obj));

        /*
        {
            "containerType": "beverage-flask",
            "containerSize": "L",
            "compartments": 1,
            "packagingCost": 20,
            "volume": 300,
            "packagingTypeCombo": [
                {
                    "name": "packaging-type",
                    "value": "beverage"
                },
                {
                    "name": "packaging-sub-type",
                    "value": "Z"
                }
            ]
        }

        */

        const { type, size, compartments, 
            pkgCost, capacity, imgUrl,
            packagingTypeCombo } = obj;

        let assetItem = {
            packagingTypeCombo,
            compartments,
            packagingCost: pkgCost,
            volume: capacity,
            containerType: type,
            containerSize: size
        }

        alert(JSON.stringify(assetItem));
        let creationResponse = await mutation.mutateAsync(assetItem);
        alert(JSON.stringify(creationResponse));
    }

    return (<div className="ml-20">
        <div className="border-gray-900/10 w-full min-w-full text-center mt-10">
            <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500">New Packaging</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details to create a new packaging
            </p>
        </div>

        {mutation.isError && (
            <p>Error: {mutation.error instanceof Error ? mutation.error.response.data.errorMessage : 'An error occurred'}</p>
        )}
        {mutation.isPending ? 'Creating...' :
             <PackageForm callbackFn={update}/>
        }
       
    </div>)

}

export default NewPackagingPage;