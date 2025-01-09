import { AxiosError } from 'axios';
import { fetchAssetsCache, fetchStoreCachesForType, fetchCachesForRangeTS, fetchAssetsForType, fetchCachesForType } from '@/api/api';
import { SummaryCache, ShipmentCache, QueryArg, AssetRow } from '@/App.type';
import { RangeConverter as RC } from '@/lib/utils';
import { QueryFunction, QueryKey } from '@tanstack/react-query';

// ['elastic', 'item-consumption', 'storeId#79', 'isPacket#true', '2024-11-26#2024-12-27']
/* export async function queryElastic(q: QueryArg) {
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
 */
export async function queryStoresCache() {
    try {
      const data = await fetchAssetsCache('store');

      const stores = data.data.result
      return stores;
    } catch (err) {
      const error = err as AxiosError;
      throw error;
    }
}

export async function queryStoreShipments(q: QueryArg) {
    try {
        const [ , group, storeId ] = q.queryKey as string[];

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

export const queryProductionDays: QueryFunction<Cache, QueryKey> = async (q: QueryArg) => {
  try {
    const [, type, rangeStr] = q.queryKey as string[];
    const data = await fetchCachesForRangeTS(type, RC.toRange(rangeStr));
    const rows = data.data.result;
    return rows;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

export const querySummaryRange: QueryFunction<SummaryCache[], QueryKey> = async (q: QueryArg) => {
  try {
    const [, type, rangeStr] = q.queryKey as string[];
    const data = await fetchCachesForRangeTS(type, RC.toRange(rangeStr));
    const rows = data.data.result;
    return rows;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

export const queryAssets: QueryFunction<AssetRow[], QueryKey> = async (q: QueryArg) => {
  try {
    const [, assetType] = q.queryKey as string[];
    const data = await fetchAssetsForType(assetType);
    const rows = data.data.result;
    return rows;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};

export const querySummary: QueryFunction<SummaryCache, QueryKey> = async (q: QueryArg) => {
  try {
    const [, assetType, group] = q.queryKey as string[];
    const data = await fetchCachesForType(assetType, group);
    const rows = data.data.result;
    const summary: SummaryCache = rows[0];
    return summary;
  } catch (err) {
    const error = err as AxiosError;
    throw error;
  }
};
