import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

//https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-ui?uiType=dropdown&id=brand-category

// const BASE_URL = 'https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com';
// const ENV = 'dev';
// const API = 'foodie-ui';
// const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiIiwidHlwZSI6InN1cGVyIiwidmFsdWUiOiIwMDAwMDAiLCJpYXQiOjE2OTA1NDMxNDR9.2Ao23p2qWE5YvRF4DbspkiCpX1LCGg2ew_UpSYMkIts';

/* headers: {
    Authorization: `Bearer ${AuthToken}`
  }

  return axios.get(`${BASE_URL}/${ENV}/${API}?uiType=${uiType}&id=${id}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
 */
async function fetchUIResource() {
    //`https://9mfs8zytng.execute-api.ap-south-1.amazonaws.com/default/resource?type=config&id=brand`
    
    return axios.get('https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api?uiType=dropdown&id=brand-category', {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
    
}

const TanQueryShowcase = () => {
    

    const { isPending, error, data } = useQuery({
        queryKey: ['headers'],
        queryFn: async () => {
            const data = await fetchUIResource();
            return data.data;
        },
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message;

    return (
        <div>
        <h1>{JSON.stringify(data)}</h1>
        </div>
    );
}
export default TanQueryShowcase;