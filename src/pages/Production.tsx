import { useEffect, useState } from 'react';
import { dateRange, convertDateFormat, convertISOToISTFormat } from '@/lib/utils';
import { fetchCachesForRange } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import { useNavigate } from 'react-router-dom';
import { Cache } from '@/App.type';
import LinkButton from '@/core/LinkButton';

type Mapping = {
  order: OneDArray<ComponentChild>
}

function getMappings(assetType: string, nav: Function): Mapping {
  switch (assetType) {
    case 'production-date': 
      let mappings: any = [];

      try {
        mappings = {
          order: [
            { 
              name: 'Production Date', 
              id: 'group',
              data: (row: Cache) => {                    
                return _(<LinkButton label={convertDateFormat(row.group)} to={row.group} nav={nav} />)
              }
            },
            { name: '# of Batches', id: 'payload', data: (row: Cache) => row.payload.length},
            { name: 'Total Packets', id: 'data'},
            { name: 'Items', id: 'distinctItems'},
            { name: 'Upload Time', id: 'createdAt', data: (row: Cache) => convertISOToISTFormat(row.createdAt)}
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

function getColumns(assetType: string, fields: string[], nav: Function) {
  console.log('fields', fields)
  let colsInOrder = getMappings(assetType, nav);
  return colsInOrder;
}

const Production = () => {
    let borderOn = false;
    // borderOn = true;
    
    const [ range ] = useState<string[]>(dateRange(30));
    const [tableData, setTableData] = useState();
    const nav =  useNavigate();
    const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);

    const { isPending, isFetching, error, data } = useQuery({
        queryKey: ['cache', 'production-date'],
        queryFn: async () => {
          try {
            // const data = await fetchAssetsForType('product');
            const data = await fetchCachesForRange('production-date', range);
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

    useEffect(() => {
        // alert(`Range : ${JSON.stringify(range)}`);
    }, []);

    useEffect(() => {
        if (isFetching) {
        //   setIsRefetchingProducts(true);
        } else {
        //   setIsRefetchingProducts(false);
        
          if (error) {
            if (axios.isAxiosError(error)) {
              alert(error.response?.data);
              // if (error.response && error.response.status == 404) {
              // }
            }
          } else if (data) {
            // alert(JSON.stringify(data[0].payload));
            setTableData(data);
            let cols: Mapping = getColumns('production-date', Object.keys(data[0]), nav);
            // alert('col loaded');
            setColumns(cols.order);
          }
        }
    
      }, [isPending, isFetching, error, data]);


    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-10 my-4 `}>
        <h1 className="text-lg text-slate-600 font-semibold uppercase">Production History</h1>

        { isPending && `Fetch history for the duration [${range[0]} - ${range[1]}] ...`}

        {tableData && <div className="container -ms-8 pt-4">
            <h4>{data.length} production days</h4>
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
        </div>}
    </div>);
}

export default Production;