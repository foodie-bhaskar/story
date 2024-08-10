import { FilterOpts, AssetProduct } from "@/App.type";
import { queryAssetsForValue } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FC, useState, useEffect } from "react";
import AssetList from "./AssetList";
import Loader from "@/core/Loader";

interface QueryLoaderOpts {
    update?: Function,
    apiFilter: FilterOpts
}

interface QueryFilter {
    assetType: string,
    filterValue: string
}

const QueryLoaderList: FC<QueryLoaderOpts> = ({ apiFilter, update }) => {

    const [filter, setFilter] = useState<QueryFilter>();

    // const [selectedItem, setSelectedItem] = useState<string>('118');
    const [items, setItems] = useState<AssetProduct []>([]);

    const { isPending, error, data } = useQuery({
        queryKey: [filter?.assetType, filter?.filterValue],
        queryFn: async () => {
          try {
            if (filter) {
                const data = await queryAssetsForValue(filter.assetType, filter.filterValue);
                const rows = data.data.assets;
                return rows;
            } else {
                return []
            }
          } catch (err) {
            const error = err as AxiosError;
            throw error;
        }
        },
        staleTime: 10 * 60 * 1000,
        enabled: !!filter
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
        if (apiFilter && apiFilter.field && apiFilter.value) {
            setFilter({
                assetType: apiFilter.field,
                filterValue: apiFilter.value
            })
        }
    }, [apiFilter]);


    return <div className="rounded sm:mx-auto max-w-lg overflow-y-hidden h-screen border-2 border-gray-300 p-4">
        <div className="text-center">{
            !filter 
                ? <span>Please select an Item</span>
                : ( isPending 
                    ? <Loader />
                    : <span className="text-lg text-gray-400 font-light italic">{`${data.length} ${filter.assetType}s`.toUpperCase()}</span>
                )
        }</div>
        {!isPending && data && <AssetList data={items} update={update} />}
    </div>
}

export default QueryLoaderList;