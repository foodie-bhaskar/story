import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { localDate } from '@/lib/utils';
import { BrandProduct } from '@/App.type';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
// import Dropdown from '@/core/Dropdown';
// import FoodieText from '@/core/FoodieText';
import { fetchAsset, fetchCachesForType } from '../api/api';
import Count from '@/core/Count';
import ChipButton from '@/core/ChipButton';
import FoodieToggle from '@/core/FoodieToggle';

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

const PRODUCT_TYPE_OPTIONS = [
  { name: 'Veg', value: 'veg' },
  { name: 'Non Veg', value: 'non-veg' },
  { name: 'Addon', value: 'addon' }
]

const BrandProducts = () => {
  let assetType = 'brand-product';
  const [productType, setProductType] = useState(PRODUCT_TYPE_OPTIONS[0].value);
  const [selectedProductType, setSelectedProductType] = useState(PRODUCT_TYPE_OPTIONS[0].value);
  
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);
  const [mappedProducts, setMappedProducts] = useState<string[]>([]);
  const [hideMappedProducts, setHideMappedProducts] = useState<boolean>(true);

  const [isRefetchingProducts, setIsRefetchingProducts] = useState(false);

  const [total, setTotal] = useState(0);
  const [weekly, setWeekly] = useState(0);
  const [mapped, setMapped] = useState(0);

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
              const { productType, brandTypeProductPrefix, variantSequence, productName } = row;
              const productPageUrl = `/product/${productType}/${brandTypeProductPrefix}-${variantSequence}/${productName}`;
              return !row.mapped 
                ? _(<div className='text-center'>
                      <button 
                        className={"py-2 px-10 rounded uppercase cursor-pointer text-indigo-500 bg-indigo-50 font-extrabold"} 
                        onClick={() => navigate(productPageUrl)}>Map</button>
                    </div>)
                : _(<div className='text-center'>
                      <span className='cursor-pointer text-sm uppercase text-indigo-600 underline font-light italic'
                        onClick={() => navigate(`${productPageUrl}?page=view`)}
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
    staleTime: Infinity,
    enabled: true
  });

  const products = useQuery({
    queryKey: ['cache', 'product'],
    queryFn: async () => {
      try {
        // const data = await fetchAssetsForType('product');
        const data = await fetchAsset('cache', 'asset_PRODUCT');
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
        // alert(JSON.stringify(rows));
        return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: Infinity,
    enabled: true
  });

  const productsSummary = useQuery({
    queryKey: ['asset', 'cache', 'product-names'],
    queryFn: async () => {
      try {
        // const data = await fetchAsset('cache', 'product-names_count-total');
        const data = await fetchCachesForType('product-names', 'count');
        // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));

        type cacheRow = {
          data: number,
          payload: string,
          group: string,
          type: string,
          updatedAt: string
        }

        return rows.reduce((acc: any, row: cacheRow) => {
          const { group, ...rest } = row;
          acc[group] = rest;
          return acc;
        }, {});

        // alert(JSON.stringify(data.data.result));
        // return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: Infinity,
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

        if (mappedProducts && mappedProducts.length) {
          brandProducts = !hideMappedProducts 
            ? brandProducts.map((bp: BrandProduct) => {
              const id = `${bp.brandTypeProductPrefix}-${bp.variantSequence}`;

              if (mappedProducts.includes(id)) {
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
            : brandProducts.filter((bp: BrandProduct) => {
                const id = `${bp.brandTypeProductPrefix}-${bp.variantSequence}`;
                return !mappedProducts.includes(id);
            })
        }
        
        setTableData(brandProducts);
        let cols: Mapping = getColumns(assetType, Object.keys(data[0]));
        // alert('col loaded');
        setColumns(cols.order);
      }
    }

  }, [isPending, error, data, assetType, mappedProducts, hideMappedProducts]);

 /*  useEffect(() => {
    products.refetch();
  }, []) */

  useEffect(() => {
    if (products.isFetching) {
      setIsRefetchingProducts(true);
    } else {
      setIsRefetchingProducts(false);
    
      if (products.error) {
        if (axios.isAxiosError(products.error)) {
          alert(products.error.response?.data);
          // if (products.error.response && products.error.response.status == 404) {
          // }
        }
      } else if (products.data) {
        const result = products.data;
        let productIds = result.payload;
        setMappedProducts(productIds)
      }
    }

  }, [products.isPending, products.isFetching, products.error, products.data]);

  useEffect(() => {
    if (productsSummary.error) {
      if (axios.isAxiosError(productsSummary.error)) {
        alert(productsSummary.error.response?.data);
        /* if (productsSummary.error.response && productsSummary.error.response.status == 404) {
        } */
      }
    } else if (productsSummary.data) {
      // alert(productsSummary.data);
      setTotal(productsSummary.data['count#total'].data);
      setWeekly(productsSummary.data['count#weekly'].data);
      setMapped(productsSummary.data['count#mapped'].data);
    }

  }, [productsSummary.isPending, productsSummary.isFetching, productsSummary.error, productsSummary.data])

  useEffect(() => {
    if (!isPending && selectedProductType) {
      setProductType(selectedProductType)
    }
  }, [isPending, selectedProductType])

  return (<div className='pt-10'>
    {assetType && <>

      <div className='flex flex-row gap-8 px-10 mb-10'>
        <Count label='Unmapped Products' count={total - mapped} isLoading={productsSummary.isFetching} />
        <Count label='Products Mapped' count={mapped} isLoading={productsSummary.isFetching} />
        
        <Count label='Weekly Additions' isLoading={productsSummary.isFetching} count={weekly} />
        <Count label='Products Mapped' isLoading={isRefetchingProducts} array={mappedProducts} />
      </div>

      <div className='flex flex-row mx-10 ml-10 justify-between items-center'>
        <div className='flex flex-row gap-4 items-center'>
          <span className='inline-block text-md font-regular uppercase text-slate-600 w-64'>Show Menu Products for: </span>

          {PRODUCT_TYPE_OPTIONS 
            && PRODUCT_TYPE_OPTIONS.map(pt => <ChipButton key={pt.value} value={pt.value} label={pt.name} 
              isActive={pt.value == productType} update={setSelectedProductType}
              isLoading={isPending && selectedProductType == pt.value}
              />)
          }
        </div>

        <FoodieToggle label='Hide Mapped' action={setHideMappedProducts} active={hideMappedProducts} />
      </div>
      
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