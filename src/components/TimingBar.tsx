import { FC } from 'react';
import { AttemptsMap } from '../App.type';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/20/solid';

interface TimingBarConfig {
    total: number,
    markers: number[]
}

interface TimesMap {
    [key: string]: number | undefined
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

export const Marker: FC<MarkerProps> = ({ type, timeName, repeated }) => {

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

export default TimingBar;