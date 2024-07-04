import { FC, useState, useEffect } from 'react';
import { PackageQtyOtps } from '../App.type';
import PackageQty from '@/core/PackageQty';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

type PackageList = {
    packages:  PackageQtyOtps[],
    readOnly?: boolean
}

const PackageList: FC<PackageList> = ({ packages, readOnly }) => {

    const [current, setCurrent] = useState<PackageQtyOtps[]>(packages);
    const uxHide = true;

    useEffect(() => {
        setCurrent(packages);
    }, [packages])

    return (
        <div className="sm:container sm:mx-auto px-4">
            <h1 className='mb-4 text-sm font-bold text-gray-500 uppercase'>Packages</h1>
            {current.length == 0 && <h1 className='mb-4 italic font-light text-gray-500 text-sm'>No items</h1> }
            
            {!uxHide && current.length > 0 && <div className='text-gray-400 mb-2 items-center sm:mx-auto ps-11 pe-7 rounded-lg max-w-lg h-14 flex justify-between border-2'>
                {current.length} mapped
                <ChevronUpIcon className='size-6 '/>
            </div>}

            {current.length > 0 && <ul className='divide-y divide-gray-200 border rounded-lg sm:mx-auto max-w-lg ps-10'>
                {current.map(o => <PackageQty package={o.package} qty={o.qty} readOnly={readOnly}/>)}
            </ul>}
        </div>
    );
}
  
export default PackageList;
;