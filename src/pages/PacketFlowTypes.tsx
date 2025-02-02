import { useState, FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Mapping, Range, Row } from '@/App.type';
import { dateRangeTS } from '@/lib/utils';

import RangeBox from '@/components/RangeBox';

import { useOverallFlowQueries } from '@/hooks/combinedQuery';
import Count from '@/core/Count';
import DisplayTable, { transformSummary } from '@/components/DisplayTable';
import { MAP } from '@/lib/helper';
import Loader from '@/core/Loader';

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

    const [tableData, setTableData] = useState<Row []>();
    const [columns, setColumns] = useState<Mapping>();

    const nav =  useNavigate();

    if (!flowType) {
        flowType = TABS[0].toLowerCase();
    }
    
    const [ range, setRange ] = useState<Range>(dateRangeTS(14));
    const [ flowNet, setFlowNet] = useState<number>();

    // const [summary, setSummary] = useState<number []>();

    const cFn = COMBINED_QUERY_FN_MAP[flowType].query;

    let { mergedData, isAllQueriesComplete, primary, secondary } = cFn(range);

    /* function process(a: any, b: any) {
        setSummary([ a.total, b.count, b.count - a.total])
    } */

    function changeTab(tabName: string) {
        // alert(`Tab Name: ${tabName}`);
        //TODO: remove till its developed
        if (tabName.toLowerCase() == TABS[0].toLowerCase()) {
            nav(`/test/${tabName.toLowerCase()}`)
        } else {
            alert('Not implemented yet')
        }

    }

    useEffect(() => {
        if (isAllQueriesComplete && !!mergedData && !!flowType && !!secondary.data && !!primary.data) {
          const { cols, rows } = transformSummary(flowType, mergedData, nav, MAP)

          setColumns(cols);
          setTableData(rows);

          setFlowNet(primary.data.total - secondary.data.total);
          
        }
        
      }, [mergedData, isAllQueriesComplete, primary.data, secondary.data]);

    return (<div className={`${borderOn ? 'border border-red-700': ''}
     w-full overflow-y-scroll min-h-screen p-4
     flex flex-col gap-8
     `}>
        <TabBar selected={flowType} tabs={TABS} onSelect={changeTab} borderOn={borderOn} />
        
        <div className='flex flex-row justify-between min-h-32 gap-20'>
            <div className='items-center flex flex-row justify-start min-h-16 gap-10'>
                <Count label='Packets Produced' count={primary.data?.total} isLoading={primary.isPending} />  
                <Count label='Consumed Packets' count={secondary.data?.total} isLoading={secondary.isPending} />  
                <Count label='Net Excess' count={flowNet} isLoading={secondary.isPending} />  
            </div>
        </div>

        <RangeBox range={range} onRangeChange={setRange} />

        <div className={`${borderOn ? 'border border-red-700': ''} h-16 flex flex-row`}>
            <div className={`${borderOn ? 'border border-red-700': ''} basis-9/12 align-middle`}>
            { !isAllQueriesComplete && `Fetching history for the duration [${range.start} - ${range.end}] ...`}
            </div>

            {!isAllQueriesComplete && <Loader />}
  
            {isAllQueriesComplete && tableData && <div className="pt-4">
                {/* <h4>{mergedData.length} {flowType}s</h4> */}
                
  
                {!!tableData && !!columns && <DisplayTable tableData={tableData} cols={columns} limit={120} />}
          </div>}
        </div>
        
    </div>);
}

export default PacketFlowTypes;