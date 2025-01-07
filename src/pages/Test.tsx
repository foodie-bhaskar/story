import { Query } from '@/App.type';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queryAssets } from '@/queries/query';
import QueryTable from '@/components/QueryTable';

const Test = () => {
    let { assetType } = useParams();
    const nav =  useNavigate();

    const [ query, setQuery ] = useState<Query>();

    useEffect(() => {
        if (assetType) {
            setQuery({
            primary: 'asset',
            type: assetType,
            info: `Querying for assets of type: ${assetType}`,
            queryFn: queryAssets
            });
        }
      }, [assetType])
  
    return (<div className='lg-w-full mx-auto p-20'>
        
        {/* <RangeBox range={{ start: '2024-11-26', end: '2025-01-02'}} onRangeChange={handle} /> */}
      {/* {tableData && columns && <DisplayTable tableData={tableData} cols={columns} />} */}

      {assetType && query && <QueryTable query={query} nav={nav} assetType={assetType} />}
        
    </div>)
}

export default Test;