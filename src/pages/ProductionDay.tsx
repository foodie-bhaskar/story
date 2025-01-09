import { FC, useEffect, useState, useRef } from "react";
import { NavigateFunction, useParams } from 'react-router-dom';
import { convertToDayNameFormat, convertISOToISTFormat, formattedDate } from '@/lib/utils';
import { Cache, ProductionBatchCache, APIResult } from "@/App.type";
import { fetchCachesForRange } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Loader from "@/core/Loader";
import Count from '@/core/Count';
import CalendarNavButton from '@/core/CalendarNavButton';
import CollapsibleDiv from '@/core/CollapsibleDiv';
import BatchSummary from "@/components/BatchSummary";
import ProductionBatchForm from "@/components/ProductionBatchForm";
import { useNavigate } from 'react-router-dom';
import { CircleAlert, CloudUpload } from 'lucide-react';
import TransButton from '@/core/TransButton';
import FormHeader from "@/components/FormHeader";
import { createAsset, updateAsset } from '../api/api';

interface SummaryProps {
  cache: Cache,
  nav: NavigateFunction,
  date: string
}

const Summary: FC<SummaryProps> = ({ date, cache, nav }) => {
    let borderOn = false;
    // borderOn = true;

    const { data, payload, createdAt, distinctItems } = cache;

    const [, time] = convertISOToISTFormat(createdAt).split(',');

    return <div className={`${borderOn ? 'border border-red-700': ''} flex flex-row gap-8 mb-10`}>
        <div className='flex flex-col justify-evenly min-h-max'>
          <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex items-center`}>
              {convertToDayNameFormat(date)}
              <CalendarNavButton nav={nav} to={`/production`}/>
          </h1>
          <span className="w-80 inline-block text-8xl font-bold text-gray-500 text-start align-middle">{time}</span>
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
    const [showForm, setShowForm] = useState<boolean>(false);
    const [batch, setBatch] = useState<ProductionBatchCache | undefined>();
    const [savedBatch, setSavedBatch] = useState<ProductionBatchCache | undefined>();
    const [newBatchNo, setNewBatchNo] = useState<number>(1);
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const [mutationResult, setMutationResult] = useState<APIResult>();

    const prevDateRef = useRef<string | null>(null);

    const dayQuery = useQuery({
        queryKey: ['cache', 'production-date', date],
        queryFn: async () => {
          try {
            if (date) {
                const data = await fetchCachesForRange('production-date', [date]);
                // alert(JSON.stringify(data.data));
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
        enabled: true,
        refetchInterval: 1000 * 60
    });

    const mutation = useMutation({
      mutationFn: async (batchItem: ProductionBatchCache) => {
          try {
            let day = {
              type: 'production-date',
              group: date || (new Date()).toISOString().split('T')[0],
              data: batchItem.batchPackets,
              distinctItems: batchItem.items.length,
              isPending: true,
              createdAt: (new Date()).toISOString(),
              payload: [batchItem]
            }

            const response = !production 
              ? await createAsset('cache', day, `production-date_${date}`)
              : await updateAsset('cache', `production-date_${date}`, day);

            return response.data;
          } catch (err) {
              const error = err as AxiosError;
              throw error;
          }
      },
      onSuccess: (data, variables, context) => {
          console.log(data, variables);
          console.log('context', context)
          // Query Invalidation (Recommended)
        
          
  
        // Or, if you prefer, you can update the cache directly
        // queryClient.setQueryData(['posts'], (oldData: any) => [...oldData, data]);
        setMutationResult({ done: true });
      },
      onError: (error, variables, context) => {
          console.log('variables', variables);
          console.log('context', context)
          // Handle errors, e.g., display an error message to the user
          console.error('Error creating post:', error);
          // alert(JSON.stringify(error));
        // You can also use `context` to rollback optimistic updates if needed
        setMutationResult({
          done: true,
          error: JSON.stringify(error)
        });
      },
    });

    const update = async (assetItem: ProductionBatchCache) => {
      // refresh this  queryKey: ['cache', 'production-date', date],
      // queryClient.invalidateQueries({ queryKey: ['cache', 'production-date', date] })
      // await mutation.mutateAsync(assetItem);
      setBatch(assetItem);
      setShowForm(false);
    }

    const upload = async () => {
      // alert(`Uploading: [${JSON.stringify(batch)}]`);
      // https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-asset?assetType=CACHE&id=production-date_2024-10-08

      if (batch) {
        await mutation.mutateAsync(batch);
        // alert(`Success : ${JSON.stringify(resp.result)}`);
        queryClient.invalidateQueries({ queryKey: ['cache', 'production-date', date] });
        setSavedBatch(undefined);
        setBatch(undefined);
        setShowForm(false);
      }
    }

    const undo = () => {
      setSavedBatch(batch);
      setBatch(undefined);
      setShowForm(true);
    }

    const clear = () => {
      setSavedBatch(undefined);
      setBatch(undefined);
      setProduction(undefined);
    }


    useEffect(() => {
      if (dayQuery.isFetching) {
        setLabel('Create Batch');
      } else {
        if (dayQuery.error) {
          if (axios.isAxiosError(dayQuery.error)) {
            // alert(error.response?.data);
            // if (error.response && error.response.status == 404) {
            // }
          }
        } else if (dayQuery.data) {
          // alert(JSON.stringify(data));
          if (dayQuery.data.length > 0) {
            setLabel('Create Another Batch');
            setProduction(dayQuery.data[0]);
            setNewBatchNo(dayQuery.data[0].payload.length + 1);
          }
        }
      }
  
    }, [dayQuery.isPending, dayQuery.isFetching, dayQuery.error, dayQuery.data]);

    useEffect(() => {
      if (mutationResult && mutationResult.done) {
        setIsLoading(false);

        if (mutationResult.error) {
          undo();
        }
      }
    }, [mutationResult])

    useEffect(() => {
      window.scrollTo(0, 0)
    }, []);

    useEffect(() => {
      if (date && prevDateRef.current !== date) {
        queryClient.invalidateQueries({ queryKey: ['cache', 'production-date', date] });
        clear();
        dayQuery.refetch();
        prevDateRef.current = date;
      }
    }, [date, dayQuery]);

    // initiallyOpen={production.payload.length == 1 ? true: (i == production.payload.length - 1 ? true: false)}

    return (<div className={`${borderOn ? 'border border-red-700': ''} mx-4 mt-4 min-h-screen overflow-y-scroll`}>
        {date && <>
            {!production && <h1 className={`${borderOn ? 'border border-red-700': ''} text-lg text-slate-600 font-semibold uppercase flex items-center`}>
                {convertToDayNameFormat(date)}
                <CalendarNavButton nav={nav} to={`/production`}/>
            </h1>}

            {/* <input style={{display: 'hidden' }} type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" /> */}
            
            <div className={`${borderOn ? 'border border-red-700': ''} min-h-96 mb-24`}>
                {dayQuery.isFetching 
                    ? <div className='h-96 text-center align-middle'><Loader /></div>
                    : production 
                      ? <div className="pt-4">
                        <Summary cache={production} nav={nav} date={date} />
                        {production.payload && production.payload.map((batch) => {
                          const prodBatch: ProductionBatchCache = batch as ProductionBatchCache;
                          return <CollapsibleDiv className="mb-8" custom={date} batch={prodBatch} key={batch.batchNo} initiallyOpen={false}>
                            <BatchSummary {...prodBatch} />
                          </CollapsibleDiv>
                        }
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
                  {!showForm && !batch && <TransButton showAsButton={true} label={label} update={() => {
                    setShowForm(true);
                    // collapse the summary
                  }} />}
                  {showForm && !batch 
                    && <ProductionBatchForm close={() => {
                      setShowForm(false);
                      setSavedBatch(undefined);
                      setMutationResult(undefined);
                    }} update={update} batchNo={newBatchNo}
                     result={mutationResult} savedBatch={savedBatch}/>}
                  {batch && <div className={`border border-green-900 h-fit rounded bg-green-50`}>
                    <FormHeader close={undo} batch={batch}
                      isLoading={isLoading}  />
                    <div className="mx-4 py-2">
                      <BatchSummary {...batch} />
                    </div>

                    <div className="mb-10 rounded flex flex-row justify-center w-full">
                      <button type="button" 
                        disabled={isLoading}
                        className={`inline-flex w-42 items-center px-4 py-2 
                          bg-orange-500 text-white rounded font-bold text-xl
                          justify-center
                          transition-colors duration-300 hover:font-normal
                          disabled:bg-gray-200 disabled:text-gray-400 disabled:font-light disabled:italic
                        `}
                        onClick={() => {
                            setIsLoading(true);
                            upload();
                        }}
                      >
                        <CloudUpload className="w-5 h-5 mr-2" />
                        Upload Batch
                      </button>
                    </div>
                  </div>}
                </div>
            </div>            
        </>}
        {!date && <h1>Invalid date</h1>}
        
    </div>);
}

export default ProductionDay;