import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Range } from '@/App.type';
import { dateRangeTS } from '@/lib/utils';

import CombinedQueryTable from '@/components/CombinedQueryTable';
import RangeBox from '@/components/RangeBox';
import AssetDropdown from '@/components/AssetDropdown';
import Count from '@/core/Count';

const Packetflow = () => {
    let { storeId } = useParams();    
    let borderOn = false;
    // borderOn = true;

    const nav =  useNavigate();
    // const [storeId, setStoreId] = useState();

    const [ range, setRange ] = useState<Range>(dateRangeTS(14));

    const [summary, setSummary] = useState<number []>();

    function process(a: any, b: any) {
        setSummary([ a.total, b.count, b.count - a.total])
    }

    return (<div className={`${borderOn ? 'border border-red-700': ''}
     w-full overflow-y-scroll min-h-screen p-4
     flex flex-col gap-4
     `}>
        <div className='flex flex-row justify-between min-h-32 gap-20'>
            <AssetDropdown assetType='store' onSelect={(id: string) => nav(`/store-inventory/${id}`)}  assetId={storeId} />

            {summary && <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
                <Count label='Shipped Packets' count={summary[1]}  />  
                <Count label='Consumed Packets' count={summary[0]}/>
                <Count label='Net' count={summary[2]}/>
            </div>}
        </div>

        <RangeBox range={range} onRangeChange={setRange} />
      
        {storeId && range && 
            <CombinedQueryTable type='store-packetflow' range={range} nav={nav} borderOn={borderOn} 
                storeId={storeId} limit={100} processData={process} />
        }
        
    </div>);
}

export default Packetflow;