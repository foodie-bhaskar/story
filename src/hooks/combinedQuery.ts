import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryStoresCache, queryStoreShipments } from '@/queries/query';
import { StoreDetail, ShipmentCache, Shipment } from '@/App.type';
import { Range, SummaryCache, AssetRow } from "@/App.type";
// import { AxiosError } from 'axios';
// import { fetchItemPacket } from '@/api/api';
import { queryAssets, querySummary, querySummaryRange } from '@/queries/query';
// import { genAssetIdMap, extractAssetDetails, mergeSummation, reduceToIDValue, mergeExtract, merge } from '@/lib/helper';
import { mergeSummation, mergeExtract, merge } from '@/lib/helper';
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

/* type ItemPacketDetail = {
  itemId: string,
  name: string,
  weight: number
} */

/* type ItemsCache = {
  [key: string]: ItemPacketDetail;
}
 */
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

interface MergeCfg {
  fn: Function,
  propName: string
}

interface QueryCfg {
  queryKey: string[],
  queryFn: QueryFunction<SummaryCache[] | AssetRow[], QueryKey>
  mergeCfg?: MergeCfg
}

export const useShipmentQueries = (range: Range) => {

  const secondaryCfg: MergeCfg = {
    fn: mergeSummation,
    propName: 'weight'
  }

  const tertiaryCfg: MergeCfg = {
    fn: mergeExtract,
    propName: 'weight'
  }

  const queries: QueryCfg[] = [
    {
      queryKey: ['cache', 'shipment', RC.toString(range)],
      queryFn: querySummaryRange
    },
    {
      queryKey: ['asset', 'item'],
      queryFn: queryAssets,
      mergeCfg: secondaryCfg
    },
    {
      queryKey: ['asset', 'store'],
      queryFn: queryAssets,
      mergeCfg: tertiaryCfg
    }
  ];

  return usePageQueries(queries);
}

export const usePageQueries = (queries: QueryCfg[]) => {
  const [primary, secondary, tertiary] = queries;

  const [primaryQuery, secondaryQuery, tertiaryQuery] = useQueries({
    queries: [
      {
        queryKey: primary.queryKey,
        queryFn: primary.queryFn,
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: secondary.queryKey,
        queryFn: secondary.queryFn,
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: tertiary.queryKey,
        queryFn: tertiary.queryFn,
        staleTime: Infinity,
        enabled: true
      },
      
    ]
  });

  // Ensure both queries are complete before merging
  const mergedData: SummaryCache[] = useMemo(() => {
    // Check if both queries are successful and have data
    if (primaryQuery.isSuccess && secondaryQuery.isSuccess
      && ((!!tertiaryQuery && tertiaryQuery.isSuccess) || !tertiaryQuery) 
      && primaryQuery.data && secondaryQuery.data
      && ((!!tertiaryQuery && tertiaryQuery.data) || !tertiaryQuery) 
    ) {

      const primary = primaryQuery.data;
      return primary.map((main) => {

        const { payload, storeId } = main as SummaryCache;

        let mergeSecondary, mergeTertiary;

        if (secondary.mergeCfg && tertiaryQuery && tertiaryQuery.data) {
          const secondarySource = secondaryQuery.data as AssetRow[];
          mergeSecondary = merge(secondary.mergeCfg, payload, secondarySource, storeId);
        }
        
        if (tertiary.mergeCfg && tertiaryQuery && tertiaryQuery.data) {
          const tertiarySource = tertiaryQuery.data as AssetRow[];
          mergeTertiary = merge(tertiary.mergeCfg, payload, tertiarySource, storeId);
        }
        
        return {
          ...main,
          ...(mergeSecondary && { ...mergeSecondary }),
          ...(mergeTertiary && { ...mergeTertiary })
        }
      });
    }

    return [];
  }, [
    primaryQuery.isSuccess, 
    secondaryQuery.isSuccess, 
    tertiaryQuery.isSuccess, 
    primaryQuery.data, 
    secondaryQuery.data,
    tertiaryQuery.data
  ]);

  return {
    primary: {
      data: primaryQuery.data,
      isPending: primaryQuery.isPending,
      isFetching: primaryQuery.isFetching,
      error: primaryQuery.error
    },
    secondary: {
      data: secondaryQuery.data,
      isPending: secondaryQuery.isPending,
      isFetching: secondaryQuery.isFetching,
      error: secondaryQuery.error
    },
    tertiary: {
      data: tertiaryQuery.data,
      isPending: tertiaryQuery.isPending,
      isFetching: tertiaryQuery.isFetching,
      error: tertiaryQuery.error
    },
    mergedData,
    isAllQueriesComplete: primaryQuery.isSuccess && secondaryQuery.isSuccess && tertiaryQuery.isSuccess
  };
};