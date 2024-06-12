import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { capitalizeWords } from '@/lib/utils';
import { CascadeComboOpts, Option } from '../App.type';
import Dropdown from '../core/Dropdown';
import { Slash } from 'lucide-react';

async function fetchResourcesForCascade(cascade: string) {
    const url = 'https://4ccsm42rrj.execute-api.ap-south-1.amazonaws.com/dev/foodie-api';
    return axios.get(`${url}?uiType=dropdown&filterName=CASCADE&filterValue=${cascade}`, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJoYXNrYXIiLCJuYW1lIjoiQmhhc2thciBHb2dvaSIsInR5cGUiOiJzdXBlciIsInZhbHVlIjoiMDAwMDAwIiwiaWF0IjoxNzE1ODQ4Mzc0fQ.DArYQmB65k3-OIBkHDmIKbPLIFVqlfBg0VkOOgp3zVs'
        }
    })
}

const CascadeCombo: FC<CascadeComboOpts> = ({ cascade, hierarchy, update }) => {
    const borderOn = false;
    // const borderOn = true;

    const basisCss = hierarchy.length == 2? 'basis-1/3': `basis-1/${hierarchy.length}`;

    const [selection, setSelection] = useState<Option[]>([]);

    const { isPending, error, data } = useQuery({
        queryKey: ['dropdown', 'cascade', cascade],
        queryFn: async () => {
            const data = await fetchResourcesForCascade(cascade);
            // const rows = data.data.result.map(item => ({ ...item, options: item.options.length}));
            const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
            // alert(JSON.stringify(rows.map(r => r.uiId)));
            const sorted = [];

            for (let i = 0; i < rows.length; i++) {
                const item = rows[i]
                const comboName = item.uiId;
                
                const hierarchyIdx = hierarchy.findIndex(hItem => hItem == comboName);
                // alert(`${JSON.stringify(hierarchy)} :: ${comboName} >> [${hierarchyIdx}]`)
                sorted[hierarchyIdx] = item;
            }

            // alert(JSON.stringify(rows));
            return sorted;
        },
        staleTime: 60 * 1000
    });

    useEffect(() => {
        // if (selection && selection.)
        update(selection);
    }, [selection]);

    return (<div className={`${borderOn ? 'border border-green-800' : ''}`}>
        {/* <p>Preparing cascade dropdowns for group : ${cascade}</p>

        <p>Hierarchy: {JSON.stringify(hierarchy)}</p> */}

        {isPending 
            ? 'Fetching ....'
            : <div className={`flex flex-row`}>
                {data && data.map((ddn, i) => <div className={basisCss}>
                    <Dropdown 
                        options={[{ value: '', name: ' --- please select ---'}, ...ddn.options]} 
                        selectedCallback={(valObj: Option) => {
                            // alert(valObj.value);
                            let clone: Option[] = [...selection];
                            clone[i] = { name: ddn.uiId, value: valObj.value };
                            setSelection(clone);
                        }} 
                        name={capitalizeWords(ddn.uiId)}
                        readOnly={i > 0 && !selection[i - 1]}
                    />
                </div>)}
            </div>
        }    
    </div>)
}

export default CascadeCombo;