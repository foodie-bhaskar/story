import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import PackageForm from "@/components/PackageForm";
import { PackageAsset, FormType } from '@/App.type';

async function createPackageAsset(data: PackageAsset) {
    const assetType = 'PACKAGE';
    
    return axios.post(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType}`, 
        data,
        {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
            }
        }
    );
}

const NewPackagingPage = () => {
    const queryClient = useQueryClient();
    const navigate =  useNavigate();

    const mutation = useMutation({
        mutationFn: async (assetItem: PackageAsset) => {
            try {
                const response = await createPackageAsset(assetItem);
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
          queryClient.invalidateQueries({ queryKey: ['asset','package'] }); // Refetch the 'posts' query
    
          // Or, if you prefer, you can update the cache directly
          // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        },
        onError: (error, variables, context) => {
            console.log('variables', variables);
            console.log('context', context)
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating post:', error);
          alert(JSON.stringify(error));
        //   alert(error.response.data.errorMessage);
          // You can also use `context` to rollback optimistic updates if needed
        },
    });
    const update = async (obj: any) => {
        // alert(JSON.stringify(obj));

        const { type, size, compartments, 
            pkgCost, capacity, imgUrl,
            packagingTypeCombo } = obj;

        let assetItem = {
            packagingTypeCombo,
            compartments,
            packagingCost: pkgCost,
            volume: capacity,
            containerType: type,
            containerSize: size,
            imageUrl: imgUrl
        }

        // alert(JSON.stringify(assetItem));
        let creationResponse = await mutation.mutateAsync(assetItem);
        // alert(JSON.stringify(creationResponse));
        navigate('/list-assets/package')
    }

    return (<div className="ml-20">
        <div className="border-gray-900/10 w-full min-w-full text-center mt-10">
            <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500">New Packaging</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details to create a new packaging
            </p>
        </div>

        {mutation.isError && (
            <p>Error: {mutation.error && axios.isAxiosError(mutation.error)? mutation.error.response?.data.errorMessage : 'An error occurred'}</p>
        )}
        {mutation.isPending ? 'Creating...' :
             <PackageForm callbackFn={update} formType={FormType.CREATE} />
        }
       
    </div>)

}

export default NewPackagingPage;