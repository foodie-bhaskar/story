import { useState, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Range } from '@/App.type';
import { dateRangeTS } from '@/lib/utils';

import RangeBox from '@/components/RangeBox';

import { useOverallFlowQueries } from '@/hooks/combinedQuery';

type TabButtonProps = {
    label: string,
    selected?: boolean,
    onSelect: Function
}

const TabButton: FC<TabButtonProps> = ({ label, selected, onSelect }) => {
    const themeClass = !selected 
        ? 'text-indigo-500  bg-indigo-50 hover:bg-indigo-100'
        : 'text-indigo-50 bg-indigo-500 hover:bg-indigo-700';
    
    return !selected 
        ? <button 
            type='button' 
            onClick={() => onSelect(label)}
            className={`py-2.5 px-16 text-sm rounded-t uppercase h-10 border-b border-indigo-500
                cursor-pointer transition-all duration-500 ${themeClass}
                    font-light text-center shadow-xs hover:font-semibold hover:border-b-4`}>
                {label}
            </button>
        : <div 
            className={`py-2 px-16 text-sm uppercase font-semibold text-center shadow-xs bg-white  rounded-t
                 text-indigo-500 border-b-4 border-indigo-500`}>
            {label}
        </div>;
}

interface TabBarProps {
    selected?: string,
    tabs: string[]
    onSelect: Function,
    borderOn?: boolean
}

const TabBar: FC<TabBarProps> = ({ selected, tabs, onSelect, borderOn }) => {
    return (<div className={`${borderOn ? 'border border-red-700': ''}
    w-full flex flex-row gap-4 justify-start pt-2    `}>
        {tabs.map(tb => <div onClick={() => onSelect(tb)} >
        <TabButton label={tb} selected={tb.toLowerCase() == selected} onSelect={onSelect} />
    </div>)}
    </div>)
}

interface CombinedQueryCfg {
    query: Function,
    // range: Range,
    // storeId?: string
  }
  const COMBINED_QUERY_FN_MAP: {[key: string]: CombinedQueryCfg} = {
    'overall': {
      query: useOverallFlowQueries
    }
  }

const PacketFlowTypes = () => {
    let borderOn = false;
    // borderOn = true;

    let { flowType } = useParams();

    const TABS: string[] = ['Overall', 'Warehouse', 'Stores'];

    const nav =  useNavigate();

    if (!flowType) {
        flowType = TABS[0].toLowerCase();
    }
    

    const [ range, setRange ] = useState<Range>(dateRangeTS(14));

    // const [summary, setSummary] = useState<number []>();

    const cFn = COMBINED_QUERY_FN_MAP[flowType].query;

    let { mergedData, isAllQueriesComplete, primary, secondary } = cFn(range);

    /* function process(a: any, b: any) {
        setSummary([ a.total, b.count, b.count - a.total])
    } */

    function changeTab(tabName: string) {
        // alert(`Tab Name: ${tabName}`);
        nav(`/test/${tabName.toLowerCase()}`)

    }

    return (<div className={`${borderOn ? 'border border-red-700': ''}
     w-full overflow-y-scroll min-h-screen p-4
     flex flex-col gap-4
     `}>
        <TabBar selected={flowType} tabs={TABS} onSelect={changeTab} borderOn={borderOn} />
        {/* <TabBar tabs={TABS} onSelect={changeTab} borderOn={borderOn} /> */}

       {/*  <div className='flex flex-row justify-between min-h-32 gap-20'>
            <AssetDropdown assetType='store' onSelect={setStoreId} />

            {summary && <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
                <Count label='Shipped Packets' count={summary[1]}  />  
                <Count label='Consumed Packets' count={summary[0]}/>
                <Count label='Net' count={summary[2]}/>
            </div>}
        </div> */}

        <RangeBox range={range} onRangeChange={setRange} />
      
        {/* {storeId && range && 
            <CombinedQueryTable type='store-packetflow' range={range} nav={nav} borderOn={borderOn} 
                storeId={storeId} limit={100} processData={process} />
        } */}
        
    </div>);
}

export default PacketFlowTypes;