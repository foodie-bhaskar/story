import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryStoresCache, queryStoreShipments } from '@/queries/query';
import { StoreDetail, ShipmentCache, Shipment, ConsumableQueryResult, ElasticQueryResult, SummaryQueryResult, SummaryRow } from '@/App.type';
import { Range, SummaryCache, AssetRow, ConsumableRow } from "@/App.type";
import { queryAssets, querySummary, querySummaryRange, queryElastic, queryAssetsCache, queryConsumables, querySummaries } from '@/queries/query';
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
    propName: 'storeId'
  }

  const queries: QueryCfg[] = [
    {
      queryKey: ['cache', 'shipment', RC.toString(range)],
      queryFn: querySummaryRange
    },
    {
      queryKey: ['cache', 'item'],
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

interface QueryConsumableCfg {
  queryKey: string[],
  queryFn: QueryFunction<ConsumableQueryResult | ElasticQueryResult | AssetRow[] | SummaryQueryResult, QueryKey>
  mergeCfg?: MergeCfg
}


interface ConsumerRowMap {
  [key: string]: ConsumableRow | SummaryRow
}

function processElastic(baseMap: ConsumerRowMap, elasticResult: ElasticQueryResult): ConsumerRowMap {
  for (let elasticEntry of Object.entries(elasticResult.summary)) {
    const [ id, qty ] = elasticEntry;

    if (!baseMap[id]) {
      let row: ConsumableRow = {
        id,
        outflow: qty,
        name: '',
        inflow: 0
      };

      baseMap[id] = row;
    } else {
      baseMap[id].outflow = qty
    }
  } 
  return baseMap;
}

function processConsumable(baseMap: ConsumerRowMap, consumableResult: ConsumableQueryResult): ConsumerRowMap {
  for (let consumable of Object.entries(consumableResult.summary)) {
    const [ id, nameQty ] = consumable;

    if (!baseMap[id]) {
      let row: ConsumableRow = {
        id,
        inflow: nameQty.qty,
        name: nameQty.name,
        outflow: 0
      }
      baseMap[id] = row;
    } else {
      baseMap[id].inflow = nameQty.qty;
      baseMap[id].name = nameQty.name;
    }

  } 
  return baseMap;
}

function processAssets(baseMap: ConsumerRowMap, assets: AssetRow[]): ConsumerRowMap {
  for (let asset of assets) {
    const { assetId, name } = asset;

    if (!baseMap[assetId]) {
      let row: ConsumableRow = {
        id: assetId,
        inflow: 0,
        name: name || '',
        outflow: 0
      }
      baseMap[assetId] = row;
    } else {
      baseMap[assetId].name = name || '';
    }

  } 
  return baseMap;
}

function processSummary(baseMap: ConsumerRowMap, consumableResult: SummaryQueryResult): ConsumerRowMap {
  const { map } = consumableResult;
  for (let entry of Object.entries(map)) {
    const [ id, summary ] = entry;
    const { name, qty } = summary;
    if (!baseMap[id]) {
      
      let row: ConsumableRow = {
        id,
        name,
        inflow: qty,
        outflow: 0
      }
      baseMap[id] = row;
    } else {
      baseMap[id].inflow = qty;
    }

  } 
  return baseMap;
}

function multiMerge(baseMap: ConsumerRowMap, data: ElasticQueryResult | ConsumableQueryResult | AssetRow[] | SummaryQueryResult): ConsumerRowMap {
  if (Object.keys(data).includes('summation')) {
    const summaryResult = data as SummaryQueryResult;
    
    return processSummary(baseMap, summaryResult);

  } else if (Object.keys(data).includes('total')) {
    let elasticResult = data as ElasticQueryResult;
    // alert(`Processing merging elastic : ${elasticResult.total}`);
    return processElastic(baseMap, elasticResult);
  
  } else if (Object.keys(data).includes('count')) {
    const consumableResult = data as ConsumableQueryResult;
    // alert(`Processing merging consumables : ${consumableResult.count}`);
    return processConsumable(baseMap, consumableResult);

  } else {
    const assets = data as AssetRow[];
    return processAssets(baseMap, assets);
  }
}

export const useConsumableQueries = (queries: QueryConsumableCfg[], merge = true) => {
  // const [primary, secondary, tertiary] = queries;

  const [primaryQuery, secondaryQuery, tertiaryQuery] = useQueries({
    queries: queries.map(q => ({
      queryKey: q.queryKey,
      queryFn: q.queryFn,
      staleTime: Infinity,
      enabled: true
    }))
  });

  const dependencyArray = [primaryQuery.isSuccess, primaryQuery.data];

  if (secondaryQuery) {
    dependencyArray.push( secondaryQuery.isSuccess, secondaryQuery.data)
  }

  if (tertiaryQuery) {
    dependencyArray.push( tertiaryQuery.isSuccess, tertiaryQuery.data)
  }

  // Ensure both queries are complete before merging
  const mergedData: ConsumableRow[] = merge ? useMemo(() => {
    let mergeMap: ConsumerRowMap = {};
    if (
      (primaryQuery.isSuccess && primaryQuery.data)
      && ((!!secondaryQuery && secondaryQuery.isSuccess && secondaryQuery.data) || !secondaryQuery)
      && ((!!tertiaryQuery && tertiaryQuery.isSuccess && tertiaryQuery.data) || !tertiaryQuery)
    ) {
      const primary = primaryQuery.data;

      mergeMap = multiMerge(mergeMap, primary);

      if (!!secondaryQuery) {
        // alert('secondaryQuery');
        const secondary = secondaryQuery.data;
        mergeMap = multiMerge(mergeMap, secondary);
      }
      
      if (!!tertiaryQuery) {
        const tertiary = tertiaryQuery.data;
        mergeMap = multiMerge(mergeMap, tertiary);
      }

      return Object.values(mergeMap);
    }
      
    return []
  }, dependencyArray): [];
  
  return {
    primary: {
      data: primaryQuery.data,
      isPending: primaryQuery.isPending,
      isFetching: primaryQuery.isFetching,
      error: primaryQuery.error
    },
    ...(secondaryQuery && { 
      secondary: {
        data: secondaryQuery.data,
        isPending: secondaryQuery.isPending,
        isFetching: secondaryQuery.isFetching,
        error: secondaryQuery.error
      }
    }),
    ...(tertiaryQuery && { 
      tertiary: {
        data: tertiaryQuery.data,
        isPending: tertiaryQuery.isPending,
        isFetching: tertiaryQuery.isFetching,
        error: tertiaryQuery.error
      }
    }),
    ...(merge &&  { mergedData }),
    isAllQueriesComplete: primaryQuery.isSuccess 
      && ((!!secondaryQuery && secondaryQuery.isSuccess) || !secondaryQuery) 
      && ((!!tertiaryQuery && tertiaryQuery.isSuccess) || !tertiaryQuery)
  };
}

export const useStorePacketFlowQueries = (storeId: string, range: Range) => {

  const queries: QueryConsumableCfg[] = [
    {
      queryKey: ['elastic', 'item-consumption', `storeId#${storeId}`, 'isPacket#true', RC.toString(range), 'itemId'],
      queryFn: queryElastic
    },
    {
      queryKey: ['consumable', 'PACKET', `storeId#${storeId}`, RC.toString(range), 'true'],
      queryFn: queryConsumables,
    },
    {
      queryKey: ['cache', 'item'],
      queryFn: queryAssetsCache
    }
  ];

  return useConsumableQueries(queries);
}

export const useOverallFlowQueries = (range: Range) => {

  // ['summary', 'production-date-batch', '2025-01-01#2025-01-14', 'true']
  // ['elastic', 'item-consumption', '', 'isPacket#true', '2024-11-26#2024-12-27', 'itemId']
  const queries: QueryConsumableCfg[] = [
    {
      queryKey: ['summary', 'production-date-batch', RC.toString(range), 'true'],
      queryFn: querySummaries
    },
    {
      queryKey: ['elastic', 'item-consumption', '', 'isPacket#true', RC.toString(range), 'itemId'],
      queryFn: queryElastic
    },
    {
      queryKey: ['cache', 'item'],
      queryFn: queryAssetsCache
    }
  ];

  return useConsumableQueries(queries);
}
