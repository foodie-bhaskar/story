import { useEffect, useState, FC } from 'react';
import { convertDateFormat, convertISOToISTFormat, RangeConverter as RC } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { NavigateFunction } from 'react-router-dom';
import axios from 'axios';
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import { Cache, Query } from '@/App.type';
import LinkButton from '@/core/LinkButton';
import CircleValue from '@/core/CircleValue';
// import "gridjs/dist/theme/mermaid.css";

import Loader from '@/core/Loader';

type Mapping = {
  order: OneDArray<ComponentChild>
}
  
interface QueryTableProps {
    query: Query
    borderOn?: boolean,
    allowSearch?: boolean,
    nav?: NavigateFunction
}
  
const QueryTable: FC<QueryTableProps> = ({ query, borderOn, allowSearch, nav }) => {
    const [tableData, setTableData] = useState();
    const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);
  
    const apiQuery = useQuery({
      queryKey: [query.primary, query.type, RC.toString(query.range)],
      queryFn: query.queryFn,
      staleTime: Infinity,
      enabled: true
    });
  
    function getMappings(assetType: string, nav?: NavigateFunction): Mapping {
      switch (assetType) {
        case 'production-date': 
          let mappings: any = [];
    
          try {
            mappings = {
              order: [
                { 
                  name: 'Production Date', 
                  id: 'group',
                  formatter: (cell: string) => _(<div className="flex justify-center">                  
                    <LinkButton label={convertDateFormat(cell)} to={cell} nav={nav} />
                  </div>)
                },
                { name: 'Batches', id: 'payload', 
                  formatter: (cell: Cache[]) => _(<div className="flex justify-center">
                    {cell.length == 1 
                      ? <span className="font-light text-gray-500">1</span> 
                      : <CircleValue value={`${cell.length}`} />
                    }
                    </div> 
                  )
                },
                { name: 'Packets', id: 'data', formatter: (cell: number) => _(
                  <div className="text-center">
                    <div className="font-light text-gray-500">{cell}</div>
                  </div>
                )},
                { name: 'Items', id: 'distinctItems', formatter: (cell: number) => _(
                  <div className="text-center">
                    <div className="font-light text-gray-500">{cell}</div>
                  </div>
                )},
                
                { name: 'Uploaded At', id: 'createdAt', sort: false,
                  formatter: (cell: string) => _(
                    <div className="text-center">
                      <div className="font-light italic text-gray-500">
                        {convertISOToISTFormat(cell)}
                      </div>
                    </div>
                  )
                },
                { name: 'Updated At', id: 'updatedAt',
                  formatter: (cell: string) => _(
                    <div className="text-center">
                      {cell ? <div className="font-light italic text-gray-500">
                          {convertISOToISTFormat(cell)}
                        </div>
                        : ''
                      }
                    </div>
                    
                  )
                },
                { name: _(<div className="font-bold text-center">Status</div>),
                  sort: false,
                  id: 'isPending',
                  formatter: (cell: string) => _(
                    <div className="text-center">
                      {cell === undefined ? ''
                      : <div className="w-40">
                        {cell 
                          ? <div className={"py-2 rounded uppercase text-yellow-700 bg-yellow-100 font-bold"}>
                              pending
                            </div>
                          : <div className={"py-2 rounded uppercase text-green-700 bg-green-100 font-bold"}>
                              done
                          </div>
                        }
                        </div>}
                    </div>
                  )
                },
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
  
    function getColumns(assetType: string, fields: string[], nav?: NavigateFunction) {
      console.log('fields', fields)
      let colsInOrder = getMappings(assetType, nav);
      return colsInOrder;
    }
  
    useEffect(() => {
      if (apiQuery.isFetching) {
      } else {
      
        if (apiQuery.error) {
          if (axios.isAxiosError(apiQuery.error)) {
            alert(apiQuery.error.response?.data);
            // if (error.response && error.response.status == 404) {
            // }
          }
        } else if (apiQuery.data) {
          setTableData(apiQuery.data);
          let cols: Mapping = getColumns('production-date', Object.keys(apiQuery.data[0]), nav);
          setColumns(cols.order);
        }
      } 
  
    }, [apiQuery.isPending, apiQuery.isFetching, apiQuery.error, apiQuery.data]);
  
    return <div className={`${borderOn ? 'border border-red-700': ''} my-4 flex flex-col gap-8`}>
      {!apiQuery.isFetching && !apiQuery.data && <h4>{query.info} fetching ... </h4>}
  
      {apiQuery.isFetching && <Loader />}
      {apiQuery.error && <p>Error: {JSON.stringify(apiQuery.error.message)}</p>}
      {/* {apiQuery.isSuccess && apiQuery.data && <div>
        {apiQuery.data.length}
      </div>} */}
  
      {apiQuery.isSuccess && apiQuery.data && tableData &&
        <Grid
            data={tableData}
            columns={columns}
            search={allowSearch}
            pagination={{
              limit: 7,
            }}
            fixedHeader={true}
            style={ { 
              table: { 
                'white-space': 'nowrap',
                'width': '100%'
              }
            }}
            sort={true}
            resizable={true}
            className={{  
              td: 'min-w-14',
              tr: 'min-w-max'
            }}
          />
        }
    </div>
}

export default QueryTable;
