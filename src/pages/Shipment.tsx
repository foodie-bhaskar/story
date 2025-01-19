import { useState } from 'react';
import { dateRangeTS } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Range } from "@/App.type";
import RangeBox from '@/components/RangeBox';
import PageHeaderRow from '@/core/PageHeaderRow';
import CombinedQueryTable from '@/components/CombinedQueryTable';

const Shipment = () => {
    let borderOn = false;
    // borderOn = true;
    
    const nav =  useNavigate();

    const [ range, setRange ] = useState<Range>(dateRangeTS(7));
    
    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-4 my-4 flex flex-col gap-8`}>
        <PageHeaderRow pageName={'Shipments History'} />
        <RangeBox range={range} onRangeChange={setRange} />
        {range && <CombinedQueryTable type='shipment' range={range} nav={nav} borderOn={borderOn} />}
    </div>);
}

export default Shipment;