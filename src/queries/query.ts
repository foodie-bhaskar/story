import { AxiosError } from 'axios';
import { fetchStores, fetchStoreCachesForType, fetchElastic, fetchCachesForRangeTS } from '@/api/api';
import { StoreCache, ShipmentCache, ElasticQuery, QueryArg } from '@/App.type';
import { RangeConverter as RC } from '@/lib/utils';

// ['elastic', 'item-consumption', 'storeId#79', 'isPacket#true', '2024-11-26#2024-12-27']
export async function queryElastic(q: QueryArg) {
    try {
        const [ , coreIndex, coreTermNameValue, filterTermNameValue, range ] = q.queryKey;

        const terms = coreTermNameValue.split('#');
        const filters = filterTermNameValue.split('#');

        if (range) {

            const queryParams: ElasticQuery = {
                indexCore: coreIndex,
                term: { name: terms[0], value: terms[1] },
                filter: { name: filters[0], value: filters[1] },
                range: RC.toRange(range)
            }
            const data = await fetchElastic(queryParams);
            return data.data;
        } else {
            alert('range is missing');
        }
    } catch (err) {
      const error = err as AxiosError;
      throw error;
    }
}

export async function queryStoresCache() {
    try {
      const data = await fetchStores();

      const storeMap: StoreCache = data.data.result[0].payload;
      return storeMap;
    } catch (err) {
      const error = err as AxiosError;
      throw error;
    }
}

export async function queryStoreShipments(q: QueryArg) {
    try {
        const [ , group, storeId ] = q.queryKey;

        if (storeId && group) {
            const data = await fetchStoreCachesForType(storeId, 'shipment');
            const shipments: ShipmentCache[] = data.data.result;
            
            return shipments;
        } else {
            return null;
        }
                
        } catch (err) {
            const error = err as AxiosError;
            throw error;
        }
}

export async function queryProductionDays(q: QueryArg) {
    try {
        const [ , type, rangeStr ] = q.queryKey;
        const data = await fetchCachesForRangeTS(type, RC.toRange(rangeStr));
        const rows = data.data.result;
        return rows;                
    } catch (err) {
        const error = err as AxiosError;
        throw error;
    }
}
