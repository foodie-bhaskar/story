
import "gridjs/dist/theme/mermaid.css";
import LinkButton from '@/core/LinkButton';
import { convertDateFormat, convertISOToISTFormat} from '@/lib/utils';

import { Row, Mapping, Cache, Asset } from '@/App.type';
import { Grid, _ } from 'gridjs-react';
import { FC } from 'react';
import { NavigateFunction } from 'react-router-dom';
import CircleValue from '@/core/CircleValue';
import { VALID_FMT_TYPES, VALUE_TYPES } from "@/lib/helper";

interface TransformResponse {
    cols: Mapping;
    rows: Row [];
}

interface CellDisplay {
    name: string,
    id: string,
    sort?: boolean,
    formatter: Function
}

type CellConfig = { 
    [key: string]: Asset
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
    const fn: Function = (cell: boolean) => _(
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


function displayCol(assetType: string, columnId: string, nav: NavigateFunction, map: CellConfig): CellDisplay {
    if (!!map[assetType]) {
      const asset = map[assetType];
  
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

function getMappings(cacheType: string, nav: NavigateFunction, map: CellConfig): Mapping {
   let mappings: any = [];
    try {

        const cols = map[cacheType];
        const order: CellDisplay[] = Object.keys(cols).map(c => {
        return displayCol(cacheType, c, nav, map)
        });
        mappings = {
        order
        }  
    } catch (e) {
        alert(JSON.stringify(e));
    }
    return mappings;
      
}

/*
 * Transforms api response to row data
 */
export function transform(assetType: string, data: Cache[], nav: NavigateFunction, map: CellConfig): TransformResponse {
    const [first, ] = data;
    const { type } = first;
  
    console.log('assetType', assetType);
  
    let cols: Mapping = getMappings(type, nav, map);
    
    const rows: Row[] = data.map((d: Cache) => {
      const row: Row = Object.entries(d).reduce((acc: Row, entry) => {
        const key = entry[0];
        let value = typeof entry[1] === 'string' || typeof entry[1] === 'number' || typeof entry[1] === 'boolean'? entry[1]: 'N/A';
  
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

export default DisplayTable;