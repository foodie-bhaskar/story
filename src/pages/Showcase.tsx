import ProductItems from '@/components/ProductItems';

const Showcase= () => {
    let borderOn = false;
    // borderOn = true;


    return (<div className='lg-w-full mx-auto px-10'>
        <p>Showcase Item product</p>

        <div  className={`${borderOn ? 'border-red-800': ''} mt-10 flex flex-row min-h-10 min-w-max justify-between`}>
            <main role="main" className={`${borderOn ? 'border border-yellow-500': ''} basis-3/5 max-w-[600px]`}>
                <ProductItems />
            </main>
            <aside className=" basis-2/5 border-l-2 border-cyan-900">
                <ProductItems />
            </aside>
        </div>
        
    </div>)
}

export default Showcase;