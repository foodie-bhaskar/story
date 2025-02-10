import { useEffect, useState, FC } from 'react';
// import { convertDateFormat } from '@/lib/utils';
import { NavigateFunction } from 'react-router-dom';
import { _ } from 'gridjs-react';
// import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
// import { OneDArray } from 'gridjs/dist/src/types.js';
// import { ComponentChild } from 'preact';
// import LinkButton from '@/core/LinkButton';
import { useShipmentQueries, useStorePacketFlowQueries } from '@/hooks/combinedQuery';
import { Range } from '@/App.type';
// import { replaceHashMarks } from '@/lib/utils';
import DisplayTable, { transform, transformConsumableSummary } from '@/components/DisplayTable';
import { MAP } from "@/lib/helper";
import { Row, Mapping } from '@/App.type';
// import { RangeConverter as RC } from '@/lib/utils';
import Loader from '@/core/Loader';

interface CombinedQueryCfg {
  query: Function,
  // range: Range,
  // storeId?: string
}

interface CombinedQueryTableProps {
  type: string,
  // query: Query
  borderOn?: boolean,
  range: Range,
  storeId?: string
  nav: NavigateFunction
  limit?: number,
  processData?: Function
}

const COMBINED_QUERY_FN_MAP: {[key: string]: CombinedQueryCfg} = {
  'shipment': {
    query: useShipmentQueries
  },
  'store-packetflow': {
    query: useStorePacketFlowQueries
  }
}

const CombinedQueryTable: FC<CombinedQueryTableProps> = ({ type, range, storeId, nav, borderOn, limit, processData }) => {
    const [tableData, setTableData] = useState<Row []>();
    const [columns, setColumns] = useState<Mapping>();

    const cFn = COMBINED_QUERY_FN_MAP[type].query;
      
    const { mergedData, isAllQueriesComplete, primary, secondary } = !!storeId ? cFn(storeId, range): cFn(range);
    useEffect(() => {
        if (isAllQueriesComplete && !!mergedData) {
          const { cols, rows } = type == 'store-packetflow'
            ? transformConsumableSummary(type, mergedData, nav, MAP)
            : transform(type, mergedData, nav, MAP);

          setColumns(cols);
          setTableData(rows);
          if (!!processData && typeof processData == 'function') {
            processData(primary.data, secondary.data);
          }
        }
        
      }, [mergedData, isAllQueriesComplete, primary.data, secondary.data]);
  
      return <div className={`${borderOn ? 'border border-red-700': ''} h-16 flex flex-row`}>
            <div className={`${borderOn ? 'border border-red-700': ''} basis-9/12 align-middle`}>
            { !isAllQueriesComplete && `Fetching history for the duration [${range.start} - ${range.end}] ...`}
            </div>
  
         {isAllQueriesComplete && tableData && <div className="pt-4">
            {type != 'store-packetflow' && <h4>{mergedData.length} {type}s</h4>}
            {!isAllQueriesComplete && <Loader />}
  
      {!!tableData && !!columns && <DisplayTable tableData={tableData} cols={columns} limit={limit ? limit : 20} />}
          </div>}
          </div>
  }

export default CombinedQueryTable;