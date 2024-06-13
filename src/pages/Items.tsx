import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { capitalizeWords } from '@/lib/utils';

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

const COL_MAPPINGS: Object = {
  RID: {
    order: ['rid', 'brandName', 'aggregator', 'storeName', 'storeId']
  },
  ITEM: {
    order: [
      { name: 'ID', id: 'assetId'},
      { name: 'Item', id: 'name'},
      { name: 'Vendor', id: 'vendor', data: (row) => capitalizeWords(row.vendor)},
      { name: 'Consumption', id: 'consumptionCount'},
      { name: 'Is Packet?', id: 'isPacket', data: (row) => row.isPacket ? 'Yes': 'NO '},
      { name: 'Veg / Non-Veg', id: 'isVeg', data: (row) => row.isVeg ? 'Veg': 'non-veg '},
      { name: 'Cuisine', id: 'cuisineCombo', data: (row) => capitalizeWords(row.cuisineCombo[0].value) },
      { name: 'Type', id: 'typeCombo', data: (row) => capitalizeWords(row.typeCombo[0].value) },
      { name: 'Sub Type', id: 'typeCombo', data: (row) => capitalizeWords(row.typeCombo[1].value) },
      { name: 'Sub Sub Type', id: 'typeCombo', data: (row) => capitalizeWords(row.typeCombo[2].value) },
      { name: 'Weight', id: 'weight', data: (row) => row.weight.total },
      { name: 'Raw Material Cost', id: 'costBuildup', data: (row) => row.costBuildup[0].value },
      { name: 'Pre Commission Cost', id: 'costBuildup', data: (row) => row.costBuildup[1].value },
      { name: 'Post Aggregator Cost', id: 'costBuildup', data: (row) => row.costBuildup[2].value },
      { name: 'Post Store Cost', id: 'costBuildup', data: (row) => row.costBuildup[3].value },
    ]
  },
  PACKAGE: {
    order: [
      { name: 'ID', id: 'assetId'},
      { name: 'Name', id: 'name'},
      { name: '# of Compartments', id: 'compartments'},
      { name: 'Volume (in ml)', id: 'volume'},
      { name: 'Cost', id: 'packagingCost'},
      { name: 'Packaging Type', id: 'packagingTypeCombo', data: (row) => capitalizeWords(row.packagingTypeCombo[0].value)},
      { name: 'Packaging Sub Type', id: 'packagingTypeCombo', data: (row) => row.packagingTypeCombo[1] ? capitalizeWords(row.packagingTypeCombo[1].value) : ''}
    ]
  }
}
// 
function getColumns(assetType: string, fields: string[]) {
  let colsInOrder = COL_MAPPINGS[assetType.toUpperCase()].order;
  return colsInOrder;
}

const Items = () => {
  let { assetType } = useParams();
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['asset', assetType],
    queryFn: async () => {
        const data = await fetchAssetsForType(assetType);
        // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
        const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
        // alert(JSON.stringify(rows));
        return rows;
    },
    staleTime: 60 * 1000
  });

  useEffect(() => {
    if (assetType) {
    
      if (error) {
        alert(error.response.data);
        if (error.response && error.response.status == '404') {
        }
      } else if (data) {
        setTableData(data);
        setColumns(getColumns(assetType, Object.keys(data[0])));
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
            />
        </div>
      }
    </>}
    
  </div>);
}

export default Items;