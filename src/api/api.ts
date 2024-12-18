import { ProductAsset, UpdatePackageAsset, ItemAsset, AbstractProductAsset, FilterOpts, Cache } from '@/App.type';
import { replaceHashMarks } from '@/lib/utils';
import axios from 'axios';

const BASE_URL = 'https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com';
const ENV = 'dev';
const UI_API = 'foodie-api';
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

  const type = assetType.toUpperCase();

  let url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;

  if (filter) {
    url = `${url}&filterName=${filter.field}&filterValue=${filter.value}`
  }

  //assetType=ITEM&filterName=PACKET&filterValue=1

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

export const fetchStores = async () => {
  return fetchCachesForType('store-details', 'default')
};

export const fetchItemPacket = async () => {
  return fetchCachesForType('items-packet', 'default')
};


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