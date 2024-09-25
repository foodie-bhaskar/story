import { FC, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { convertToDayNameFormat, convertISOToISTFormat, formattedDate } from '@/lib/utils';
import { Cache } from "@/App.type";
import { fetchCachesForRange } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Loader from "@/core/Loader";
import Count from '@/core/Count';
import CalendarNavButton from '@/core/CalendarNavButton';
import CollapsibleDiv from '@/core/CollapsibleDiv';
import BatchSummary from "@/components/BatchSummary";
import { useNavigate } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import TransButton from '@/core/TransButton';

const Summary: FC<Cache> = ({ data, payload, createdAt, distinctItems }) => {
    let borderOn = false;
    // borderOn = true;

    const [, time] = convertISOToISTFormat(createdAt).split(',');

    return <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-8 mb-10 items-center`}>
        <div className='w-80 inline-block text-8xl font-bold text-gray-500 text-start align-middle'>
            {time}
        </div>
        
        <Count label='Total Packets' count={data} />

        <Count label='Items' count={distinctItems} />
        
        <Count label='Batches' array={payload} />
    </div>

}

const ProductionDay = () => {
    let { date } = useParams();
    const today = formattedDate();
    let borderOn = false;
    // borderOn = true;

    const nav =  useNavigate();
    const [production, setProduction] = useState<Cache>();
    const [label, setLabel] = useState<string>('Create Batch');

    const { isPending, isFetching, error, data } = useQuery({
        queryKey: ['cache', 'production-date', date],
        queryFn: async () => {
          try {
            if (date) {
                const data = await fetchCachesForRange('production-date', [date]);
                const rows = data.data.result;
                // alert(JSON.stringify(rows));
            
                return rows;
            }
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: Infinity,
        enabled: true
    });

    useEffect(() => {
      if (isFetching) {
        setLabel('Create Batch');
      } else {
        if (error) {
          if (axios.isAxiosError(error)) {
            alert(error.response?.data);
            // if (error.response && error.response.status == 404) {
            // }
          }
        } else if (data) {
          // alert(JSON.stringify(data));
          if (data.length > 0) {
            setLabel('Create Another Batch');
          }
          setProduction(data[0]);
        }
      }
  
    }, [isPending, isFetching, error, data]);

    useEffect(() => {
      window.scrollTo(0, 0)
    }, []);

    // initiallyOpen={production.payload.length == 1 ? true: (i == production.payload.length - 1 ? true: false)}

    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-10 mt-4 min-h-screen overflow-y-scroll`}>
        {date && <>
            <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex items-center`}>
                {convertToDayNameFormat(date)}
                <CalendarNavButton nav={nav} to={`/production`}/>
            </h1>

            {/* <input style={{display: 'hidden' }} type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" /> */}
            
            <div className={`${borderOn ? 'border border-red-700': ''} min-h-96 mb-24`}>
                {isFetching 
                    ? <div className='h-96 text-center align-middle'><Loader /></div>
                    : production 
                      ? <div className="pt-4">
                        <Summary {...production} />
                        {production.payload && production.payload.map((batch) => 
                          <CollapsibleDiv className="mb-8" custom={date} batch={batch} key={batch.batchNo} initiallyOpen={false}>
                            <BatchSummary {...batch} />
                          </CollapsibleDiv>
                        )}
                      </div>
                      : today != date && <div className="pt-4 h-20 flex flex-row gap-6 items-center">
                          <CircleAlert className="w-18 h-18 text-orange-400" />
                          {new Date(date).getTime() < new Date(today).getTime()
                            ?  <span className="text-start text-gray-400 italic font-light text-2xl">
                              No production happened on this day
                            </span>
                            : <span className="text-start text-blue-700 italic font-light text-2xl">
                              This is a future date
                            </span>
                          }
                        </div>
                }
                <div className="">
                  <TransButton showAsButton={true} label={label} update={() => alert('Not ready yet')} />
                </div>
            </div>            
        </>}
        {!date && <h1>Invalid date</h1>}
        
    </div>);
}

export default ProductionDay;