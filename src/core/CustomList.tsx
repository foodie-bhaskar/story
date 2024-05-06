import { FC, useState } from 'react';
import { ListOptions } from '../App.type';
import CustomOption from './CustomOption';

const CustomList: FC<ListOptions> = ({ options }) => {

    const [current, setCurrent] = useState(options);

    const deleteOption = (value: string) => {
        // alert(`Deleting : ${value}`);

        setCurrent(current.filter(o => o.value !== value));
    }

    return (
        <div className='sm:container sm:mx-auto px-4'>
            <ul className='divide-y divide-gray-200 w-2/4'>
                {current.map(o => <CustomOption key={o.value} name={o.name} value={o.value} action={deleteOption} />)}
            </ul>
        </div>
    );
}
  
export default CustomList;