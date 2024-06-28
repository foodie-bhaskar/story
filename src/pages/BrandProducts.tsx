import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { localDate } from '@/lib/utils';
import { BrandProduct, ProductAsset } from '@/App.type';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
// import Dropdown from '@/core/Dropdown';
// import FoodieText from '@/core/FoodieText';
import { fetchAssetsForType, fetchAsset } from '../api/api';
import Count from '@/core/Count';
import ChipButton from '@/core/ChipButton';

async function fetchAssetsForProductType(assetType: string, productType: string, productName: string) {  
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

// const productTypeList = ['Veg', 'Non-Veg', 'Addon'];
const PRODUCT_TYPE_OPTIONS = [
  { name: 'Veg', value: 'veg' },
  { name: 'Non Veg', value: 'non-veg' },
  { name: 'Addon', value: 'addon' }
]

const BrandProducts = () => {
  let assetType = 'brand-product';
  const [productType, setProductType] = useState(PRODUCT_TYPE_OPTIONS[0].value);
  const [selectedProductType, setSelectedProductType] = useState();
  // const [productName, setProductName] = useState('');
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);
  // const [enabled, setEnabled] = useState(true);
  const [mappedProducts, setMappedProducts] = useState<ProductAsset[]>([]);

  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const productName = ''; // not being used

  function getMappings(assetType: string): Mapping {
    switch (assetType) {
      case 'brand-product': 
        return { 
          order: [
            { name: 'Name', id: 'productName'},
            { name: 'Brand', id: 'brandName'},
            { name: 'Arrived', id: 'createdAt', data: (row: BrandProduct) => localDate(row.createdAt)},
            { name: 'ID', id: 'brandTypeProductPrefix', data: (row: BrandProduct) => `${row.brandTypeProductPrefix}-${row.variantSequence}` },
            { name: 'Map Items', data: (row: BrandProduct) => {

              return !row.mapped 
                ? _(<div className='text-center'>
                      <button 
                        className={"py-2 px-10 rounded uppercase cursor-pointer text-indigo-500 bg-indigo-50 font-extrabold"} 
                        onClick={() => navigate(`/product/${row.productType}/${row.brandTypeProductPrefix}-${row.variantSequence}/${row.productName}`)}>Map</button>
                    </div>)
                : _(<div className='text-center'>
                      <span className='cursor-pointer text-sm uppercase text-indigo-600 underline font-light italic'
                        onClick={() => navigate(`/product/${row.productType}/${row.brandTypeProductPrefix}-${row.variantSequence}/${row.productName}`)}
                      >View</span>
                    </div>);
            }}
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

  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ['asset', assetType, productType, productName],
    queryFn: async () => {
      try {
        const data = await fetchAssetsForProductType(assetType, productType, productName);
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
    enabled: true
  });

  const products = useQuery({
    queryKey: ['asset', 'product'],
    queryFn: async () => {
      try {
        const data = await fetchAssetsForType('product');
        // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
        // alert(JSON.stringify(data.data));
        return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: 60 * 1000,
    enabled: true
  });

  const totalProducts = useQuery({
    queryKey: ['asset', 'cache', 'product-names_count-total'],
    queryFn: async () => {
      try {
        const data = await fetchAsset('cache', 'product-names_count-total');
        // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
        // alert(JSON.stringify(data.data.result));
        return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: 60 * 1000,
    enabled: true
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

        let brandProducts = data.map((bp: BrandProduct) => ({ ...bp, mapped: false }));

        // alert(`Got brand products : ${brandProducts.length}`);

        if (mappedProducts && mappedProducts.length) {
          // alert(`mapped products : ${mappedProducts.length}`);
          const brandTypeProductPrefixes = mappedProducts.map(mp => {
            // alert(JSON.stringify(mp));
            return mp.assetId;
          });

          // alert(`brandTypeProductPrefixes : ${brandTypeProductPrefixes}`);

          brandProducts = brandProducts.map((bp: BrandProduct) => {
            const id = `${bp.brandTypeProductPrefix}-${bp.variantSequence}`;

            if (brandTypeProductPrefixes.includes(id)) {
              // alert(`${JSON.stringify(brandTypeProductPrefixes)}: ${id}`);
              return {
                ...bp,
                mapped: true
              }
            } else {
              // alert(`This product is not mapped : ${id}`)
              return bp;
            }
          })
        }
        
        setTableData(brandProducts);
        let cols: Mapping = getColumns(assetType, Object.keys(data[0]));
        // alert('col loaded');
        setColumns(cols.order);
      }
    }

  }, [isPending, error, data, assetType, mappedProducts]);

  useEffect(() => {
    if (products.error) {
      if (axios.isAxiosError(products.error)) {
        alert(products.error.response?.data);
        if (products.error.response && products.error.response.status == 404) {
        }
      }
    } else if (products.data && products.data.length) {
      // alert(JSON.stringify(products.data));
      setMappedProducts(products.data)
    }

  }, [products.isPending, products.isFetching, products.error, products.data]);

  useEffect(() => {
    if (totalProducts.error) {
      if (axios.isAxiosError(totalProducts.error)) {
        alert(totalProducts.error.response?.data);
        if (totalProducts.error.response && totalProducts.error.response.status == 404) {
        }
      }
    } else if (totalProducts.data) {
      // alert(totalProducts.data.data);
      setTotal(totalProducts.data.data);
    }

  }, [totalProducts.isPending, totalProducts.isFetching, totalProducts.error, totalProducts.data])

  useEffect(() => {
    if (!isPending && selectedProductType) {
      setProductType(selectedProductType)
    }
  }, [isPending, selectedProductType])

  return (<div className='pt-10'>
    {assetType && <>
      {/* <h1>{assetType}</h1> */}

      <div className='flex flex-row gap-8 px-10 mb-10'>
        <Count label='Unmapped Products' count={total - mappedProducts.length} />
        <Count label='Products Defined' count={mappedProducts.length} />
      </div>

      <div className='flex flex-row gap-4 px-10 mb-10 items-center'>
        <span className='inline-block text-md font-regular uppercase text-slate-600 w-64'>Show Menu Products for: </span>

        {PRODUCT_TYPE_OPTIONS 
          && PRODUCT_TYPE_OPTIONS.map(pt => <ChipButton key={pt.value} value={pt.value} label={pt.name} 
            isActive={pt.value == productType} update={setSelectedProductType}
            isLoading={selectedProductType && isPending && selectedProductType == pt.value}
             />)
        }
      </div>
      
      {/* <div className='flex flex-row mx-10 items-end gap-4 h-20'>
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
          
      </div> */}
      { isPending ? (isFetching ? <h4 className='italic text-md text-slate-400 ml-10 font-light'>Loading {productType} products ...</h4> : '')
        : <div className="container mx-auto">
            <h4 className='italic text-md text-slate-400 ml-1 font-light'>{data.length} products found</h4>
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