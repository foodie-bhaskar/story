import { useEffect, useState, useMemo } from 'react';
import { dateRange, convertDateFormat } from '@/lib/utils';
import { fetchCachesForRange, fetchStores } from '../api/api';
import { useQueries } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import { useNavigate } from 'react-router-dom';
import LinkButton from '@/core/LinkButton';
import { replaceHashMarks } from '@/lib/utils';

type Mapping = {
  order: OneDArray<ComponentChild>
}

type StoreDetail = {
  store_id: string;
  storeName: string;
  city: string;
}

type StoreCache = {
  [key: string]: StoreDetail;
}

type ShipmentRow = {
  shipmentId: string;
  shippedDate: string,
  storeId: string;
  packetCount: number,
  itemCount: number
  scannedTime: string
}

interface ItemNameQtyMap {
  [key: string]: string;
}

interface ShipmentCache {
  data: number,
  payload: ItemNameQtyMap,
  createdAt: string,
  updatedAt?: string,
  storeId: string,
  type: string
  group: string,
  distinctItems?: number
  isPending?: boolean
}

export const useCombinedQueries = (range: string[]) => {
  const [shipmentQuery, storeDetailsQuery] = useQueries({
    queries: [
      {
        queryKey: ['cache', 'shipment', range],
        queryFn: async () => {
          try {
            const data = await fetchCachesForRange('shipment', range);
            
            const rows = data.data.result.map((row: ShipmentCache) => {
              
              const {
                group, storeId, data, distinctItems, createdAt
              } = row;

              const [shpDtSuffix, ] = group.split('#');
              const shpmnt: ShipmentRow = {
                shipmentId: group,
                storeId,
                packetCount: data,
                itemCount: distinctItems || 0,
                shippedDate: shpDtSuffix.substring(4),
                scannedTime: createdAt
              }
              return shpmnt;
            });
            // alert(JSON.stringify(rows[0]));
            return rows;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
      },
      {
        queryKey: ['cache', 'store-details'],
        queryFn: async () => {
          try {
            const data = await fetchStores();
  
            const storeMap: StoreCache = data.data.result[0].payload;
            return storeMap;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
      }
    ]
  });

  // Ensure both queries are complete before merging
  const mergedData = useMemo(() => {
    // Check if both queries are successful and have data
    if (
      shipmentQuery.isSuccess && 
      storeDetailsQuery.isSuccess && 
      shipmentQuery.data && 
      storeDetailsQuery.data
    ) {
      return shipmentQuery.data.map((shipment: ShipmentRow) => {
       
        return {
          ...shipment,
          storeDetails: storeDetailsQuery.data[shipment.storeId] || null
        };
      });
    }

    // Return empty array or original data if queries are not complete
    return [];
  }, [
    shipmentQuery.isSuccess, 
    storeDetailsQuery.isSuccess, 
    shipmentQuery.data, 
    storeDetailsQuery.data
  ]);

  return {
    shipment: {
      // data: shipmentQuery.data,
      data: mergedData,
      originalData: shipmentQuery.data,
      isPending: shipmentQuery.isPending,
      isFetching: shipmentQuery.isFetching,
      error: shipmentQuery.error
    },
    storeDetails: {
      data: storeDetailsQuery.data,
      isPending: storeDetailsQuery.isPending,
      isFetching: storeDetailsQuery.isFetching,
      error: storeDetailsQuery.error
    },
    isAllQueriesComplete: shipmentQuery.isSuccess && storeDetailsQuery.isSuccess
  };
};

const Shipment = () => {
    let borderOn = false;
    // borderOn = true;
    
    const [ range ] = useState<string[]>(dateRange(7));
    const [tableData, setTableData] = useState();
    const nav =  useNavigate();
    const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);

    const { shipment, isAllQueriesComplete } = useCombinedQueries(range);

    function getMappings(assetType: string, nav: Function): Mapping {
      // alert(assetType);
      let mappings: any = [];
      switch (assetType) {

        
        case 'shipment': 
          // alert('shipment')
          try {
            mappings = {
              order: [
                { 
                  name: 'Shipment ID', 
                  id: 'shipmentId',
                  formatter: (cell: string) => _(<div className="flex justify-start">        
                    <LinkButton label={cell} to={replaceHashMarks(cell)} nav={nav} />
                  </div>)
                },
                { 
                  name: 'Ship Date', 
                  id: 'shippedDate',
                  formatter: (cell: string) => _(<div className="flex justify-center">
                    <div className="font-light text-gray-500">{convertDateFormat(cell)}</div>       
                  </div>)
                },
                { 
                  name: 'Store #', 
                  id: 'storeId',
                  formatter: (cell: string) => _(<div className="flex justify-center">        
                    <div className="font-light text-gray-500">{cell}</div>  
                  </div>)
                },
                { 
                  name: 'Store', 
                  id: 'storeDetails',
                  formatter: (cell: StoreDetail) => _(<div className="flex justify-center">        
                    <div className="font-light text-gray-500">{cell.storeName}</div>  
                  </div>)
                },
                { 
                  name: 'City', 
                  id: 'storeDetails',
                  formatter: (cell: StoreDetail) => _(<div className="flex justify-center">        
                    <div className="font-light text-gray-500">{cell.city}</div>  
                  </div>)
                },
                { name: 'Packets', id: 'packetCount', formatter: (cell: number) => _(
                  <div className="text-center">
                    <div className="font-light text-gray-500">{cell}</div>
                  </div>
                )},
                { name: 'Items', id: 'itemCount', formatter: (cell: number) => _(
                  <div className="text-center">
                    <div className="font-light text-gray-500">{cell}</div>
                  </div>
                )},
                /* { name: 'Scanned At', id: 'scannedTime',
                  formatter: (cell: string) => _(
                    <div className="text-center">
                      {cell ? <div className="font-light italic text-gray-500">
                          {convertISOToISTFormat(cell)}
                        </div>
                        : ''
                      }
                    </div>
                    
                  )
                }, */
              ]
            }
          } catch (e) {
            alert(e);
            // alert(JSON.stringify(e));
          }
          return mappings;
    
        default:
          return {
            order: ['']
          }
      }
    }
    
    function getColumns(assetType: string, fields: string[], nav: Function) {
      console.log('fields', fields);
      // alert(fields);
      let colsInOrder = getMappings(assetType, nav);
      return colsInOrder;
    }

    useEffect(() => {
      if (shipment.isPending) {
      //   setIsRefetchingProducts(true);
      } else {
        // alert('All queries loaded')
        setTableData(shipment.data);
        let cols: Mapping = getColumns('shipment', shipment.data, nav);
        setColumns(cols.order);
      }
      
  
    }, [shipment.isPending, shipment.data]);


    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-10 my-4 `}>
        <h1 className="text-lg text-slate-600 font-semibold uppercase">Shipments History</h1>

        <div className={`${borderOn ? 'border border-red-700': ''} h-16 flex flex-row`}>
          <div className={`${borderOn ? 'border border-red-700': ''} basis-9/12 align-middle`}>
          { shipment.isPending && `Fetching history for the duration [${range[0]} - ${range[1]}] ...`}
          { !shipment.isPending && shipment.data && `${shipment.data.length} shipments during   [${range[0]} - ${range[1]}] ...`}
          </div>

        </div>

        {isAllQueriesComplete && tableData && <div className="pt-4">
            <h4>{shipment.data.length} shipments</h4>
            <Grid
              data={tableData}
              columns={columns}
              search={true}
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
                td: 'w-auto',
                tr: 'min-w-max'
              }}
            />
        </div>}
    </div>);
}

export default Shipment;