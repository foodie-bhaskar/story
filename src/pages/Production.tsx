import { useEffect, useState } from 'react';
import { dateRangeTS, formattedDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Range, Query } from '@/App.type';
import LinkButton from '@/core/LinkButton';
import PageHeaderRow from '@/core/PageHeaderRow';
import RangeBox from '@/components/RangeBox';
import QueryTable from '@/components/QueryTable';
import { queryProductionDays } from '@/queries/query';

const Production = () => {
  const [borderOn] = useState<boolean>(false);
  const [pageName] = useState<string>('Production History');
  const nav =  useNavigate();
  const today = formattedDate();
  const [ range, setRange ] = useState<Range>(dateRangeTS(7));
  const [ query, setQuery ] = useState<Query>();

  useEffect(() => {
    setQuery({
      primary: 'cache',
      type: 'production-date',
      info: `${range.start} - ${range.end}`,
      range,
      queryFn: queryProductionDays
    });
  }, [range])

    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-4 my-4 flex flex-col gap-8`}>
        
      <PageHeaderRow pageName={pageName} borderOn={borderOn}>
        <LinkButton label="Create Production" to={today} nav={nav} showAsButton={true} />
      </PageHeaderRow>

      <RangeBox range={range} onRangeChange={setRange} />

      {query && <QueryTable query={query} nav={nav} />}
    </div>);
}

export default Production;