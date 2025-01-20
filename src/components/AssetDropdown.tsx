import { Option, AssetRow } from '@/App.type';
import { FC, useEffect, useState } from 'react';
import { queryAssets } from '@/queries/query';
import Dropdown from '@/core/Dropdown';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

const AssetDropdown: FC<{ assetType: string, onSelect: Function }> = ({ assetType, onSelect }) => {
  const [ data, setData ] = useState<Option[]>();

  const apiQuery: UseQueryResult<AssetRow[]> = useQuery({
    queryKey: ['asset', assetType],
    queryFn: queryAssets,
    staleTime: Infinity,
    enabled: true
  });

  useEffect(() => {
    if (apiQuery.data) {
      const options: Option[] = apiQuery.data.map(row => {
        const option: Option = {
          name: row.name || `${row.assetType} - ${row.assetId}`,
          value: row.assetId
        }

        return option;
      });

      setData(options);
    } else {
        setData(undefined)
    }

  }, [apiQuery.data])

  return <div>
    {apiQuery.isFetching 
      ? `Loading ${assetType}(s)...`: 
      !!data ? <Dropdown options={data}  
        selectedCallback={(valObj: Option) => onSelect(valObj.value)} 
        name='Store'
      />: <></>
    }
  </div>
}

export default AssetDropdown;