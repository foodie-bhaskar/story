import { FC } from 'react';
import { NavigateFunction } from 'react-router-dom';
import "gridjs/dist/theme/mermaid.css";
import LinkButton from '@/core/LinkButton';
import { convertDateFormat, convertISOToISTFormat, capitalizeWords } from '@/lib/utils';
import { Row, Mapping, Cache, Asset, AssetRow, Weight, Option, Field } from '@/App.type';
import { Grid, _ } from 'gridjs-react';
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

  
function formatterFn(assetType: string, formatType: string, valueType: string, nav: NavigateFunction): Function {

  const {
    LINK, COUNT, ALERT_COUNT, DATETIME, STATUS, PLAIN, CAPITALIZE,
    FLAG, BINARY_STATUS, DYNA_LINK
  } = VALID_FMT_TYPES;

  const { LINK_VIEW, EDIT_LINK } = VALUE_TYPES;

  if (LINK == formatType) {
    const labelFn = (cell: string) => {

      if ([LINK_VIEW, EDIT_LINK].includes(valueType)) {
        return LINK_VIEW == valueType ? cell: 'EDIT';

      } else if (VALUE_TYPES.DATE == valueType) {
        return convertDateFormat(cell)

      } else {
        return cell;
      }
    }

    const linkToVal = (cell: string) => {
      if ([LINK_VIEW, EDIT_LINK].includes(valueType)) {
        return LINK_VIEW == valueType ? `/view-asset/${assetType}/${cell}` : `/edit-asset/${assetType}/${cell}` ;

      } else {
        return cell;
      }
    }

    if (!!nav) {
      const fn: Function = (cell: string) => _(<div className="flex justify-center">                  
        <LinkButton label={labelFn(cell)} to={linkToVal(cell)} nav={nav} />
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

  } else if (PLAIN == formatType) {
    const fn: Function = (cell: string) => _(
      <div className="text-center">{cell}</div>
    )
    return fn;
  } else if (CAPITALIZE == formatType) {
    const fn: Function = (cell: string) => _(
      <div className="text-center">{capitalizeWords(cell)}</div>
    )
    return fn;

  } else if (FLAG == formatType) {
    const fn: Function = (cell: boolean) => _(
      <div className="text-center">{cell ? 'Yes': 'NO '}</div>
    )
    return fn;

  } else if (BINARY_STATUS == formatType) {
    const fn: Function = (cell: boolean) => _(
      <div className="text-center">{cell ? 'Veg': 'NON-VEG'}</div>
    )
    return fn;

  } else if (DYNA_LINK == formatType) {

    const linkToVal = (cell: string) => {
      return `/${assetType}-${valueType}/${cell}`;
    }

    if (!!nav) {
      const fn: Function = (cell: string) => _(<div className="flex justify-center">                  
        <LinkButton label={valueType} to={linkToVal(cell)} nav={nav} />
      </div>)

      return fn;

    } else {
      throw new Error('NavigateFunction argument is required for [link]');
    }
  }

  throw new Error('Unimplemented');
}


function displayCol(assetType: string, columnId: string, nav: NavigateFunction, map: CellConfig): CellDisplay {
    if (!!map[assetType]) {
      const asset = map[assetType];
  
      if (!!asset[columnId]) {
  
        const { name, formatType, valueType } = asset[columnId];
  
        try {
          const fn: Function = formatterFn(assetType, formatType, valueType, nav);
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

function getMappings(mappingType: string, nav: NavigateFunction, map: CellConfig): Mapping {
   let mappings: any = [];
    try {

        const cols = map[mappingType];
        const order: CellDisplay[] = Object.keys(cols).map(c => {
        return displayCol(mappingType, c, nav, map)
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
export function transform(assetType: string, data: Cache[] | AssetRow[], nav: NavigateFunction, map: CellConfig): TransformResponse {
  const [first] = data;
  
  // Type guard function
  function isAssetRow(item: Cache | AssetRow): item is AssetRow {
    return 'assetType' in item && 'assetId' in item && 'createdAt' in item;
  }

  function isOption(value: any): value is Option {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'value' in value &&
        typeof value.name === 'string' &&
        typeof value.value === 'string'
    );
  }

  function isField(value: any): value is Field {
    return (
        typeof value === 'object' &&
        value !== null &&
        'field' in value &&
        'value' in value &&
        typeof value.field === 'string' &&
        typeof value.value === 'string'
    );
  }


  let mappingType;

  // Check if first item is AssetRow
  if (isAssetRow(first)) {
    mappingType = first.assetType;
    // ... rest of the code for AssetRow case
  } else {
    const { type } = first;
    mappingType = type;
    
  }

  // alert(`mapping type: ${mappingType}`)
  
    console.log('assetType', assetType);
    // alert(`assetType type: ${assetType}`)


    let cols: Mapping = getMappings(mappingType.toLowerCase(), nav, map);
    
    const rows: Row[] = data.map((d: any) => {
      const row: Row = Object.entries(d).reduce((acc: Row, entry) => {
        const [key, value] = entry;

        if (['string', 'number', 'boolean'].includes(typeof value)) {
          acc[key] = value as string | number | boolean;
        
        } else {
          if (key == 'weight') {
            // alert(value);
            const { total } = value as Weight;
            acc[key] = `${total}`;

            // alert(total);
          
          } else if (value instanceof Array) {
            
            const [first] = value;

            if (first) {
            
              if (isOption(first) || isField(first)) {
                // alert(`Array: ${key} - ${JSON.stringify(first)}`);
                (value as Option[] | Field[]).forEach(o => {

                  if (isOption(o)) {
                    // alert(`Option: ${o.name} - ${o.value}`);
                    acc[o.name] = o.value;
                  
                  } else {
                    acc[o.field] = o.value;
                  }
                  
                });
              } else {
                // alert(JSON.stringify(first))
                acc[key] = `${value.length}`;
              }
            }

            // alert(JSON.stringify(value.map(v => v.name)))
        
          }
        }
        // alert(JSON.stringify(acc))
        return acc;
      }, {});
      
  
      return { 
        ...row, 
        ...(!!row['assetId'] && { 'editId': row['assetId'] }),
        ...(!!row['assetId'] && assetType == 'store' && { 'dynaLink': row['assetId'] })
      };
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
        width: '80%'
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