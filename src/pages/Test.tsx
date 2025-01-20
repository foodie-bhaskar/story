import { useParams } from 'react-router-dom';
import AssetDropdown from '@/components/AssetDropdown';
import { useEffect, useState } from 'react';

const Test = () => {
    let { assetType } = useParams();

    const [storeId, setStoreId] = useState();

    useEffect(() => {
      if (!!storeId) {
        alert(`Store is set: ${storeId}`);
      }
    }, [storeId]);
  
  
    return (<div className='lg-w-full mx-auto p-20'>
      {assetType && <AssetDropdown assetType={assetType} onSelect={setStoreId} />}
        
        
    </div>)
}

export default Test;