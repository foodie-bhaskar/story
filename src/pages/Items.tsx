import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { capitalizeWords } from '@/lib/utils';
import { ItemOpts, PackageAsset } from '@/App.type';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';

async function fetchAssetsForType(assetType: string | undefined) {  
  if (!assetType) {
    throw new Error('Asset type is required');
  }
  return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=${assetType.toUpperCase()}`, {
      headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
      }
  });
}

type Mapping = {
  order: OneDArray<ComponentChild>
}

function getMappings(assetType: string): Mapping {
  switch (assetType) {
    case 'rid': 
      return {
        order: ['rid', 'brandName', 'aggregator', 'storeName', 'storeId']
      }

    case 'item':
      return { 
        order: [
          { name: 'ID', id: 'assetId'},
          { name: 'Item', id: 'name'},
          { name: 'Vendor', id: 'vendor', data: (row: ItemOpts) => capitalizeWords(row.vendor)},
          { name: 'Consumption', id: 'consumptionCount'},
          { name: 'Is Packet?', id: 'isPacket', data: (row: ItemOpts) => row.isPacket ? 'Yes': 'NO '},
          { name: 'Veg / Non-Veg', id: 'isVeg', data: (row: ItemOpts) => row.isVeg ? 'Veg': 'non-veg '},
          { name: 'Cuisine', id: 'cuisineCombo', data: (row: ItemOpts) => capitalizeWords(row.cuisineCombo[0].value) },
          { name: 'Type', id: 'typeCombo', data: (row: ItemOpts) => capitalizeWords(row.typeCombo[0].value) },
          { name: 'Sub Type', id: 'typeCombo', data: (row: ItemOpts) => capitalizeWords(row.typeCombo[1].value) },
          { name: 'Sub Sub Type', id: 'typeCombo', data: (row: ItemOpts) => capitalizeWords(row.typeCombo[2].value) },
          { name: 'Weight', id: 'weight', data: (row: ItemOpts) => row.weight.total },
          { name: 'Raw Material Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[0].value },
          { name: 'Pre Commission Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[1].value },
          { name: 'Post Aggregator Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[2].value },
          { name: 'Post Store Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[3].value },
        ]
      }

    case 'package':
      return {
        order: [
          { name: 'ID', id: 'assetId'},
          { name: 'Name', id: 'name'},
          { name: '# of Compartments', id: 'compartments'},
          { name: 'Volume (in ml)', id: 'volume'},
          { name: 'Cost', id: 'packagingCost'},
          { name: 'Packaging Type', id: 'packagingTypeCombo', data: (row: PackageAsset) => capitalizeWords(row.packagingTypeCombo[0].value)},
          { name: 'Packaging Sub Type', id: 'packagingTypeCombo', data: (row: PackageAsset) => row.packagingTypeCombo[1] ? capitalizeWords(row.packagingTypeCombo[1].value) : ''}
        ]
      }

    default:
      return {
        order: ['']
      }
  }
}

// 
function getColumns(assetType: string, fields: string[]) {
  console.log('fields', fields)
  let colsInOrder = getMappings(assetType);
  return colsInOrder;
}

const Items = () => {
  let { assetType } = useParams();
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['asset', assetType],
    queryFn: async () => {
      try {
        const data = await fetchAssetsForType(assetType);
        // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
        // alert(JSON.stringify(rows));
        return rows;
      } catch (err) {
        const error = err as AxiosError;
        throw error;
    }
    },
    staleTime: 60 * 1000
  });

  useEffect(() => {
    if (assetType) {
    
      if (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data);
          if (error.response && error.response.status == 404) {
          }
        }
      } else if (data) {
        
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
      { isPending ? `Loading ${assetType}s ...`
        : <div className="container mx-auto py-10">
            <h4>{data.length} found</h4>
            <Grid
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
            />
        </div>
      }
    </>}
    
  </div>);
}

export default Items;