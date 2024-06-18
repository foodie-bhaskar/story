import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { DataTable } from '@/components/DataTable';
import { Columns } from '../components/Columns'

async function fetchUIResourcesForType(uiType: string) {  
    return axios.get(`https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=${uiType}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
}

const DropdownsPage = () => {

    const borderOn = false;
  // const borderOn = true;

    const navigate = useNavigate();


    const { isPending, data } = useQuery({
        queryKey: ['dropdown'],
        queryFn: async () => {
            const data = await fetchUIResourcesForType('dropdown');
            // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
            const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
            // alert(JSON.stringify(rows));
            return rows;
        },
        staleTime: 60 * 1000
    });

    return (
        <div>
            <h1>Dropdowns</h1>

            <div className={`${borderOn ? 'border border-blue-900' : ''} pe-10`}>
              <div className='inline-flex gap-2 flex-row w-full'>
                <button 
                  type='button' 
                  onClick={() => {
                    navigate(`/dropdown/new`);
                  }}
                  className={`py-2.5 px-6 text-sm rounded-md uppercase
                      cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100
                      font-semibold text-center shadow-xs `}>
                      New Dropdown
                  </button>
              </div>
            </div>

            { isPending 
                ? ' Loading dropdowns'
                : <div className="container mx-auto py-10">
                    <h4>{data.length} dropdowns found</h4>
                    <DataTable columns={Columns} data={data} />
                </div>
            }
        </div>
    )
}

export default DropdownsPage;