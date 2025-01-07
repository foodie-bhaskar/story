import { useEffect, useState, FC } from 'react';
import { RangeConverter as RC } from '@/lib/utils';
import { QueryFunction, useQuery, UseQueryResult } from '@tanstack/react-query';
import { NavigateFunction } from 'react-router-dom';
import axios from 'axios';
import { _ } from 'gridjs-react';
// import "gridjs/dist/theme/mermaid.css";
import { Cache, Query, Row, Mapping, AssetRow } from '@/App.type';
import { MAP } from "@/lib/helper";
import DisplayTable, { transform } from '@/components/DisplayTable';
import Loader from '@/core/Loader';
  
interface QueryTableProps {
  assetType: string,
  query: Query
  borderOn?: boolean,
  allowSearch?: boolean,
  nav: NavigateFunction
}
  
const QueryTable: FC<QueryTableProps> = ({ assetType, query, borderOn, nav }) => {
  const [tableData, setTableData] = useState<Row []>();
  const [columns, setColumns] = useState<Mapping>();

    const qFn: QueryFunction = query.queryFn;

    /* setQuery({
      primary: 'asset',
      type: assetType,
      info: `Querying for assets of type: ${assetType}`,
      queryFn: queryAssets
    }); */
  
    const apiQuery: UseQueryResult<Cache [] | AssetRow[]> = useQuery({
      queryKey: [query.primary, query.type, ...[query.range && RC.toString(query.range)]],
      queryFn: qFn,
      staleTime: Infinity,
      enabled: true
    });
  
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
          const { cols, rows } = transform(assetType, apiQuery.data, nav, MAP);
          setColumns(cols);
          setTableData(rows);
        }
      } 
  
    }, [apiQuery.isPending, apiQuery.isFetching, apiQuery.error, apiQuery.data]);
  
    return <div className={`${borderOn ? 'border border-red-700': ''} my-4 flex flex-col gap-8`}>
      {!apiQuery.isFetching && !apiQuery.data && <h4>{query.info} fetching ... </h4>}
  
      {apiQuery.isFetching && <Loader />}
      {apiQuery.error && <p>Error: {JSON.stringify(apiQuery.error.message)}</p>}
  
      {apiQuery.isSuccess && !!apiQuery.data && !!tableData && columns && <DisplayTable tableData={tableData} cols={columns} />}
    </div>
}

export default QueryTable;
