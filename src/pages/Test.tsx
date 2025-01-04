import { convertDateFormat, convertISOToISTFormat} from '@/lib/utils';
import "gridjs/dist/theme/mermaid.css";
// import "gridjs/dist/theme/mermaid.css";
import LinkButton from '@/core/LinkButton';
// import CircleValue from '@/core/CircleValue';


// import Loader from '@/core/Loader';


import { Row, Cache } from '@/App.type';
// import RangeBox from '@/components/RangeBox';
import { Grid, _ } from 'gridjs-react';
import { OneDArray } from 'gridjs/dist/src/types.js';
import { FC, useEffect, useState } from 'react';
// import { OneDArray } from 'gridjs/dist/src/types.js';
import { ComponentChild } from 'preact';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import CircleValue from '@/core/CircleValue';

type Mapping = {
  order: OneDArray<ComponentChild>
}

const DisplayTable: FC<{ tableData: Row [], cols: Mapping}> = ({ tableData, cols }) => {
  return <Grid
  data={tableData}
  columns={cols.order}
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
    td: 'min-w-14',
    tr: 'min-w-max'
  }}
/>
}

interface GetDataResponse {
  assetType: string;
  result: Cache[];
  count: number;
}

interface TransformResponse {
  cols: Mapping;
  rows: Row [];
}

function getData(): GetDataResponse {
  return {
    "assetType": "CACHE",
    "result": [
        {
            "payload": [
                {
                    "batchNo": 1,
                    "items": [
                        {
                            "itemId": 427,
                            "name": "Donne Chicken Biryani",
                            "qty": 110
                        },
                        {
                            "itemId": 428,
                            "name": "Andhra Chicken Biryani",
                            "qty": 110
                        },
                        {
                            "itemId": 433,
                            "name": "Spicy Boneless Chicken Biryani",
                            "qty": 110
                        },
                        {
                            "itemId": 434,
                            "name": "Special Boneless Chicken Biryani",
                            "qty": 110
                        }
                    ],
                    "batchPackets": 440,
                    "batchTime": "2024-12-25T04:29:29.253Z"
                }
            ],
            "data": 440,
            "distinctItems": 4,
            "updatedAt": "2024-12-25T04:31:00.098Z",
            "isPending": false,
            "createdAt": "2024-12-25T04:29:34.611Z",
            "type": "production-date",
            "group": "2024-12-25"
        },
        {
            "payload": [
                {
                    "batchNo": 1,
                    "items": [
                        {
                            "itemId": 1,
                            "name": "Butter Chicken",
                            "qty": 135
                        },
                        {
                            "itemId": 14,
                            "name": "Kadhai Paneer",
                            "qty": 115
                        },
                        {
                            "itemId": 18,
                            "name": "Chole Masala",
                            "qty": 115
                        },
                        {
                            "itemId": 63,
                            "name": "Dal Makhani",
                            "qty": 90
                        },
                        {
                            "itemId": 70,
                            "name": "Chicken Keema",
                            "qty": 135
                        },
                        {
                            "itemId": 289,
                            "name": "Tomato Pappu",
                            "qty": 115
                        }
                    ],
                    "batchPackets": 705,
                    "batchTime": "2024-12-27T03:46:00.134Z"                    
                }
            ],
            "data": 705,
            "distinctItems": 6,
            "updatedAt": "2024-12-27T03:47:48.755Z",
            "isPending": false,
            "createdAt": "2024-12-27T03:46:03.901Z",
            "type": "production-date",
            "group": "2024-12-27"
        }
    ],
    "count": 7
  }
}


//  return appropriate cell based on id and assetType/cacheType

interface CellDisplay {
  name: string,
  id: string,
  sort?: boolean,
  formatter: Function
}

const VALID_FMT_TYPES = {
  LINK: 'link',
  COUNT: 'count',
  ALERT_COUNT: 'alertCount',
  DATETIME: 'dateTime',
  STATUS: 'status'
}

const VALUE_TYPES = {
  DATE: 'date',
  NUMBER: 'number',
  TYPE: 'type'
}

function formatterFn(formatType: string, valueType: string, nav: NavigateFunction): Function {

  const {
    LINK, COUNT, ALERT_COUNT, DATETIME, STATUS
  } = VALID_FMT_TYPES

  if (LINK == formatType) {
    const labelFn = VALUE_TYPES.DATE == valueType ? convertDateFormat: (cell: string) => cell;

    if (!!nav) {
      const fn: Function = (cell: string) => _(<div className="flex justify-center">                  
        <LinkButton label={labelFn(cell)} to={cell} nav={nav} />
      </div>)

      return fn;

    } else {
      throw new Error('NavigateFunction argument is required for [link]');
    }
  } else if (ALERT_COUNT == formatType) {
    const fn: Function = (cell: number) =>  _(<div className="flex justify-center">
      {cell == 1 
        ? <span className="font-light text-gray-500">1</span> 
        : <CircleValue value={`${cell}`} />
      }
      </div> 
    )

    return fn;

  } else if (COUNT == formatType) {
    const fn: Function = (cell: number) => _(
      <div className="text-center">
        <div className="font-light text-gray-500">{cell}</div>
      </div>
    )

    return fn;
  } else if (DATETIME == formatType) {
    const fn: Function = (cell: string) => _(
      <div className="text-center">
        <div className="font-light italic text-gray-500">
          {convertISOToISTFormat(cell)}
        </div>
      </div>
    )

    return fn;
  } else if (STATUS == formatType) {
    const fn: Function = (cell: string) => _(
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
    return fn;
  }

  throw new Error('Unimplemented');
}

type Group = {
  [key: string]: string
}

type Asset = {
  [key: string]: Group
}

/*
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
            }
*/
const MAP: { [key: string]: Asset} = {
  'production-date': {
    'group': {
      name: 'Production Date',
      formatType: VALID_FMT_TYPES.LINK,
      valueType: VALUE_TYPES.DATE
    },
    'payload': {
      name: 'Batches',
      formatType: VALID_FMT_TYPES.ALERT_COUNT,
      valueType: VALUE_TYPES.NUMBER    
    },
    'data': {
      name: 'Packets',
      formatType: VALID_FMT_TYPES.COUNT,
      valueType: VALUE_TYPES.NUMBER
    },
    'distinctItems': {
      name: 'Items',
      formatType: VALID_FMT_TYPES.COUNT,
      valueType: VALUE_TYPES.NUMBER
    },
    'createdAt': {
      name: 'Uploaded At',
      formatType: VALID_FMT_TYPES.DATETIME,
      valueType: VALUE_TYPES.DATE
    },
    'updatedAt': {
      name: 'Updated At',
      formatType: VALID_FMT_TYPES.DATETIME,
      valueType: VALUE_TYPES.DATE
    },
    'isPending': {
      name: 'Status',
      formatType: VALID_FMT_TYPES.STATUS,
      valueType: VALUE_TYPES.TYPE
    }
  }
}

function displayCol(assetType: string, columnId: string, nav: NavigateFunction,): CellDisplay {
  if (!!MAP[assetType]) {
    const asset = MAP[assetType];

    if (!!asset[columnId]) {

      const { name, formatType, valueType } = asset[columnId];

      try {
        const fn: Function = formatterFn(formatType, valueType, nav);
          return {
            formatter: fn,
            id: columnId,
            name
          }
      } catch (e) {
        throw e
      }
    } else {
      throw new Error(`No defination available for this column id: ${columnId}`);
    }

  } else {
    throw new Error(`No defination available for this asset type: ${assetType}`);
  }
}

function getMappings(cacheType: string, nav: NavigateFunction): Mapping {
  switch (cacheType) {
    case 'production-date': 
      let mappings: any = [];
      try {

        const cols = MAP[cacheType];
        const order: CellDisplay[] = Object.keys(cols).map(c => {
          return displayCol(cacheType, c, nav)
        });
        mappings = {
          order
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

function transform(assetType: string, data: Cache[], nav: NavigateFunction): TransformResponse {
  const [first, ] = data;
  const { type } = first;

  console.log('assetType', assetType);

  let cols: Mapping = getMappings(type, nav);
  
  const rows: Row[] = data.map((d: Cache) => {
    const row: Row = Object.entries(d).reduce((acc: Row, entry) => {
      const key = entry[0];
      let value = typeof entry[1] === 'string' || typeof entry[1] === 'number' ? entry[1]: 'N/A';

      if (entry[1] instanceof Array) {
        value = entry[1].length;
      }

      acc[key] = value;
      return acc;
    }, {});

    return row;
  });

  return {
    cols,
    rows
  }
}

const Test = () => {
  const nav =  useNavigate();

   const [tableData, setTableData] = useState<Row []>();
   const [columns, setColumns] = useState<Mapping>();
  
    useEffect(() => {

      const { assetType, result } = getData();
      const { cols, rows } = transform(assetType, result, nav);
      setColumns(cols);
      setTableData(rows);
    }, []);
  
    return (<div className='lg-w-full mx-auto p-20'>
        
        {/* <RangeBox range={{ start: '2024-11-26', end: '2025-01-02'}} onRangeChange={handle} /> */}
      {tableData && columns && <DisplayTable tableData={tableData} cols={columns}/>}
        
    </div>)
}

export default Test;