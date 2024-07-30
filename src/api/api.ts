import { ProductAsset, UpdatePackageAsset, ItemAsset } from '@/App.type';
import axios from 'axios';

const BASE_URL = 'https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com';
const ENV = 'dev';
const UI_API = 'foodie-api';
const ASSET_API = 'foodie-asset';
const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ijk3MzgxOTk4MjgiLCJuYW1lIjoiQWF5dXNoIiwidHlwZSI6InN1cGVyIiwidmFsdWUiOiIwMDAwMDAiLCJpYXQiOjE3MjE0NzgwMTh9.AmSFOZHaiV1Ubqpj-05RkmP8WBkmxVQPKIvzS3-q4jk';

const HEADERS = {
  headers: {
    Authorization: `Bearer ${AuthToken}`
  }
}

export async function fetchAssetsForType(assetType: string | undefined) {  
  if (!assetType) {
    throw new Error('Asset type is required');
  }

  const type = assetType.toUpperCase();

  const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;

  return axios.get(url, HEADERS);
}

//https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset
// ?assetType=CACHE&filterName=product-names&filterValue=count
export async function fetchCachesForType(cacheType: string, group: string) {  
  if (!cacheType) {
    throw new Error('Cache type is required');
  }

  const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=CACHE&filterName=${cacheType}&filterValue=${group}`;

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

export async function createAsset(assetType: string, data: ProductAsset | ItemAsset) {
  try {
    const type = assetType.toUpperCase();
    const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;
    return axios.post(url, data, HEADERS);
  } catch (error) {
     throw new Error('Error during new Asset creation'); // Additional error details from the server
  }
}

export async function updateAsset(assetType: string, assetId: string, data: UpdatePackageAsset | ProductAsset) {

  try {
    const type = assetType.toUpperCase();
    const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}&id=${assetId}`;


    return axios.put(url, data, HEADERS);
  } catch (error) {
     throw new Error('Error during new Asset updation'); // Additional error details from the server
  }
}