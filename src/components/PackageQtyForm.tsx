import { FC, useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AssetPackage, FormAction, Package, PackageQtyOtps } from '../App.type';
import Dropdown from "@/core/Dropdown";
import SeqChoice from '@/core/SeqChoice';

async function fetchAssetsForType(assetType: string | undefined) {  
    if (!assetType) {
      throw new Error('Asset type is required');
    }
    return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType.toUpperCase()}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    });
}
  
const PackageQtyForm: FC<FormAction> = ({ action, errorMessage }) => {
    const assetType = 'package';
    let borderOn = false;
    // borderOn = true;

    const [pkg, setPkg] = useState<Package>();
    const [ready, setReady] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);

    const [packages, setPackages] = useState([{ value: '', name: ' --- please select ---'}]);

    const { isPending, error, data } = useQuery({
        queryKey: ['asset', assetType],
        queryFn: async () => {
          try {
            const data = await fetchAssetsForType(assetType);
            const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
            return rows;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
        }
        },
        staleTime: 60 * 1000
    });

    const add = () => {
        if (pkg) {
            const o: PackageQtyOtps = {
                package: pkg,
                qty: quantity
            }
            action(o);
        }
    }

    useEffect(() => {
       if (pkg && quantity) {
        setReady(true);
       } else {
        setReady(false);
       }
        
    }, [quantity, pkg]);

    useEffect(() => {
        if (assetType) {
        
          if (error) {
            if (axios.isAxiosError(error)) {
              alert(error.response?.data);
              if (error.response && error.response.status == 404) {
              }
            }
          } else if (data) {
            setPackages(data.map((pkg: AssetPackage) => ({ packageId: pkg.assetId, name: pkg.name })));
          }
        }
      }, [isPending, error, data, assetType]);

    return (<>
        {errorMessage && <div className='text-red-600 bg-slate-200 rounded ps-10'>
            <p>{errorMessage}</p>
        </div>}
        <fieldset className="border border-gray-500 rounded pl-10 flex flex-row pt-4 pb-8 justify-between mb-10">
            <legend className='uppercase text-gray-500 text-sm rounded font-semibold'>Assign Package & quantity &nbsp;&nbsp;</legend>

            <div className={`${borderOn ? 'border border-red-800': ''} basis-5/6`}> 
                <div className="">
                    {isPending ? 'Loading packages ...': <Dropdown name="Package" options={packages} selectedCallback={setPkg}/>}
                </div>

                <div className={`mt-6 ${borderOn ? 'border border-red-800': ''}`}>
                    <SeqChoice
                        label='Quantity'
                        size={5} 
                        step={1}
                        selectedValue={`${quantity}`}
                        selectedCallback={(c: string) => setQuantity(parseInt(c))} 
                        position="BELOW"
                        allowMore={true}
                    />
                </div>
            </div>

            <div className={`${borderOn ? 'border border-red-800': ''} basis-1/6 pt-7 text-center`}>
                <button type="button" onClick={add} disabled={!ready}
                    className={`${ready 
                        ? 'cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500'
                        : 'cursor-not-allowed bg-slate-100 text-slate-300'
                        } font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center
                    `}>
                    <PlusIcon className='size-6'/>
                </button>                
            </div>
        </fieldset>
        
        </>
    );
}
  
export default PackageQtyForm;
