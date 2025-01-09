import { useEffect, useState, FC } from 'react';
// import { convertDateFormat } from '@/lib/utils';
import { NavigateFunction } from 'react-router-dom';
import { _ } from 'gridjs-react';
// import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
// import { OneDArray } from 'gridjs/dist/src/types.js';
// import { ComponentChild } from 'preact';
// import LinkButton from '@/core/LinkButton';
import { useShipmentQueries } from '@/hooks/combinedQuery';
import { Range } from '@/App.type';
// import { replaceHashMarks } from '@/lib/utils';
import DisplayTable, { transform } from '@/components/DisplayTable';
import { MAP } from "@/lib/helper";
import { Row, Mapping } from '@/App.type';
// import { RangeConverter as RC } from '@/lib/utils';
import Loader from '@/core/Loader';

interface CombinedQueryTableProps {
  assetType: string,
  // query: Query
  borderOn?: boolean,
  range: Range,
  nav: NavigateFunction
}

const CombinedQueryTable: FC<CombinedQueryTableProps> = ({ assetType, range, nav, borderOn }) => {
    const [tableData, setTableData] = useState<Row []>();
    const [columns, setColumns] = useState<Mapping>();
      
    const { mergedData, isAllQueriesComplete } = useShipmentQueries(range);
    useEffect(() => {
        if (isAllQueriesComplete && !!mergedData) {
          const { cols, rows } = transform(assetType, mergedData, nav, MAP);
          setColumns(cols);
          setTableData(rows);
        }
        
      }, [mergedData, isAllQueriesComplete]);
  
      return <div className={`${borderOn ? 'border border-red-700': ''} h-16 flex flex-row`}>
            <div className={`${borderOn ? 'border border-red-700': ''} basis-9/12 align-middle`}>
            { !isAllQueriesComplete && `Fetching history for the duration [${range.start} - ${range.end}] ...`}
            </div>
  
         {isAllQueriesComplete && tableData && <div className="pt-4">
              <h4>{mergedData.length} shipments</h4>
        {!isAllQueriesComplete && <Loader />}
  
      {!!tableData && !!columns && <DisplayTable tableData={tableData} cols={columns} />}
          </div>}
          </div>
  }

export default CombinedQueryTable;