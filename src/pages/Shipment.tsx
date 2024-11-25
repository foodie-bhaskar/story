import { useEffect, useState } from 'react';
import { dateRange, convertDateFormat, convertISOToISTFormat, formattedDate } from '@/lib/utils';
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
import CircleValue from '@/core/CircleValue';

type Mapping = {
  order: OneDArray<ComponentChild>
}

function getMappings(assetType: string, nav: Function): Mapping {
  // alert(assetType);
  let mappings: any = [];
  switch (assetType) {
    case 'production-date': 
      

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
    
    case 'shipment': 
      // alert('shipment')
      try {
        mappings = {
          order: [
            { 
              name: 'Shipment Date', 
              id: 'group',
              formatter: (cell: string) => _(<div className="flex justify-center">
                <div className="font-light text-gray-500">{convertDateFormat(cell.split('#')[0].substring(4))}</div>       
              </div>)
            },
            { 
              name: 'Shipment ID', 
              id: 'group',
              formatter: (cell: string) => _(<div className="flex justify-center">        
                <LinkButton label={cell} to={cell} nav={nav} />
              </div>)
            },
            { 
              name: 'Store ID', 
              id: 'group',
              formatter: (cell: string) => _(<div className="flex justify-center">        
                <div className="font-light text-gray-500">{cell.split('#')[1]}</div>  
              </div>)
            },
            /* { name: 'Batches', id: 'payload', 
              formatter: (cell: Cache[]) => _(<div className="flex justify-center">
                {cell.length == 1 
                  ? <span className="font-light text-gray-500">1</span> 
                  : <CircleValue value={`${cell.length}`} />
                }
                </div> 
              )
            }, */
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
            { name: 'Scanned At', id: 'updatedAt',
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
            /* { name: _(<div className="font-bold text-center">Status</div>),
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
            }, */
          ]
        }
      } catch (e) {
        alert(e);
        // alert(JSON.stringify(e));
      }
      // alert(mappings);
      return mappings;

    default:
      return {
        order: ['']
      }
  }
}

/* row.isPending ?
                      <div 
                        className={"py-2 px-10 rounded uppercase cursor-pointer text-indigo-500 bg-indigo-50 font-extrabold"} 
                        >Generate</button>
                    </div>)
                    : _(<div className='text-center'>
                         <button 
                        className={"py-2 px-10 rounded uppercase cursor-pointer text-green-700 bg-green-100 font-extrabold"} 
                        onClick={() => alert('')}>View
                        </button>
                      </div>)
                ) */

function getColumns(assetType: string, fields: string[], nav: Function) {
  console.log('fields', fields);
  // alert(fields);
  let colsInOrder = getMappings(assetType, nav);
  return colsInOrder;
}

const Shipment = () => {
    let borderOn = false;
    // borderOn = true;
    
    const [ range ] = useState<string[]>(dateRange(7));
    const [tableData, setTableData] = useState();
    const nav =  useNavigate();
    const [columns, setColumns] = useState<OneDArray<ComponentChild>>([]);

    const today = formattedDate();

    const { isPending, isFetching, error, data } = useQuery({
        queryKey: ['cache', 'shipment'],
        queryFn: async () => {
          try {
            // const data = await fetchAssetsForType('product');
            const data = await fetchCachesForRange('shipment', range);
            const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
            // alert(JSON.stringify(rows.length));
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
            let cols: Mapping = getColumns('shipment', Object.keys(data[0]), nav);
            // alert('col loaded');
            setColumns(cols.order);
          }
        }
    
      }, [isPending, isFetching, error, data]);


    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-10 my-4 `}>
        <h1 className="text-lg text-slate-600 font-semibold uppercase">Shipments History</h1>

        <div className={`${borderOn ? 'border border-red-700': ''} h-16 flex flex-row`}>
          <div className={`${borderOn ? 'border border-red-700': ''} basis-9/12 align-middle`}>
          { isPending && `Fetch history for the duration [${range[0]} - ${range[1]}] ...`}
          </div>
          {/* <div className={`${borderOn ? 'border border-red-700': ''} basis-3/12 flex justify-center`}>
            <LinkButton label="Create Production" to={today} nav={nav} showAsButton={true} />
          </div>  */}
        </div>

        {tableData && <div className="pt-4">
            <h4>{data.length} shipment days</h4>
            <Grid
              data={tableData}
              columns={columns}
              search={false}
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
                td: 'min-w-16',
                tr: 'min-w-max'
              }}
            />
        </div>}
    </div>);
}

export default Shipment;