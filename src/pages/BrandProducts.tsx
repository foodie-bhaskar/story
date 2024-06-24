import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { localDate } from '@/lib/utils';
import { BrandProduct, Option } from '@/App.type';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import Dropdown from '@/core/Dropdown';
import FoodieText from '@/core/FoodieText';

async function fetchAssetsForType(assetType: string, productType: string, productName: string) {  
  if (!assetType) {
    throw new Error('Asset type is required');
  }
  let url = 
  // `https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=BRAND-PRODUCT&productType=non-veg&productName=Chicken Keema`;
  `https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType.toUpperCase()}&productType=${productType}&productName=${productName}`
  return axios.get(url, {
      headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
      }
  });
}

type Mapping = {
  order: OneDArray<ComponentChild>
}




const BrandProducts = () => {
  let assetType = 'brand-product';
  const [productType, setProductType] = useState('veg');
  const [productName, setProductName] = useState('');
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);
  const [enabled, setEnabled] = useState(false);

  const navigate = useNavigate();

  function getMappings(assetType: string): Mapping {
    switch (assetType) {
      case 'brand-product': 
        return { 
          order: [
            { name: 'Name', id: 'productName'},
            { name: 'Brand', id: 'brandName'},
            { name: 'Arrived', id: 'createdAt', data: (row: BrandProduct) => localDate(row.createdAt)},
            { name: 'ID', id: 'brandTypeProductPrefix', data: (row: BrandProduct) => `${row.brandTypeProductPrefix}-${row.variantSequence}` },
            { name: 'Map Items', data: (row: BrandProduct) => _(
              <button 
                className={"py-2 px-4 border rounded-md text-white bg-blue-600"} 
                onClick={() => navigate(`/product/${row.productType}/${row.brandTypeProductPrefix}-${row.variantSequence}/${row.productName}`)}>Map</button>
              )
            }
          ]
        }
  
      default:
        return {
          order: ['']
        }
    }
  }

  function getColumns(assetType: string, fields: string[]) {
    console.log('fields', fields)
    let colsInOrder = getMappings(assetType);
    return colsInOrder;
  }
  

  const PRODUCT_TYPE_OPTIONS = [
    { name: 'Veg', value: 'veg' },
    { name: 'Non Veg', value: 'non-veg' },
    { name: 'Addon', value: 'addon' }
  ]

  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ['asset', assetType, productType, productName],
    queryFn: async () => {
      try {
        const data = await fetchAssetsForType(assetType, productType, productName);
        // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
        // alert(JSON.stringify(rows));
        return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
    }
    },
    staleTime: 60 * 1000,
    enabled: enabled
  });

  useEffect(() => {
    if (assetType) {
    
      if (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data);
          if (error.response && error.response.status == 404) {
          }
        }
      } else if (data && data.length) {
        
        setTableData(data);
        let cols: Mapping = getColumns(assetType, Object.keys(data[0]));
        // alert('col loaded');
        setColumns(cols.order);
      }
    }
  }, [isPending, error, data, assetType]);

  return (<div>
    {assetType && <>
      <h1>{assetType}</h1>
      <div className='flex flex-row px-20 border border-cyan-900 rounded mx-10 items-center gap-4 h-20'>
        <Dropdown 
                options={PRODUCT_TYPE_OPTIONS} selectedValue={productType} 
                selectedCallback={(valObj: Option) => setProductType(valObj.value)} 
                name='Product Type'
              />
        <div className=''>
          <FoodieText fieldName='productName' label='Product Name' action={setProductName} size='w-64'/>
        </div>
        <div className=''>
          {!isFetching
            ? <button 
              type='button' 
              disabled={productName.length < 3}
              onClick={() => setEnabled(true)}
              className={`py-2.5 px-6 text-sm rounded-md uppercase
                ${!(productName.length < 3) 
                  ? 'cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100'
                  : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                font-semibold text-center shadow-xs `}>
                Fetch
            </button>
            : <span className='text-sm italic text-slate-400'>fetching...</span>
          }
        </div>
          
      </div>
      { isPending ? (isFetching ? `Loading ${assetType}s ...`: '')
        : <div className="container mx-auto py-10">
            <h4>{data.length} found</h4>
            { data.length > 0 && <Grid
              data={tableData || []}
              columns={columns}
              search={true}
              pagination={{
                limit: 10,
              }}
              fixedHeader={true}
              style={ { 
                table: { 
                  'white-space': 'nowrap'
                }
              }}
              sort={true}
              resizable={true}
              className={{  
                td: 'min-w-24'
              }}
            />}
        </div>
      }
    </>}
    
  </div>);
}

export default BrandProducts;