import { FC, useState } from 'react';
import PackageList from './PackageList';
import PackageQtyForm from './PackageQtyForm';
import { PackageQtyOtps } from "@/App.type";

type PdtPkg = {
    data?: PackageQtyOtps[],
    update: Function
}

const ProductPackages: FC<PdtPkg> = ({ data, update }) => {
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

    return (<div className={`${borderOn ? 'border border-yellow-500': ''}`}>
        {!showForm && <div className='inline-flex gap-2 flex-row w-full space-around ps-10 -mt-2 mb-2'>
            <button 
                type='button' 
                onClick={() => {
                    setShowForm(true);
                }}
                className={`py-2.5 px-6 text-sm rounded uppercase
                    cursor-pointer text-indigo-500  bg-white transition-all duration-500 hover:bg-indigo-200
                    font-semibold text-center shadow-xs `}>
                Assign Package & Quantity
            </button>
        </div>}
        {showForm && <PackageQtyForm action={addPackage} errorMessage={errorMessage} />}

        <PackageList packages={packages} />            
    </div>)
}

export default ProductPackages;