import { ProductAsset, UpdatePackageAsset, ItemAsset, AbstractProductAsset, FilterOpts, 
  Cache, Range, AssetRow, Asset, Group, ElasticQuery
} from '@/App.type';
import { replaceHashMarks } from '@/lib/utils';
import axios from 'axios';

const BASE_URL = 'https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com';
const ENV = 'dev';
const UI_API = 'foodie-api';
const ELASTIC_API = 'foodie-elastic';
const ASSET_API = 'foodie-asset';
const QUERY_API = 'foodie-search';
// const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ijk3MzgxOTk4MjgiLCJuYW1lIjoiQWF5dXNoIiwidHlwZSI6InN1cGVyIiwidmFsdWUiOiIwMDAwMDAiLCJpYXQiOjE3MjE0NzgwMTh9.AmSFOZHaiV1Ubqpj-05RkmP8WBkmxVQPKIvzS3-q4jk';
const AuthToken = import.meta.env.VITE_AUTH;

const HEADERS = {
  headers: {
    Authorization: `Bearer ${AuthToken}`
  }
}

const ASSET_LSI_MAP: Record<string, string> = {
  'product': 'ITEM-NAME'
}

// foodie-search?consumableType=PACKET&term=storeId&termValue=111&range=2025-01-01&range=2025-01-14&summary=true
export async function fetchConsumables(consumableType: string, termType?: string, termValue?: string, range?: Range, summaryOnly?: boolean) {
  if (!consumableType) {
    throw new Error('Consumable type is required');
  }

  let url = `${BASE_URL}/${ENV}/${QUERY_API}?consumableType=${consumableType}`;

  if (termType && termValue) {
    url = `${url}&term=${termType}&termValue=${termValue}`;
  }

  if (range) {
    url = `${url}&range=${range.start}&range=${range.end}`;
  }
  
  if (summaryOnly) {
    url = `${url}&summary=true`
  }

  return axios.get(url, HEADERS);
}

//summaryType=production-date-batch&range=2024-12-01&range=2025-01-14&summary=true
export async function fetchSummaryRange(summaryType: string, range: Range, summaryOnly?: boolean) {
  if (!summaryType) {
    throw new Error('Summary type is required');
  }

  let url = `${BASE_URL}/${ENV}/${QUERY_API}?summaryType=${summaryType}&range=${range.start}&range=${range.end}`;

  if (summaryOnly) {
    url = `${url}&summary=true`
  }

  return axios.get(url, HEADERS);
}


export async function queryAssetsForValue(assetType: string, value: string, key?: string) {
  if (!key) {

  }

  let lsiSKPrefix = 'ITEM-NAME';

  if (key) {
    lsiSKPrefix = key
  } else if (ASSET_LSI_MAP[assetType]) {
    lsiSKPrefix = ASSET_LSI_MAP[assetType]
  }

  const type = assetType.toUpperCase();
  const url = `${BASE_URL}/${ENV}/${QUERY_API}?assetType=${type}&key=${lsiSKPrefix}&id=${value}`;

  return axios.get(url, HEADERS);
}

export async function fetchAssetsForType(assetType: string | undefined, filter?: FilterOpts) {  
  if (!assetType) {
    throw new Error('Asset type is required');
  }

  if (['store', 'item'].includes(assetType)) {
    return fetchAssetsCache(assetType);
  }

  const type = assetType.toUpperCase();

  let url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;

  if (filter) {
    url = `${url}&filterName=${filter.field}&filterValue=${filter.value}`
  }

  //assetType=ITEM&filterName=PACKET&filterValue=1

  return axios.get(url, HEADERS);
}

export async function fetchFullAssetsForType(assetType: string | undefined, filter?: FilterOpts) {  
  if (!assetType) {
    throw new Error('Asset type is required');
  }

  const type = assetType.toUpperCase();

  let url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;

  if (filter) {
    url = `${url}&filterName=${filter.field}&filterValue=${filter.value}`
  }

  return axios.get(url, HEADERS);
}

export async function fetchCachesForType(cacheType: string, group: string) {  
  if (!cacheType) {
    throw new Error('Cache type is required');
  }

  const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=CACHE&filterName=${cacheType}&filterValue=${group}`;

  // alert(url);

  return axios.get(url, HEADERS);

  //assetType=CACHE&filterName=store-details&filterValue=default' 
}

export async function fetchStoreCachesForType(storeId: string, cacheType: string) {  
  if (!cacheType) {
    throw new Error('Cache type is required');
  }

  const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=CACHE&filterName=${cacheType}&storeId=${storeId}`;

  // alert(url);

  return axios.get(url, HEADERS);

  //assetType=CACHE&filterName=store-details&filterValue=default' 
}

export const fetchAssetsCache = async (type: string) => {
  const cacheTypeMap: {[key: string]: string} = {
    'store': 'store-details',
    'item': 'items-packet'
  }
  const data = await fetchCachesForType(cacheTypeMap[type], 'default');

  const [only] = data.data.result

  const { payload } = only;

  const assetMap: Asset = payload;

  const assets: AssetRow[] = Object.values(assetMap).map((s: Group) => {
    const { store_id, itemId, storeName, ...rest } = s; 
    const asset: AssetRow = {
      assetId: type === 'store' ? store_id: itemId,
      assetType: type,
      createdAt: 1,
      ...(storeName && { name: storeName }),
      ...rest
    };

    return asset;
  });

  return { data: { result: assets } };
};

/* export const fetchAssetCacheMap = async () => {
  const data = await fetchCachesForType('store-details', 'default');

  const storeMap: AssetIdMap = data.data.result[0].payload;
  const stores: StoreDetail[] = Object.values(storeMap);

  const storesAsset: AssetRow[] = stores.map((s: StoreDetail) => {
    const { storeName, store_id, city, state } = s;

    const asset: AssetRow = {
      assetId: store_id,
      assetType: 'store',
      createdAt: 1,
      name: storeName,
      city,
      state
    };

    return asset;
  });

  return { data: { result: storeMap} };
}; */

export const fetchItemPacket = async () => {
  return fetchCachesForType('items-packet', 'default')
};

export async function fetchCachesForRangeTS(cacheType: string, range: Range) { 

  return fetchCachesForRange(cacheType, [range.start, range.end]);
}

export async function fetchCachesForRange(cacheType: string, range: string[]) {  
  if (!cacheType) {
    throw new Error('Cache type is required');
  }
  // alert(range[0]);

  let url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=CACHE&filterName=${cacheType}`;

  url = range.reduce((acc, val) => {

    acc = `${acc}&filterValue=${replaceHashMarks(val)}`
    return acc;
  }, url);

  if (range.length == 1) {
    url = `${url}&fullSort=true`
  }
  
  //assetType=CACHE&filterName=production-date&filterValue=2024-09-03&filterValue=2024-09-05
  // SHP-2024-11-24#13#1
  // alert(url);

  return axios.get(url, HEADERS);
}

export async function fetchAsset(assetType: string, id?: string) {
  if (!id) {
      throw new Error('Asset Id is required');
  }

  const type = assetType.toUpperCase();

  const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}&id=${id}`;
  
  return axios.get(url, HEADERS)
}

export async function fetchUIResource(uiType: string, id: string) {
  const url = `${BASE_URL}/${ENV}/${UI_API}?uiType=${uiType}&id=${id}`;
  return axios.get(url, HEADERS);
}

export async function fetchResourcesForCascade(cascade: string) {
  const url = `${BASE_URL}/${ENV}/${UI_API}?uiType=dropdown&filterName=CASCADE&filterValue=${cascade}`;
  return axios.get(url, HEADERS);
}

export async function createAsset(assetType: string, data: ProductAsset | ItemAsset | Cache, id?: string) {
  try {
    const type = assetType.toUpperCase();
    let url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;
    // foodie-asset?assetType=CACHE&id=production-date_2024-10-08

    if (id) {
      url = `${url}&id=${id}`
    }
    return axios.post(url, data, HEADERS);
  } catch (error) {
     throw new Error('Error during new Asset creation'); // Additional error details from the server
  }
}

export async function updateAsset(assetType: string, assetId: string, data: UpdatePackageAsset | AbstractProductAsset | Cache) {
  try {
    const type = assetType.toUpperCase();
    const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}&id=${assetId}`;
    return axios.put(url, data, HEADERS);
  } catch (error) {
     throw new Error('Error during new Asset updation'); // Additional error details from the server
  }
}

export async function fetchElastic(query: ElasticQuery) {
  const {
    indexCore, term, filter, range, groupBy
  } = query;

 /*  indexCore: coreIndex,
            term: { name: terms[0], value: terms[1] },
            filter: { name: filters[0], value: filters[1] },
            range: range.split('#'); */

  // index=item-consumption&termName=storeId&termValue=79
  // &filterName=isPacket&filterValue=true
  // &rangeStart=2024-11-26&rangeEnd=2024-12-27#13#1
  
  let url = `${BASE_URL}/${ENV}/${ELASTIC_API}`;

  url = `${url}?index=${indexCore}&termName=${term.name}&termValue=${term.value}`;

  if (filter) {
    url = `${url}&filterName=${filter.name}&filterValue=${filter.value}`;
  }

  if (range) {
    url = `${url}&rangeStart=${range.start}&rangeEnd=${range.end}`;
  }

  if (groupBy) {
    url = `${url}&groupBy=${groupBy}`;
  }
  
  return axios.get(url, HEADERS)
}