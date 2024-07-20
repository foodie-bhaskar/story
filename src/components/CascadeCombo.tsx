import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { capitalizeWords } from '@/lib/utils';
import { CascadeComboOpts, Option } from '../App.type';
import Dropdown from '../core/Dropdown';
import { fetchResourcesForCascade } from '../api/api';

interface Data {
    uiId: string,
    selected?: string,
    options: Option[]
}

interface RowOpts {
    basisCss: string,
    data: Data[],
    update: Function,
    selection: Option[]
}

const DropdownRow: FC<RowOpts> = ({ data, basisCss, selection, update }) => {

    const [combo, setCombo] = useState(data);

    useEffect(() => {
        // alert(`Selection changed ${JSON.stringify(selection)}`);
        let temp = [...combo];

        for (let i = 0; i < temp.length; i++) {
            temp[i].selected = selection[i] ? selection[i].value: undefined;
        }
        // alert(`Combo updated ${JSON.stringify(temp.map(t => t.selected))}`);
        setCombo(temp);
    }, [selection]);

    return <div className={`flex flex-row`}>
    {combo.map((ddn, i) => <div className={basisCss} key={`${ddn.uiId}-${ddn.selected}`}>
        <Dropdown 
            options={[{ value: '', name: ' --- please select ---'}, ...ddn.options]} 
            selectedCallback={(valObj: Option) => {
                let clone: Option[] = [...selection];

                if (valObj.value) {
                    clone[i] = { name: ddn.uiId, value: valObj.value };
                } else {
                    clone.splice(i)
                }
                update(clone);
            }} 
            selectedValue={ddn.selected ? ddn.selected: ''}
            name={capitalizeWords(ddn.uiId)}
            readOnly={(i > 0 && !selection[i - 1])}
    />
    </div>)}
</div>
}

const CascadeCombo: FC<CascadeComboOpts> = ({ cascade, hierarchy, update, readOnly, value }) => {
    let borderOn = false;
    // borderOn = true;

    const basisCss = hierarchy.length == 2? 'basis-1/3': `basis-1/${hierarchy.length}`;

    const [selection, setSelection] = useState<Option[]>(value ? value: []);

    const { isPending, data } = useQuery({
        queryKey: ['dropdown', 'cascade', cascade],
        queryFn: async () => {
            const data = await fetchResourcesForCascade(cascade);
            const rows = data.data.result; //.map(item => ({ ...item, options: item.options.length}));
            const sorted = [];

            for (let i = 0; i < rows.length; i++) {
                const item = rows[i]
                const comboName = item.uiId;
                
                const hierarchyIdx = hierarchy.findIndex(hItem => hItem == comboName);
                sorted[hierarchyIdx] = item;
            }

            return sorted;
        },
        staleTime: 60 * 1000,
        enabled: !readOnly
    });

    useEffect(() => {
        update(selection);
    }, [selection]);

    return (<div className={`${borderOn ? 'border border-green-800' : ''}`}>
        {readOnly 
            ? (<div className={`flex flex-row`}>
                {value && value.map((ddn) => <div className={basisCss}>
                    <Dropdown 
                        options={[{ name: capitalizeWords(ddn.value), value: ddn.value}]}
                        selectedValue={ddn.value}
                        name={capitalizeWords(ddn.name)}
                        readOnly={readOnly}
                />
                </div>)}
            </div>)
            : (<>
                {isPending && 'Fetching ....'}
                {data && <DropdownRow data={data} selection={selection} basisCss={basisCss} update={setSelection} />}
            </>)
        }
    </div>)
}

export default CascadeCombo;