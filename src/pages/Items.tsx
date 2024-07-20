import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { capitalizeWords } from '@/lib/utils';
import { ItemOpts, PackageAsset } from '@/App.type';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import { fetchAssetsForType } from '../api/api';
import LinkButton from '@/core/LinkButton';

type Mapping = {
  order: OneDArray<ComponentChild>
}

function getMappings(assetType: string, nav: Function): Mapping {
  switch (assetType) {
    case 'rid': 
      return {
        order: ['rid', 'brandName', 'aggregator', 'storeName', 'storeId']
      }

    case 'item':
      let order = { 
        order: [
          { name: 'ID', id: 'assetId'},
          { name: 'Item', id: 'name'},
          { name: 'Vendor', id: 'vendor', data: (row: ItemOpts) => capitalizeWords(row.vendor)},
          { name: 'Consumption', id: 'consumptionCount'},
          { name: 'Is Packet?', id: 'isPacket', data: (row: ItemOpts) => row.isPacket ? 'Yes': 'NO '},
          { name: 'Veg / Non-Veg', id: 'isVeg', data: (row: ItemOpts) => row.isVeg ? 'Veg': 'non-veg '},
          { name: 'Cuisine', id: 'cuisineCombo', data: (row: ItemOpts) => row.cuisineCombo.length ? capitalizeWords(row.cuisineCombo[0].value): '' },
          { name: 'Type', id: 'typeCombo', data: (row: ItemOpts) => capitalizeWords(row.typeCombo[0].value) },
          { name: 'Sub Type', id: 'typeCombo', data: (row: ItemOpts) => {
            if (row.typeCombo && row.typeCombo[1]) {
              return capitalizeWords(row.typeCombo[1].value);
            }
          }},
          { name: 'Sub Sub Type', id: 'typeCombo', data: (row: ItemOpts) => {
            if (row.typeCombo && row.typeCombo[2]) {
              return capitalizeWords(row.typeCombo[2].value) 
            }
          }},
          { name: 'Weight', id: 'weight', data: (row: ItemOpts) => row.weight.total },
          { name: 'Raw Material Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[0].value },
          { name: 'Pre Commission Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[1].value },
          { name: 'Post Aggregator Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[2].value },
          { name: 'Post Store Cost', id: 'costBuildup', data: (row: ItemOpts) => row.costBuildup[3].value }
        ]
      }

      // alert(JSON.stringify(order));

      return order;

    case 'package':
      let mappings: any = [];

      try {
        mappings = {
          order: [
            { name: 'ID', id: 'assetId', 
              data: (row: PackageAsset) => {      
                let to = `/view-asset/package/${row.assetId}`;
              
                return _(row.assetId? <LinkButton label={row.assetId} to={to} nav={nav} />: '')
              }
            },
            { 
              name: 'Name', 
              id: 'name',
              data: (row: PackageAsset) => {      
                let to = `/edit-asset/package/${row.assetId}`;
              
                return _(row.name? <LinkButton label={row.name} to={to} nav={nav} />: '')
              }
            },
            { name: '# of Compartments', id: 'compartments'},
            { name: 'Volume (in ml)', id: 'volume'},
            { name: 'Cost', id: 'packagingCost'},
            { name: 'Packaging Type', id: 'packagingTypeCombo', data: (row: PackageAsset) => {
              let error = '';
              if (row.packagingTypeCombo) {
                if (row.packagingTypeCombo.length) {
                  return capitalizeWords(row.packagingTypeCombo[0].value)
                } else {
                  error = 'packagingType 0 length';
                }

              } else {
                error = 'packagingType Missing'
              }

              return error;
              
            }},
            { name: 'Packaging Sub Type', id: 'packagingTypeCombo', data: (row: PackageAsset) => row.packagingTypeCombo[1] ? capitalizeWords(row.packagingTypeCombo[1].value) : ''}
          ]
        }
      } catch (e) {
        alert(JSON.stringify(e));
      }
      return mappings;

    default:
      return {
        order: ['']
      }
  }
}

// 
function getColumns(assetType: string, fields: string[], nav: Function) {
  console.log('fields', fields)
  let colsInOrder = getMappings(assetType, nav);
  return colsInOrder;
}

const Items = () => {
  let { assetType } = useParams();
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);
  const nav =  useNavigate();

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
      // alert(`AssetType changed ${assetType}`);
      if (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data);
          if (error.response && error.response.status == 404) {
          }
        }
      } else if (data) {
        
        setTableData(data);
        let cols: Mapping = getColumns(assetType, Object.keys(data[0]), nav);
        // alert('col loaded');
        setColumns(cols.order);
      }
    }
  }, [isPending, error, data, assetType]);

  return (<div className=''>
    <div className='ps-8 mt-10'>
      <h1 className="text-lg text-slate-600 font-semibold uppercase">{assetType}</h1>
    </div>
    
      { isPending && `Loading ${assetType}s ...`}
      {tableData && <div className="container mx-auto py-10">
            <h4>{data.length} found</h4>
            <Grid
              data={tableData}
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
    
  </div>);
}

export default Items;