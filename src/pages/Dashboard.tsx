import { FC, useState, useEffect } from 'react';
import { fetchConsumables } from '../api/api';
import Count from '@/core/Count';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/20/solid';
import { BuildingStorefrontIcon } from '@heroicons/react/20/solid';

/* const Swiggy: FC<{ orderId?: string }> = ({ orderId }) => {
    return <div className={`text-center flex items-center justify-center px-1 font-bold leading-tight h-8 rounded
        text-white bg-orange-500`}>
        { orderId || 'Swiggy' } 
    </div>
}
 */
const Agg2: FC<{ type: string, orderId?: string, size?: string }> = ({ type, orderId, size }) => {

    let sizeDefault = size || 'large';

    if (!orderId) {
        sizeDefault = 'small'
    }

    interface Styles {
        bs: string,
        h: string,
        t: string
    }

    const SZING_CHRT:  { [key: string]: Styles } = {
        'large': {
            bs: 'border-4',
            h: 'h-12',
            t: 'text-2xl'
        },
        'small': {
            bs: 'border-4',
            h: 'h-8',
            t: 'text-l'
        }
    }

    const { bs, h, t } = SZING_CHRT[sizeDefault]

    const borderColor = type == 'zomato' ? 'border-red-700': 'border-orange-500';
        return <div className={`text-center flex items-center justify-center ${t} font-semibold leading-tight
        ${h} rounded text-slate-600 ${bs} ${borderColor} px-2`}>
        { orderId || type.toUpperCase() } 
    </div>
}

interface AttemptsMap {
    [key: string]: number[]
}

interface TimesMap {
    [key: string]: number | undefined
}

/* interface TimeStage {
    type: string,
    name: string,
    time: number
} */

interface TimingBarConfig {
    total: number,
    markers: number[]
}

interface TimingBarProps {
    startTime: number,
    stageTimes: TimesMap,
    attempts: AttemptsMap,
    config?: TimingBarConfig
}

interface PositionProps {
    type: string, 
    position: number
    name: string, 
    isRepeated?: boolean
}

interface NameMap {
    [key: string]: { letter: string, color: string, repeatedColor?: string, invert?: boolean }
};

const nameMap: NameMap = {
    userAcceptedTime: { letter: 'U', color: 'green-400' },
    riderArrivedTime: { letter: 'A', color: 'violet-700', invert: true },
    readyTime: { letter: 'R', color: 'green-700' },
    pickedUpTime: { letter: 'P', color: 'indigo-900', invert: true  },
    deliveredTime: { letter: 'D', color: 'teal-700', invert: true  },
    NOW: { letter: '|', color: 'bg-orange-500' },
    INITPREPARE: { letter: 'T', color: 'bg-slate-500', repeatedColor: 'bg-orange-400' },
    READYORDER: { letter: 'T', color: 'bg-red-700' }
}

interface MarkerProps {
    type: string, 
    timeName: string, 
    repeated?: boolean
}

const Marker: FC<MarkerProps> = ({ type, timeName, repeated }) => {

    const { letter, color, repeatedColor, invert } = nameMap[timeName];
    
    if (type == 'stage') {
        // let [, baseColor, value] = color.split('-');
        return <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-md 
            ${invert 
                ? `border-4 border-${color} bg-white`
                : `bg-${color} border-2 border-white`}
            `}>
            <span className={`font-bold ${invert? `text-md text-${color}`: 'text-sm text-white'}`}>{letter}</span>
        </div>
         {/* <div className={`h-8 w-8 rounded-full border-4 border-violet-400 bg-white flex items-center justify-center shadow-md`}>
         <span className="text-md text-violet-400 font-bold">A</span>
     </div> */}
    } else if (type == 'reminder') {
        //  return <div className={`h-14 w-1 ${color}`}></div>
        return <div className={`mt-8 h-8 w-8 rounded-full ${repeated ? repeatedColor: color} border-2 border-white flex items-center justify-center shadow-md`}>
            {/* <span className="text-sm text-white font-bold">{letter}</span> */}
            <PhoneArrowDownLeftIcon className='size-4 text-white'/>
        </div>
    } else {
        return <div className={`h-14 ${color} w-0.5`}></div>
    }

}

const PositionBubble: FC<PositionProps> = ({ type, position, name, isRepeated }) => {
    return <div 
        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${position}%` }}
    >
        <Marker type={type} timeName={name} repeated={isRepeated} />
    </div>
}

const TimingBar: FC<TimingBarProps> = ({ startTime, stageTimes, attempts, config }) => {
    const now = new Date();
    // let debug = false;
    // debug = true;
    const TC_CFG: TimingBarConfig = config || {
        total: 60,
        markers: [ 5, 20, 30, 45]
    }

    // alert(`attempts TBar: ${JSON.stringify(attempts)}`);

    // Define the timestamps
    // const acceptedTime = 1746513533000;
   /*  const userAcceptedTime = 1746513749521;
    const readyTime = 1746513749521;
    const riderArrivedTime = 1746515126000;
    const pickedUpTime = 1746515228000;
    const deliveredTime = 1746515827000; */
    
    // Calculate the total duration (60 minutes = 3600000 milliseconds)
    const totalDuration = TC_CFG.total * 60 * 1000;
    // const endTime = startTime + totalDuration;

    const positions: PositionProps[] = [];
    const nowMarker: PositionProps = {
        type: 'now',
        name: 'NOW',
        position: ((now.getTime() - startTime) / totalDuration) * 100
    }

    for ( let stage of Object.entries(stageTimes)) {
        
        const [name, time] = stage;
        // alert(name);
        if (time != undefined) {
            const diff = time - startTime;
            const position = (diff / totalDuration) * 100
            // alert(diff)
            if (position <= 100) {
                positions.push({ type: 'stage', name, position });
            }
        }
    }

    // alert(((attempts.INITPREPARE[0] - startTime)/(1000*60)) - 330)
    // alert(JSON.stringify(Object.entries(attempts)[0]))

   /*  if (Object.entries(attempts).length > 1) {
        alert(JSON.stringify(attempts))
    } */

    if (attempts) {
        for ( let reminder of Object.entries(attempts)) {
            
            const [rType, times] = reminder;
            // alert(rType)
            let c = 0;
            for (let time of times) {
                // alert(time);
                const diff = time - startTime;
                const position = (diff / totalDuration) * 100;
                // alert(`${rType} Time(${time}) diff[${diff}] [${position}]`)
                if (position <= 100) {
                    const prop: PositionProps = { type: 'reminder', name: rType, position };

                    if (rType == 'INITPREPARE' && c > 0) {
                        prop.isRepeated = true
                    }
                    positions.push(prop);
                }
                c++;
            }
        }
    }

    if (nowMarker.position <= 100 && (!stageTimes['userAcceptedTime'] || !stageTimes['readyTime'])) {
        positions.push(nowMarker);
    }

    // alert(JSON.stringify(stageTimes))

    // Calculate positions (as percentages)
   /*  const userAcceptedPosition = ((userAcceptedTime - acceptedTime) / totalDuration) * 100;
    const riderArrivedPosition = ((riderArrivedTime - acceptedTime) / totalDuration) * 100;
    const pickedUpPosition = ((pickedUpTime - acceptedTime) / totalDuration) * 100;
    const deliveredPosition = ((deliveredTime - acceptedTime) / totalDuration) * 100; */

    // Validate markers are in ascending order and within total
    const { markers, total } = TC_CFG;
    // Validate markers are in ascending order and within total
    const validMarkers = [...markers].sort((a, b) => a - b).filter(m => m > 0 && m < total);
    
    // Calculate segment percentages
    // With n markers, we'll have n+1 segments
    const segments = [];
    let previous = 0;
    const unit = 'm'
    
    // Add segments based on markers
    for (const marker of validMarkers) {
        const width = ((marker - previous) / total) * 100;
        segments.push({ width, start: previous, end: marker });
        previous = marker;
    }
    
    // Add final segment
    const finalWidth = ((total - previous) / total) * 100;
    segments.push({ width: finalWidth, start: previous, end: total });
    
    // Color intensities for segments - we need enough colors for all segments (markers + 1)
    const colorIntensities = ['gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500'];
    // className={`bg-red-${colorIntensities[Math.min(index, colorIntensities.length - 1)]}`}
  //'green-100', 'green-200', 
    return <div className="w-full flex flex-col gap-4 mt-4">
        {/* Progress bar container */}
        {/* <div className="space-y-1"> */}
        <div className="w-full h-2 flex rounded relative">
            {segments.map((segment, index) => (
            <div 
                key={`start-${segment.start}-${index}`} 
                className={`bg-${colorIntensities[index]}`}
                style={{ width: `${segment.width.toFixed(2)}%` }}
            ></div>
            ))}
             {/* Timeline markers */}
                {positions && positions.length > 0 && positions.map(p => {
                    return <PositionBubble type={p.type} position={p.position} name={p.name} isRepeated={p.isRepeated} />
                })}
            </div>

            {/* Markers with accurate placement */}
      <div className="w-full h-0 relative">
        {validMarkers.map((marker, i) => {
          // Calculate position as percentage of total width
          const position = (marker / total) * 100;
          
          return (
            <div 
              key={i} 
              className="absolute"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              <span className="absolute -mt-10 text-xs font-light italic text-gray-800">
                {marker}{unit}
              </span>
            </div>
          );
        })}
        <div 
            className="absolute"
            style={{ left: `${99}%`, transform: 'translateX(-50%)' }}
        >
            <span className="absolute -mt-10 text-xs font-light italic text-gray-800">
            {total}{unit}
            </span>
        </div>
      </div>

    </div>
 }

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


interface StageBarProps {
    order4Digits: string;
    aggregator: string;
    storeId: string,
    acceptedTime: number,
    userAcceptedTime?: number,
    readyTime?: number,
    riderArrivedTime?: number,
    pickedUpTime?: number,
    deliveredTime?: number,
    attempts: AttemptsMap
}

const StageBar: FC<StageBarProps> = ({ attempts, order4Digits, aggregator, storeId, acceptedTime, 
    userAcceptedTime, readyTime, riderArrivedTime, pickedUpTime, deliveredTime }) => {
        let stage = 'OK';

    if ((!readyTime && !pickedUpTime) || !userAcceptedTime) {
        stage = !userAcceptedTime ? 'RED': 'GRAY'
    }
    // alert(`${order4Digits} attempts : ${JSON.stringify(attempts)}`);
    const borderBackgrounds: { [key: string]: string } = {
        OK: '',
        GRAY: 'border-green-400 border-2 bg-green-50',
        // GRAY: 'border-red-300 border-2 bg-red-100',
        RED: 'border-red-300 border-4 bg-red-100',
        TEST1: 'bg-green-400',
        TEST2: 'border-violet-700',
        TEST3: 'text-violet-700',
        TEST4: 'border-indigo-900',
        TEST5: 'text-indigo-900',
        TEST6: 'border-teal-700',
        TEST7: 'text-teal-700',
        TEST8: 'bg-green-400'
    }
const time = new Date();
    time.setTime(acceptedTime)
    return <div className='flex flex-row w-full item items-center hover:bg-blue-200 cursor-pointer hover:border-2 hover:border-blue-800 hover:rounded h-18 hover:h-20'>
        <div 
            className="text-center flex items-center justify-center text-2xl px-1 font-bold leading-tight text-slate-600 h-18"
            style={{fontFamily: 'Orbitron, monospace'}}
            >{time.toLocaleTimeString('en-GB', { timeStyle: 'short' })}</div>
        <div className={`w-full p-2 ${borderBackgrounds[stage]} items-center flex flex-row gap-4 h-18 rounded justify-between align-middle`}>
            {/* <div className={`text-center flex items-center justify-center text-2xl px-1 font-semibold leading-tight h-12 rounded 
                ${'z' == aggregator.charAt(0) 
                // ? 'bg-red-700 border-red-700 border-4 text-white': 
                ? ' border-red-700 border-4 text-slate-600 px-2'
                // ? 'text-red-700 border-red-700 border-4': 
                // :'text-white bg-orange-500 px-2'
                :'text-slate-600 border-4 border-orange-500 px-2'
                }`}>
                {order4Digits} 
            </div> */}
            <Agg2 type={aggregator} orderId={order4Digits} />
            <TimingBar startTime={acceptedTime} stageTimes={{
                    userAcceptedTime, readyTime, riderArrivedTime, pickedUpTime, deliveredTime
            }} attempts={attempts} />
            <div className={`w-20 text-center flex items-center justify-center font-semibold leading-tight h-12 
                 rounded text-white
             bg-slate-400`}>
                <BuildingStorefrontIcon className='size-4' /> <span className='text-2xl block'>{storeId}</span></div>
        </div>
    </div>
}

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
                setFilteredOrders(filter(label));
                // return undefined;
                // alert(`Filter clicked: ${label}`)
               
            }} activeLabel='Total'/>
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