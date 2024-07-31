import { FC, useState, useEffect } from 'react';
import PackageList from './PackageList';
import PackageQtyForm from './PackageQtyForm';
import { PackageQtyOtps } from "@/App.type";
import TransButton from '@/core/TransButton';

type PdtPkg = {
    data?: PackageQtyOtps[],
    update: Function,
    readOnly?: boolean
}

const ProductPackages: FC<PdtPkg> = ({ data, update, readOnly }) => {
    let borderOn = false;
    // borderOn = true;
    
    const [showForm, setShowForm] = useState<boolean>(false);
    const [packages, setPackages] = useState<PackageQtyOtps[]>(data || []);
    const [errorMessage, setErrorMessage] = useState<string>();

    const addPackage = (pkgQty: PackageQtyOtps) => {
        let { packageId, name } = pkgQty.package;

        const packageIds = packages.map(pq => pq.package.packageId);

        if (packageIds.includes(packageId)) {
            setErrorMessage(`Package ${packageId}-${name} is already added`);
        } else if (pkgQty.qty > 100) {
            setErrorMessage(`Package Quantity cannot be more than 100`);
        } else {
            setShowForm(false);
            setPackages([...packages, pkgQty]);
            setErrorMessage('');
            update([...packages, pkgQty])
        }
    }

    useEffect(() => {
        if (data && data.length) {
            setPackages(data);
        }
    }, [data])

    return (<div className={`${borderOn ? 'border border-yellow-500': ''}`}>
        {!readOnly && !showForm && <div className='inline-flex gap-2 flex-row w-full space-around ps-10 -mt-2 mb-2'>
            <TransButton label='Assign Package & Quantity' update={() => setShowForm(true)} />
        </div>}
        {showForm && <PackageQtyForm action={addPackage} errorMessage={errorMessage} />}

        <PackageList packages={packages} readOnly={readOnly} />            
    </div>)
}

export default ProductPackages;