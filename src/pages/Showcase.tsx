import { useState, useEffect } from 'react';
import ProductItems from '@/components/ProductItems';
import ProductPackages from '@/components/ProductPackages';
import { ItemQtyOtps } from '@/App.type';

const Showcase= () => {
    let borderOn = false;
    // borderOn = true;

    const [items, setItems] = useState<ItemQtyOtps[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [packages, setPackages] = useState([]);
    

    const [productName] = useState('Bhindi Masala with 3 Phulka Roti');
    const [valid, setValid] = useState(true);

    const addItemQty = (items: ItemQtyOtps[], tags: string[]) => {
        setItems(items)
        setTags(tags);
    }

    useEffect(() => {
        if (items.length && packages.length) {
            setValid(true);
        } else {
            setValid(false);
        }

    }, [items, packages])


    return (<div className='lg-w-full mx-auto'>
        <div className="text-center">
            <h2 className="text-xl uppercase font-semibold leading-7 text-gray-500 mt-10 mx-auto">Unmapped Product</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 italic">
                Assign items with quantity and packaging details for this product
            </p>
        </div>

        <div className='flex flex-row px-10 w-full rounded py-4 gap-10 items-center my-4 mx-10 '>
            <span className='inline-block text-xl text-slate-500 font-semibold h-10 mt-2'>{productName}</span>

            <button 
                type='button' 
                disabled={false}
                onClick={() => {
                    const body = {
                        items,
                        packages,
                        tags
                    }
                    alert(JSON.stringify(body))
                }}
                className={`py-2.5 px-6 text-sm rounded-md uppercase h-10
                    ${valid
                          ? 'cursor-pointer text-indigo-50  bg-indigo-500 transition-all duration-500 hover:bg-indigo-700'
                          : 'cursor-not-allowed text-gray-300 bg-gray-100 '}
                        font-semibold text-center shadow-xs rounded`}>
                    Save
                </button>
        </div>

        <div className={`${borderOn ? 'border-red-800': ''} mt-10 flex flex-row h-svh min-w-max`}>
            <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-6/12 border-r border-cyan-900 px-6`}>
                <ProductItems update={addItemQty}/>
            </main>
            <aside className=" basis-5/12 ps-10">
                <ProductPackages update={setPackages}/>
            </aside>
        </div>
        
    </div>)
}

export default Showcase;