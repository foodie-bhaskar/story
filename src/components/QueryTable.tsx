import { useEffect, useState, FC } from 'react';
import { RangeConverter as RC } from '@/lib/utils';
import { QueryFunction, useQuery, UseQueryResult } from '@tanstack/react-query';
import { NavigateFunction } from 'react-router-dom';
import axios from 'axios';
import { _ } from 'gridjs-react';
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

    const { primary, type, range } = query;

    const queryKey = [
      primary,
      type
    ];

    if (range) {
      queryKey.push(RC.toString(range))
    }

    const apiQuery: UseQueryResult<Cache [] | AssetRow[]> = useQuery({
      queryKey,
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
          // alert(JSON.stringify(apiQuery.data.length));
          const { cols, rows } = transform(assetType, apiQuery.data, nav, MAP);
          setColumns(cols);
          setTableData(rows);
        }
      } 
  
    }, [apiQuery.isPending, apiQuery.isFetching, apiQuery.error, apiQuery.data]);
  
    return <div className={`${borderOn ? 'border border-red-700': ''} flex flex-col min-h-48 min-w-96 items-center justify-around`}>
      {!apiQuery.isFetching && !apiQuery.data && <h4>{query.info} fetching ... </h4>}
  
      {apiQuery.isFetching && <Loader />}
      {apiQuery.error && <p>Error: {JSON.stringify(apiQuery.error.message)}</p>}
  
      {apiQuery.isSuccess && !!apiQuery.data && !!tableData && columns && <DisplayTable tableData={tableData} cols={columns} />}
    </div>
}

export default QueryTable;
