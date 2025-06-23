import { FC, useState, useEffect } from 'react';
import { fetchConsumables } from '../api/api';
import Count from '@/core/Count';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { BuildingStorefrontIcon } from '@heroicons/react/20/solid';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/20/solid';
import { Marker } from '@/components/TimingBar';
import Agg2 from '@/components/ui/Agg2';
import StageBar, { StageBarProps } from '@/components/StageBar';


/* interface TimeStage {
    type: string,
    name: string,
    time: number
} */





/*
{
        "order4Digits": "7889",
        "aggregator": "zomato",
        "storeId": "170",
        "status": "delivered",
        "acceptedTime": 1746513533000,
        "userAcceptedTime": 1746513749521,
        "riderArrivedTime": 1746515126000,
        "pickedUpTime": 1746515228000,
        "deliveredTime": 1746515827000,
        "attempts": {
            "READYORDER": [
                1746534388000,
                1746534987000,
                1746535587000
            ]
        }
    }
 */

const Legend = () => {

    const LegendItem: FC<{ name: string, displayText: string }> = ({ displayText, name }) => {
        return  <div className="flex items-center gap-1">
            <Marker type="stage" timeName={name} />
            <span className="text-xs">{displayText}</span>
        </div>
    }

    

    return <div className="flex flex-wrap gap-4 mt-6 items-center bg-gray-50 border border-gray-800 px-2 rounded text-green-700
    font-light italic">
        {/* <div className={`text-center flex items-center justify-center px-1 font-bold leading-tight h-8 rounded
            text-red-700 bg-white border-4 border-red-700`}>
            Zomato 
        </div> */}
        {/* <div className={`text-center flex items-center justify-center px-1 font-bold leading-tight h-8 rounded
            text-white bg-red-700 border-4 border-red-700`}>
            Zomato 
        </div> */}
        <Agg2 type='zomato' />
       {/*  <div className={`text-center flex items-center justify-center px-1 font-bold leading-tight h-8 rounded
            text-white bg-orange-500`}>
            Swiggy 
        </div> */}
        {/* <Swiggy /> */}
        <Agg2 type='Swiggy' />
        {/* <Swiggy2 /> */}
        <LegendItem name="userAcceptedTime" displayText='User Accepted' />
        <LegendItem name="readyTime" displayText='Ready' />
        <LegendItem name="riderArrivedTime" displayText='Rider Arrived' />
        <LegendItem name="pickedUpTime" displayText='Picked Up' />
        <LegendItem name="deliveredTime" displayText='Delivered' />
        
        <div className="flex items-center gap-1">
          <div className="h-10 w-0.5 bg-orange-500"></div>
          <span className="text-xs">Now Marker</span>
        </div>
        <div className="flex items-center gap-1">
            <div className={`h-8 w-8 rounded-full bg-slate-500 border-2 border-white flex items-center justify-center shadow-md`}>
                <PhoneArrowDownLeftIcon className='size-4 text-white '/>
            </div>
            <span className="text-xs">Accept Notification</span>
        </div>
        <div className="flex items-center gap-1">
            <div className={`h-8 w-8 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center shadow-md`}>
                <PhoneArrowDownLeftIcon className='size-4 text-white '/>
            </div>
            <span className="text-xs">Repeated</span>
        </div>
        <div className="flex items-center gap-1">
            <div className={`h-8 w-8 rounded-full bg-red-700 border-2 border-white flex items-center justify-center shadow-md`}>
                <PhoneArrowDownLeftIcon className='size-4 text-white'/>
            </div>
            <span className="text-xs">Ready Reminder</span>
        </div>
        <div className="flex items-center gap-1">
            <div className={`px-1 text-center flex items-center justify-center font-semibold leading-tight h-8
                 rounded text-white
             bg-slate-400`}>
                <BuildingStorefrontIcon className='size-4' /> <span className='mt-1 mx-1 text-sm block'>STORE ID</span></div>
        </div>
      </div>
}

const Dashboard = () => {
    const [notReady, setNotReady] = useState(0);
    const [ready, setReady] = useState(0); // Basically ready but not picked
    const [notAccepted, setNotAccepted] = useState(0);
    const [picked, setPicked] = useState(0);
    const [delivered, setDelivered] = useState(0);
    const [total, setTotal] = useState(0);
    const [filteredOrders, setFilteredOrders] = useState<StageBarProps[]>([]);
    const [activeFLabel, setActiveFLabel] = useState('Total');
    const orderStages = useQuery({
        queryKey: ['consumable', 'order-stages'],
        queryFn: async () => {
          try {
            // const data = await fetchAssetsForType('product');
            const data = await fetchConsumables('ORDER_STAGES');
            // alert(JSON.stringify(data.data));
            const rows: StageBarProps[] = data.data; //.map(item => ({ ...item, options: item.options.length}));
            // alert(JSON.stringify(rows[0].attempts));
            rows.sort((a: StageBarProps, b: StageBarProps) => b.acceptedTime - a.acceptedTime)
            return {
                orders: rows,
                delivered: rows.filter((os: StageBarProps) => !!os.deliveredTime),
                ready: rows.filter((os: StageBarProps) => !!os.readyTime),
                picked: rows.filter((os: StageBarProps) => !!os.pickedUpTime),
                notReady: rows.filter((os: StageBarProps) => !os.readyTime && !!os.userAcceptedTime),
                notAccepted: rows.filter((os: StageBarProps) => !os.userAcceptedTime)
            };
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: 5 * 60 * 1000,
        enabled: true
    });

    function filter(label: string): StageBarProps[] {
        if (orderStages.data && orderStages.data.orders) {
            if (label == 'Total') {
                return orderStages.data.orders;
            } else {
                if (label == 'Not Accepted') {
                    return orderStages.data.notAccepted;
                } else if (label == 'Not Ready') {
                    return orderStages.data.notReady.filter(f => !!f.userAcceptedTime);
                } else if (label == 'Not Picked') {
                    return orderStages.data.ready.filter(f => !f.pickedUpTime);
                } else if (label == 'Not Delivered') {
                    return orderStages.data.picked.filter(f => !f.deliveredTime);
                } else if (label == 'Delivered') {
                    return orderStages.data.delivered
                }

                return orderStages.data.orders;
            }
        } else {
            return [];
        }
    }

    useEffect(() => {
        if (!orderStages.isLoading && orderStages.data) {
            const {
                picked, ready, delivered, notAccepted, notReady, orders
            } = orderStages.data;
            setTotal(orders.length);
            setDelivered(delivered.length);
            setPicked(picked.length - delivered.length);
            setReady(ready.length - picked.length);
            setNotReady(notReady.length);
            setNotAccepted(notAccepted.length);
            setFilteredOrders(orders)
        }
    
      }, [orderStages.isLoading, orderStages.data])
    
    
    /* const order = {
        "order4Digits": "7889",
        "aggregator": "zomato",
        "storeId": "170",
        "status": "delivered",
        "acceptedTime": 1746513533000,
        "userAcceptedTime": 1746513749521,
        "riderArrivedTime": 1746515126000,
        "pickedUpTime": 1746515228000,
        "deliveredTime": 1746515827000,
        "attempts": {
            "READYORDER": [
                1746534388000,
                1746534987000,
                1746535587000
            ]
        }
    };

    const order2 = {
        "order4Digits": "2792",
        "aggregator": "zomato",
        "storeId": "93",
        "status": "accepted",
        "acceptedTime": 1746512287000,
        "userAcceptedTime": 1746514942528,
        "attempts": {
            "INITPREPARE": [
                1746531913000,
                1746532033000,
                1746532153000
            ],
            "READYORDER": [
                1746533187000,
                1746533787000,
                1746534387000
            ]
        }
    } */

    interface Filter {
        count: number,
        label: string,
        statusColor?: string
    }

    {/* <Count clickable={true} label='Not Accepted' count={notAccepted} size="medium" isLoading={isLoading} numStatus={notAccepted == 0 ? 'good': (notAccepted > 5? 'bad': 'warn')}/>
            <Count clickable={true} label='Not Ready' count={notReady} size="medium" isLoading={isLoading} numStatus={notReady == 0 ? 'good': (notReady > 5? 'bad': 'warn')}/>
            <Count clickable={true} label='Not Picked' count={ready} size="medium" isLoading={isLoading} numStatus={ready == 0 ? 'good': 'warn'} />
            <Count clickable={true} label='Not Delivered' count={picked} size="medium" isLoading={isLoading} numStatus={picked > 0 ? 'warn': 'good'} />
            <Count clickable={true} label='Delivered' count={delivered} size="medium" isLoading={isLoading} numStatus={delivered > 0 ? 'good': 'warn'} />
            <Count clickable={true} label='Total' count={total} size="medium" isLoading={isLoading} active={activeFilter == 'Total'}/> */}
    

    const FilterBar: FC<{ isLoading: boolean, filters: Filter[], filteredFn: Function, activeLabel: string }> = 
        ({ isLoading, activeLabel, filters, filteredFn }) => {

        const [activeFilter, setActiveFilter] = useState(activeLabel);
        const [counters, setCounters] = useState<Counter[]>();

        interface Counter {
            label: string,
            clickable: boolean,
            count: number,
            numStatus?: string,
            active: boolean
        }

        useEffect(() => {
            let counters: Counter[] = filters.map((f: Filter) => ({
                label: f.label,
                clickable: true,
                count: f.count,
                numStatus: f.statusColor,
                active: f.label == activeFilter
            }))
            setCounters(counters);
        }, [activeFilter, filters])

        
        return <div className={`flex flex-row gap-8 my-4 mx-2`}>
            {counters && counters.map(c => <Count key={c.label} label={c.label}
                clickable={c.clickable} count={c.count} isLoading={isLoading} size='medium' numStatus={c.numStatus}
                active={c.active}  onClickFn={() => {
                    setActiveFilter(c.label);
                    filteredFn(c.label)
                }} 
            />)}
        </div>
    }

    const filters = [
        {
            label: 'Not Accepted', count: notAccepted, statusColor: notAccepted == 0 ? 'good': (notAccepted > 5? 'bad': 'warn')
        },
        {
            label: 'Not Ready', count: notReady, statusColor: notReady == 0 ? 'good': (notReady > 5? 'bad': 'warn')
        },
        {
            label: 'Not Picked', count: ready, statusColor: ready == 0 ? 'good': 'warn'
        },
        {
            label: 'Not Delivered', count: picked, statusColor: picked > 0 ? 'warn': 'good'
        },
        {
            label: 'Delivered', count: delivered, statusColor: delivered > 0 ? 'good': 'warn'
        },
        {
            label: 'Total', count: total
        }
    ]

    return (<div className='lg-w-full mx-auto p-2'>
        <FilterBar isLoading={orderStages.isLoading} filters={filters} 
            filteredFn={(label: string) => {
                setActiveFLabel(label);
                setFilteredOrders(filter(label));
                // return undefined;
                // alert(`Filter clicked: ${label}`)
               
            }} activeLabel={activeFLabel} />
        <Legend />
        <hr className='my-4'></hr>
        {/* <div className='m-10'> </div> */}

        {orderStages.isLoading && <span>Loading orders</span>}
        <div className='flex flex-col gap-4'>
            {!orderStages.isLoading && orderStages.data && filteredOrders.map((os: StageBarProps) => <StageBar key={os.acceptedTime} {...os} />)}
        </div>
    </div>)
}

export default Dashboard;