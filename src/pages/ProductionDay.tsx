import { FC, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { convertToDayNameFormat, convertISOToISTFormat } from '@/lib/utils';
import { Cache } from "@/App.type";
import { fetchCachesForRange } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Loader from "@/core/Loader";
import Count from '@/core/Count';
import CollapsibleDiv from '@/core/CollapsibleDiv';
import BatchSummary from "@/components/BatchSummary";

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
    let borderOn = false;
    // borderOn = true;

    const [production, setProduction] = useState<Cache>();

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
      } else {
        if (error) {
          if (axios.isAxiosError(error)) {
            alert(error.response?.data);
            // if (error.response && error.response.status == 404) {
            // }
          }
        } else if (data) {
          // alert(JSON.stringify(data));
          setProduction(data[0]);
        }
      }
  
    }, [isPending, isFetching, error, data]);

    useEffect(() => {
      window.scrollTo(0, 0)
    }, []);

    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-10 mt-4 min-h-screen overflow-y-scroll`}>
        {date && <>
            <h1 className="text-lg text-slate-600 font-semibold uppercase">
                {convertToDayNameFormat(date)}
            </h1>
            
            <div className={`${borderOn ? 'border border-red-700': ''} min-h-96 mb-24`}>
                {isFetching 
                    ? <div className='h-96 text-center align-middle'><Loader /></div>
                    : production && <div className="pt-4">
                        <Summary {...production} />
                        {production.payload && production.payload.map((batch, i) => 
                          
                          <CollapsibleDiv className="mb-8" custom={date} info={[
                            `Batch # ${batch.batchNo}`,
                            batch.batchTime,
                            `Items: ${batch.items.length}`,
                            batch.batchPackets? `Packets: ${batch.batchPackets}`: ``
                          ]} key={batch.batchNo} 
                            initiallyOpen={production.payload.length == 1 ? true: (i == production.payload.length - 1 ? true: false)}>
                            <BatchSummary {...batch} />
                          </CollapsibleDiv>
                        )}
                      </div>
                }
            </div>
        </>}
        {!date && <h1>Invalid date</h1>}
        
    </div>);
}

export default ProductionDay;