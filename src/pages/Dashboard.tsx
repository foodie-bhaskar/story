import { FC } from 'react';
import { fetchConsumables } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/20/solid';

interface AttemptsMap {
    [key: string]: number[]
}

interface TimesMap {
    [key: string]: number | undefined
}

interface TimeStage {
    type: string,
    name: string,
    time: number
}

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

const PositionBubble: FC<{type: string, position: number, timeName: string }> = ({ type, position, timeName }) => {

    const Marker: FC<{type: string, timeName: string }> = ({ type, timeName }) => {
        interface NameMap {
            [key: string]: { letter: string, color: string }
        };
    
        const nameMap: NameMap = {
            userAcceptedTime: { letter: 'U', color: 'bg-yellow-500' },
            riderArrivedTime: { letter: 'A', color: 'bg-purple-500' },
            readyTime: { letter: 'R', color: 'bg-green-700' },
            pickedUpTime: { letter: 'P', color: 'bg-indigo-500' },
            deliveredTime: { letter: 'D', color: 'bg-teal-500' },
            NOW: { letter: '|', color: 'bg-orange-500' },
            INITPREPARE: { letter: 'T', color: 'bg-orange-500' },
            READYORDER: { letter: 'T', color: 'bg-red-700' },
        }
        const { letter, color } = nameMap[timeName];
        
        if (type == 'stage') {
            return <div className={`h-8 w-8 rounded-full ${color} border-2 border-white flex items-center justify-center shadow-md`}>
                <span className="text-sm text-white font-bold">{letter}</span>
            </div>
        } else if (type == 'reminder') {
            //  return <div className={`h-14 w-1 ${color}`}></div>
            return <div className={`h-8 w-8 rounded-full ${color} border-2 border-white flex items-center justify-center shadow-md`}>
                {/* <span className="text-sm text-white font-bold">{letter}</span> */}
                <PhoneArrowDownLeftIcon className='size-4 '/>
            </div>
        } else {
            return <div className={`h-14 w-1 ${color}`}></div>
        }

    }

    return <div 
        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${position}%` }}
    >
        {/* {type} {timeName} */}
        <Marker type={type} timeName={timeName} />
    </div>
}

const TimingBar: FC<TimingBarProps> = ({ startTime, stageTimes, attempts, config }) => {
    const now = new Date();
    // let debug = false;
    // debug = true;
    const TC_CFG: TimingBarConfig = config || {
        total: 40,
        markers: [ 5, 20, 30]
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

    const positions: TimeStage[] = [];
    const nowMarker: TimeStage = {
        type: 'now',
        name: 'NOW',
        time: ((now.getTime() - startTime) / totalDuration) * 100
    }

    for ( let stage of Object.entries(stageTimes)) {
        
        const [name, time] = stage;
        // alert(name);
        if (time != undefined) {
            const diff = time - startTime;
            const position = (diff / totalDuration) * 100
            // alert(diff)
            if (position <= 100) {
                positions.push({ type: 'stage', name, time: position });
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
            // alert(times[0])
            for (let time of times) {
                // alert(time);
                const diff = time - startTime;
                const position = (diff / totalDuration) * 100;
                // alert(`${rType} Time(${time}) diff[${diff}] [${position}]`)
                if (position <= 100) {
                    positions.push({ type: 'reminder', name: rType, time: position });
                }
            }
        }
    }

    if (nowMarker.time <= 100 && (!stageTimes['userAcceptedTime'] || !stageTimes['readyTime'])) {
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
    const colorIntensities = ['green-200', 'yellow-100', 'yellow-500', 'red-500', 'orange-500'];
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
                    return <PositionBubble type={p.type} position={p.time} timeName={p.name} />
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
        GRAY: 'border-gray-300 border-2 bg-gray-200',
        // GRAY: 'border-red-300 border-2 bg-red-100',
        RED: 'border-red-300 border-2 bg-red-100'
    }
    
    const time = new Date();
    time.setTime(acceptedTime)
    return <div className='flex flex-row w-full item'>
        <div 
            className="text-center flex items-center justify-center text-2xl px-1 font-bold leading-tight text-slate-600 h-14 "
            style={{fontFamily: 'Orbitron, monospace'}}
            >{time.toLocaleTimeString('en-GB', { timeStyle: 'short' })}</div>
        <div className={`w-full p-2 ${borderBackgrounds[stage]} items-center flex flex-row gap-4 h-14 rounded justify-between align-middle mb-4`}>
            <div className={`text-center flex items-center justify-center text-2xl px-1 font-semibold leading-tight h-12 rounded
                ${'z' == aggregator.charAt(0) ? 'bg-red-700 text-white': 'bg-black text-orange-400'}`}>
                {order4Digits} 
            </div>
            <TimingBar startTime={acceptedTime} stageTimes={{
                    userAcceptedTime, readyTime, riderArrivedTime, pickedUpTime, deliveredTime
            }} attempts={attempts} />
            <div className={`w-24 text-center flex items-center justify-center text-xl px-1 font-semibold leading-tight h-12 rounded
             text-white bg-slate-400`}>
                # {storeId}</div>
        </div>
    </div>
}

const Legend = () => {
    return <div className="flex flex-wrap gap-4 mt-2 items-center">
        <div className={`text-center flex items-center justify-center text-xl px-1 font-bold leading-tight h-10 rounded
            bg-red-700 text-white`}>
            Zomato 
        </div>
        <div className={`text-center flex items-center justify-center text-xl px-1 font-bold leading-tight h-10 rounded
            bg-black text-orange-400`}>
            Swiggy 
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
          <span className="text-xs">User Accepted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <span className="text-xs">Rider Arrived</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-green-700"></div>
          <span className="text-xs">Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-indigo-500"></div>
          <span className="text-xs">Picked Up</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-teal-500"></div>
          <span className="text-xs">Delivered</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-14 w-1 bg-orange-500"></div>
          <span className="text-xs">Now Marker</span>
        </div>
        <div className="flex items-center gap-1">
            <div className={`h-8 w-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center shadow-md`}>
                <PhoneArrowDownLeftIcon className='size-4 '/>
            </div>
            <span className="text-xs">Accept Notification</span>
        </div>
        <div className="flex items-center gap-1">
            <div className={`h-8 w-8 rounded-full bg-red-700 border-2 border-white flex items-center justify-center shadow-md`}>
                <PhoneArrowDownLeftIcon className='size-4 '/>
            </div>
            <span className="text-xs">Ready Reminder</span>
        </div>
      </div>
}

const Dashboard = () => {
    const orderStages = useQuery({
        queryKey: ['consumable', 'order-stages'],
        queryFn: async () => {
          try {
            // const data = await fetchAssetsForType('product');
            const data = await fetchConsumables('ORDER_STAGES');
            // alert(JSON.stringify(data.data));
            const rows = data.data; //.map(item => ({ ...item, options: item.options.length}));
            // alert(JSON.stringify(rows[0].attempts));
            rows.sort((a: StageBarProps, b: StageBarProps) => b.acceptedTime - a.acceptedTime)
            return rows;
          } catch (err) {
            const error = err as AxiosError;
            throw error;
          }
        },
        staleTime: 5 * 60 * 1000,
        enabled: true
    });
    
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

    return (<div className='lg-w-full mx-auto p-2'>
        <Legend />
        <hr className='my-4'></hr>
        {/* <div className='m-10'> </div> */}

        {orderStages.isLoading && <span>Loading orders</span>}
        {!orderStages.isLoading && orderStages.data && orderStages.data.map((os: StageBarProps) => <StageBar {...os} />)}
            {/* <StageBar {...os} /> */}
        {/* })} */}
    </div>)
}

export default Dashboard;