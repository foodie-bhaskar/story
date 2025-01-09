import { useEffect, useState } from 'react';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';
import { Query } from '@/App.type';
import { queryAssets } from '@/queries/query';
import QueryTable from '@/components/QueryTable';

const Items = () => {
  let { assetType } = useParams();
  const nav: NavigateFunction =  useNavigate();

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

  return (<div className='lg-w-full p-2'>
    <div className='mt-4'>
      <h1 className="text-lg text-slate-600 font-semibold uppercase">{assetType}</h1>
    </div>
    
    {assetType && query && <QueryTable query={query} nav={nav} assetType={assetType} />}
    
  </div>);
}

export default Items;