import { FC } from "react";
import { ProductionBatchCache, PacketItemQty } from "@/App.type";
import PacketQty from '@/core/PacketQty';

const PacketQtyRow: FC<PacketItemQty> = ({ itemId, name, qty}) => {
    let borderOn = false;
    // borderOn = true;

    const MAX_QTY = 180;

    return <div key={itemId} className={`${borderOn ? 'border border-pink-700': ''} flex flex-row justify-start w-full items-center `}>
        <PacketQty itemId={itemId} name={name} qty={qty}  />
        <div className={`${borderOn ? 'border border-green-700': ''} w-full mx-4`}>
            <div className="overflow-hidden h-6 text-xs flex rounded bg-green-100">
            <div style={{ width: `${Math.floor((qty*100)/MAX_QTY)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-700"></div>
            </div>
        </div>
    </div>
}


const PacketItemList:FC<{ data: PacketItemQty[] }> = ({ data })  => {

    let borderOn = false;
    // borderOn = true;

    return (
        <div className={`flex flex-row min-h-72 gap-1 ${borderOn ? 'border border-gray-700': ''} rounded`}>
           <ul className='rounded-lg w-full'>
                {data.map(pkt => <PacketQtyRow {...pkt} key={pkt.itemId} />)}
            </ul>
        </div>
    );
}

const BatchSummary: FC<ProductionBatchCache> = ({ batchNo, items }) => {
    let borderOn = false;
    // borderOn = true;

    console.log('batchNo', batchNo)

    // alert(JSON.stringify(items[0]))

    return (<div className={`${borderOn ? 'border border-green-700': ''}`}>
        {/* <div className='my-2 flex flex-row justify-between items-center'>
            <h4 className='text-slate-500 text-lg font-bold italic'>Batch # {batchNo} </h4>
        </div> */}
        <PacketItemList data={items} />
    </div>)
}

export default BatchSummary;