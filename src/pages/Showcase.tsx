import { FC } from 'react';
import { fetchConsumables } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

interface AttemptsMap {
    [key: string]: number[]
}

interface TimesMap {
    [key: string]: number | undefined
}

interface TimeStage {
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

const PositionBubble: FC<{position: number, timeName: string }> = ({ position, timeName }) => {
    interface NameMap {
        [key: string]: { letter: string, color: string }
    };

    const nameMap: NameMap = {
        userAcceptedTime: { letter: 'U', color: 'bg-yellow-500' },
        riderArrivedTime: { letter: 'A', color: 'bg-purple-500' },
        readyTime: { letter: 'R', color: 'bg-green-700' },
        pickedUpTime: { letter: 'P', color: 'bg-indigo-500' },
        deliveredTime: { letter: 'D', color: 'bg-teal-500' },
        NOW: { letter: '|', color: 'bg-orange-500' }
    }

    const { letter, color } = nameMap[timeName];

    return <div 
        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${position}%` }}
    >
        { 'NOW' != timeName && <div className={`h-8 w-8 rounded-full ${color} border-2 border-white flex items-center justify-center shadow-md`}>
        <span className="text-sm text-white font-bold">{letter}</span>
        </div>}

        { 'NOW' == timeName && <div className={`h-14 w-1 ${color}`}>
        {/* <span className="text-sm text-white font-bold">{'|'}</span> */}
        </div>}
    </div>;
}

const TimingBar: FC<TimingBarProps> = ({ startTime, stageTimes, attempts, config }) => {
    const now = new Date();
    // let debug = false;
    // debug = true;
    const TC_CFG: TimingBarConfig = config || {
        total: 40,
        markers: [ 5, 15, 30]
    }

    alert(attempts);

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
                positions.push({ name, time: position });
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
                    return <PositionBubble position={p.time} timeName={p.name} />
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
            className="text-center flex items-center justify-center text-2xl px-1 font-semibold font-mono leading-tight text-slate-700 h-14 "
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
      </div>
}

const Showcase= () => {
    const orderStages = useQuery({
        queryKey: ['consumable', 'order-stages'],
        queryFn: async () => {
          try {
            // const data = await fetchAssetsForType('product');
            const data = await fetchConsumables('ORDER_STAGES');
            // alert(JSON.stringify(data.data));
            const rows = data.data; //.map(item => ({ ...item, options: item.options.length}));
            // alert(JSON.stringify(rows.length));
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
    
  const [expandedRows, setExpandedRows] = useState(new Set());

  const data = [
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      department: "Engineering",
      details: {
        email: "john.doe@company.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        joinDate: "Jan 15, 2022",
        projects: ["E-commerce Platform", "Mobile App", "API Gateway"],
        skills: ["React", "Node.js", "Python", "AWS", "Docker"],
        bio: "Experienced full-stack developer with a passion for creating scalable web applications and mentoring junior developers."
      }
    },
    {
      id: 2,
      name: "Sarah Wilson",
      role: "Product Manager",
      department: "Product",
      details: {
        email: "sarah.wilson@company.com",
        phone: "+1 (555) 987-6543",
        location: "New York, NY",
        joinDate: "Mar 8, 2021",
        projects: ["User Analytics Dashboard", "Product Roadmap", "Market Research"],
        skills: ["Product Strategy", "User Research", "Agile", "Analytics", "Leadership"],
        bio: "Strategic product manager focused on user-centric design and data-driven decision making to drive product growth."
      }
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "UX Designer",
      department: "Design",
      details: {
        email: "mike.chen@company.com",
        phone: "+1 (555) 456-7890",
        location: "Seattle, WA",
        joinDate: "Jul 22, 2023",
        projects: ["Design System", "Mobile Redesign", "User Testing"],
        skills: ["Figma", "Prototyping", "User Research", "Design Systems", "Accessibility"],
        bio: "Creative UX designer dedicated to crafting intuitive user experiences through research-driven design solutions."
      }
    }
  ];

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Team Directory</h1>
      
      <div className="space-y-4">
        {data.map((person) => (
          <div key={person.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Main Row */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => toggleRow(person.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{person.name}</h3>
                    <p className="text-gray-600">{person.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {person.department}
                  </span>
                  {expandedRows.has(person.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedRows.has(person.id) && (
              <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 animate-in slide-in-from-top duration-300">
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Contact Info
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{person.details.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{person.details.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{person.details.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">Joined {person.details.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Projects & Skills */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                        Projects & Skills
                      </h4>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Current Projects:</h5>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {person.details.projects.map((project, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Skills:</h5>
                        <div className="flex flex-wrap gap-2">
                          {person.details.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4">About</h4>
                      <p className="text-gray-700 leading-relaxed">{person.details.bio}</p>
                      <div className="pt-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showcase;