import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { localDate } from '@/lib/utils';
import { AbstractProductAsset } from '@/App.type';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import { fetchAssetsForType } from '../api/api';
import Count from '@/core/Count';
import FoodieToggle from '@/core/FoodieToggle';

type Mapping = {
  order: OneDArray<ComponentChild>
}

const AbstractProducts = () => {
  const assetType = 'abstract-product';
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);
  const [unmappedProducts, setUnmappedProducts] = useState<AbstractProductAsset []>(); 
  const [hideMappedProducts, setHideMappedProducts] = useState<boolean>(true);

  const [weekly, setWeekly] = useState(0);
  const [daily, setDaily] = useState(0);

  const navigate = useNavigate();

  function getMappings(assetType: string): Mapping {
    switch (assetType) {
      case 'abstract-product': 
        return { 
          order: [
            { name: 'Id', id: 'assetId', data: (row: AbstractProductAsset) => parseInt(row.assetId)},
            { name: 'Name', id: 'name'},
            { name: 'Veg/Non-Veg', id: 'isVeg', data: (row: AbstractProductAsset) => row.isVeg ? 'Veg': 'Non-Veg'},
            { name: 'Arrived', id: 'createdAt', data: (row: AbstractProductAsset) => localDate(row.createdAt)},
            { name: 'Status', data: (row: AbstractProductAsset) => {
              const { primary, assetId } = row;
              const productPageUrl = `/abstract-product/${assetId}`;
              return primary.startsWith('UNMAPPED') 
                ? _(<div className='text-center'>
                      <button 
                        className={"py-2 px-10 rounded uppercase cursor-pointer text-indigo-500 bg-indigo-50 font-extrabold"} 
                        onClick={() => navigate(productPageUrl)}>Map</button>
                    </div>)
                : _(<div className='text-center'>
                      <span className='cursor-pointer text-sm uppercase text-indigo-600 underline font-light italic'
                        onClick={() => navigate(productPageUrl)}
                      >View</span>
                    </div>);
            }
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

  const { isFetching, isPending, error, data } = useQuery({
    queryKey: ['asset', assetType],
    queryFn: async () => {
      try {
        const data = await fetchAssetsForType(assetType);
        const rows = data.data.result;
        return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
      }
    },
    staleTime: Infinity,
    enabled: true
  });

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data);
        if (error.response && error.response.status == 404) {
        }
      }
    } else if (data && data.length) {
      setTableData(data);

      const now = new Date();

      let dailyAddition = 0;
      let weeklyAddition = 0;
      let unmapped = [];

      const DAY = 1000 * 60 * 60 * 24;
      const WEEK = DAY * 7;

      for (let i = 0; i < data.length; i++) {
        const { createdAt, primary } = data[i];

        // "primary": "UNMAPPED#TRUE#1"

        if (primary.startsWith('UNMAPPED')) {
          unmapped.push(data[i]);
        }

        if (now.getTime() - createdAt < DAY) {
          dailyAddition += 1;
        }

        if (now.getTime() - createdAt < WEEK) {
          weeklyAddition += 1;
        }
      }

      setDaily(dailyAddition);
      setWeekly(weeklyAddition);
      setUnmappedProducts(unmapped)

      let cols: Mapping = getColumns(assetType, Object.keys(data[0]));
      setColumns(cols.order);

    }
  }, [isFetching, isPending, error, data]);

  useEffect(() => {
    if (hideMappedProducts && unmappedProducts) {
      const unmpd: any = [ ... unmappedProducts];
      setTableData(unmpd)
    } else {
      setTableData(data);
    }

  }, [hideMappedProducts, unmappedProducts])

  return (<div className='pt-10'>
    {assetType && <>

      <div className='flex flex-row gap-8 px-10 mb-10'>
        <Count label='Unmapped Products' isLoading={isFetching} array={unmappedProducts} />
        <Count label='Daily Additions' isLoading={isFetching} count={daily} />
        <Count label='Weekly Additions' isLoading={isFetching} count={weekly} />
      </div>
      
      { isPending ? (isFetching 
        ? <h4 className='italic text-md text-slate-400 ml-10 font-light'>Loading abstract products ...</h4> : '')
        : <><div className='flex flex-row mx-10 ml-10 justify-end items-end'>
            <FoodieToggle label='Hide Mapped' action={setHideMappedProducts} active={hideMappedProducts} />
          </div>
          <div className="container mx-auto">
            <h4 className='italic text-md text-slate-400 ml-1 font-light'>{data.length} products found</h4>
            { data.length > 0 && <Grid
              data={tableData || []}
              columns={columns}
              search={true}
              pagination={{
                limit: 25,
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
                td: 'min-w-8'
              }}
            />}
          </div>
        </>
      }
    </>}
    
  </div>);
}

export default AbstractProducts;