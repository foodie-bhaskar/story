import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryStoresCache, queryStoreShipments } from '@/queries/query';
import { StoreDetail, ShipmentCache, Shipment, IDValueMap } from '@/App.type';
import { Range, SummaryCache, AssetRow } from "@/App.type";
import { AxiosError } from 'axios';
import { fetchItemPacket } from '@/api/api';
import { queryAssets, querySummary, querySummaryRange } from '@/queries/query';
import { genAssetIdMap, extractStoreDetails, mergeSummation, reduceToIDValue } from '@/lib/helper';
import { QueryFunction, QueryKey } from '@tanstack/react-query';
import { RangeConverter as RC } from '@/lib/utils';

interface QueryArg {
    queryKey: string []
}

interface QueryConfig {
    queryKey: string[];
    queryFn: (q: QueryArg) => Promise<any>;
    staleTime?: number;
    enabled?: boolean;
}

interface QueryConfigGeneric {
  queryKey: string[];
  queryFn: QueryFunction<SummaryCache | AssetRow[], QueryKey>
  staleTime?: number;
  enabled?: boolean;
}

interface QueryResult {
    data: any;
    isPending: boolean;
    isFetching: boolean;
    error: Error | null;
}

/* interface StoreShipments {
    shipDates: string[],
    storeDetail: StoreDetail,
    shipments: Shipment
} */

/* type ShipmentRow = {
  shipmentId: string;
  shippedDate: string,
  storeId: string;
  packetCount: number,
  itemCount: number
  scannedTime: string,
  payload: ItemNameQtyMap
}

type StoreCache = {
  [key: string]: StoreDetail;
} */

type ItemPacketDetail = {
  itemId: string,
  name: string,
  weight: number
}

type ItemsCache = {
  [key: string]: ItemPacketDetail;
}

export const useDynamicQueries = (configs: QueryConfig[] | QueryConfigGeneric[]) => {
    const queries = useQueries({
      queries: configs.map(config => ({
        ...config,
        staleTime: config.staleTime ?? Infinity,
        enabled: config.enabled ?? true
      }))
    });
  
    const isAllQueriesComplete = useMemo(() => 
      queries.every(query => query.isSuccess), 
      [queries]
    );
  
    const results = useMemo(() => 
      queries.reduce((acc, query, index) => ({
        ...acc,
        [configs[index].queryKey[1]]: {
          data: query.data,
          isPending: query.isPending,
          isFetching: query.isFetching,
          error: query.error
        }
      }), {} as Record<string, QueryResult>),
      [queries, configs]
    );
  
    return {
      queries: results,
      isAllQueriesComplete
    };
};

export const useStoreQueries = (storeId?: string) => {
  const queryConfigs: QueryConfig[] = [
    {
        queryKey: ['cache', 'allStores'],
        queryFn: queryStoresCache,
        staleTime: Infinity,
        enabled: !!storeId
    },
    {
        queryKey: ['cache', 'shipments', storeId || ''],
        queryFn: queryStoreShipments,
        staleTime: Infinity,
        enabled: !!storeId
    }
  ];
  
  const { queries, isAllQueriesComplete } = useDynamicQueries(queryConfigs);
  
  // Merge Store Details and Store Shipments
  const mergedData = useMemo(() => {
    if (!isAllQueriesComplete || !storeId) return [];

    const { allStores, shipments } = queries;

    const storeDetail: StoreDetail = allStores.data[storeId];

    const storeShipments: Shipment[] = shipments.data.map((shp: ShipmentCache) => {
      const { data, distinctItems, group } = shp;
      const shippedDate = group.split('#')[0].substring(4);

      const shpmt: Shipment = {
        packets: data,
        items: distinctItems || 0,
        shippedDate,
        shipmentId: group
      }

      return shpmt;
    });

    const shipDates = storeShipments.map(s => s.shippedDate).sort();

    return {
        shipments: storeShipments,
        shipDates,
        storeDetail
    };

  }, [queries, isAllQueriesComplete]);
  
    return {
      ...queries,
      mergedData,
      isAllQueriesComplete
    };
};

export const useShipmentSummaryQueries = (shipmentId: string) => {
  const [ , storeId, ] = shipmentId.split('#')
  const queryConfigs: QueryConfigGeneric[] = [
    {
      queryKey: ['cache', 'shipment', shipmentId],
      queryFn: querySummary,
      staleTime: Infinity,
      enabled: !!storeId
    },
    {
      queryKey: ['asset', 'store'],
      queryFn: queryAssets,
      staleTime: Infinity,
      enabled: true
    }
  ];

  const { queries, isAllQueriesComplete } = useDynamicQueries(queryConfigs);

  const mergedData = useMemo(() => {
    if (!isAllQueriesComplete) return [];

    // const { shipment, store } = queries;

    // const source = store.data;
    // const sourceMap = genAssetIdMap(source);

    // const shipmentObj: SummaryCache = shipment.data;
    // const { storeId } = shipmentObj;

    /* const storeDetail: StoreDetail = allStores.data[storeId];

    const storeShipments: Shipment[] = shipments.data.map((shp: ShipmentCache) => {
      const { data, distinctItems, group } = shp;
      const shippedDate = group.split('#')[0].substring(4);

      const shpmt: Shipment = {
        packets: data,
        items: distinctItems || 0,
        shippedDate,
        shipmentId: group
      }

      return shpmt;
    }); */

    // const shipDates = storeShipments.map(s => s.shippedDate).sort();

    return {
        // shipments: storeShipments,
        // shipDates,
        // storeDetail
    };

  }, [queries, isAllQueriesComplete]);
  
    return {
      ...queries,
      mergedData,
      isAllQueriesComplete
    };
}

export const useShipmentQueries = (range: Range) => {
  const [shipmentQuery, storeDetailsQuery, itemPacketQuery] = useQueries({
    queries: [
      {
        queryKey: ['cache', 'shipment', RC.toString(range)],
        queryFn: querySummaryRange,
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: ['asset', 'store'],
        queryFn: queryAssets,
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: ['cache', 'items-packet'],
        queryFn: async () => {
          try {
            const data = await fetchItemPacket();
  
            const itemMap: ItemsCache = data.data.result[0].payload;
            return itemMap;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
      }
    ]
  });

  // Ensure both queries are complete before merging
  const mergedData: SummaryCache[] = useMemo(() => {
    // Check if both queries are successful and have data
    if (
      shipmentQuery.isSuccess && 
      storeDetailsQuery.isSuccess && 
      itemPacketQuery.isSuccess && 

      shipmentQuery.data && 
      itemPacketQuery.data && 
      storeDetailsQuery.data
    ) {

      const primary = shipmentQuery.data;
      const source = storeDetailsQuery.data;
      const sourceMap = genAssetIdMap(source);
      

      return primary.map((shipment) => {

        const { payload, storeId } = shipment as SummaryCache;

        const storeDetails = shipment.storeId ? extractStoreDetails(storeId, sourceMap): {};

        const propName = 'weight';
        const sourceMap2: IDValueMap = reduceToIDValue(itemPacketQuery.data, propName);

        const weightInGms = mergeSummation(sourceMap2, payload as IDValueMap);
        
        return {
          ...shipment,
          ...storeDetails,
          weightInGms
        }
      });
    }

    return [];
  }, [
    shipmentQuery.isSuccess, 
    storeDetailsQuery.isSuccess, 
    itemPacketQuery.isSuccess, 
    shipmentQuery.data, 
    storeDetailsQuery.data,
    itemPacketQuery.data
  ]);

  return {
    shipment: {
      data: shipmentQuery.data,
      isPending: shipmentQuery.isPending,
      isFetching: shipmentQuery.isFetching,
      error: shipmentQuery.error
    },
    storeDetails: {
      data: storeDetailsQuery.data,
      isPending: storeDetailsQuery.isPending,
      isFetching: storeDetailsQuery.isFetching,
      error: storeDetailsQuery.error
    },
    itemPackets: {
      data: itemPacketQuery.data,
      isPending: itemPacketQuery.isPending,
      isFetching: itemPacketQuery.isFetching,
      error: itemPacketQuery.error
    },
    mergedData,
    isAllQueriesComplete: shipmentQuery.isSuccess && storeDetailsQuery.isSuccess && itemPacketQuery.isSuccess
  };
};