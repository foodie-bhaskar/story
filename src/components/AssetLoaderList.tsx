import { AssetItem, FilterOpts } from "@/App.type";
import { fetchAssetsForType } from "@/api/api";
import { includesInObject } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FC, useState, useEffect } from "react";
import AssetList from "./AssetList";
import Loader from "@/core/Loader";

interface AssetLoaderOpts {
    type: string,
    update?: Function,
    localFilter?: FilterOpts,
    assetFilter?: FilterOpts,
    classPart?: string
}

const AssetLoaderList: FC<AssetLoaderOpts> = ({ type, update, localFilter, assetFilter, classPart = '' }) => {

    const [items, setItems] = useState<AssetItem []>([]);

    const { isPending, error, data } = useQuery({
        queryKey: ['asset', type],
        queryFn: async () => {
          try {
            const data = await fetchAssetsForType(type, assetFilter);
            let rows = data.data.result;
            return rows;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
        }
        },
        staleTime: 10 * 60 * 1000,
        enabled: true
    });

    useEffect(() => {
        if (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data);
                if (error.response && error.response.status == 404) {
                }
            }   
        } else if (data) {
            setItems(data);
        }
    }, [isPending, error, data]);

    useEffect(() => {
        if (localFilter && data && data.length) {
            const { field, value } = localFilter;
            setItems(data.filter((o: AssetItem ) => includesInObject(o, value, field)));
        } else {
            setItems(data);
        }
       
      }, [localFilter, data]);

    return <div className={`rounded sm:mx-auto max-w-lg overflow-y-hidden h-screen border-2 border-gray-300 px-2 ${classPart}`}>
        <div className="text-center">{
            isPending 
                ? <Loader />
                : <span className="text-lg text-gray-400 font-light italic">{`${data.length} ${type}s`.toUpperCase()}</span>
        }</div>
        {!isPending && data && <AssetList data={items} update={update} />}
    </div>
}

export default AssetLoaderList;