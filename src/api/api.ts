import { ProductAsset } from '@/App.type';
import axios from 'axios';

const BASE_URL = 'https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com';
const ENV = 'dev';
// const UI_API = 'foodie-ui';
const ASSET_API = 'foodie-asset';
const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs';

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

export async function fetchAsset(assetType: string, id?: string) {
  if (!id) {
      throw new Error('Asset Id is required');
  }

  const type = assetType.toUpperCase();

  const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}&id=${id}`;
  
  return axios.get(url, HEADERS)
}

export async function createAsset(assetType: string, data: ProductAsset) {
  try {
    const type = assetType.toUpperCase();
    const url = `${BASE_URL}/${ENV}/${ASSET_API}?assetType=${type}`;
    return axios.post(url, data, HEADERS);
  } catch (error) {
     throw new Error('Error during new Asset creation'); // Additional error details from the server
  }
}