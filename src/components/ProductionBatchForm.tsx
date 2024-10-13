import { FC, useEffect, useState } from "react";
import { ProductionBatchCache, PacketItemQty, APIResult } from "@/App.type";
import PacketQty from '@/core/PacketQty';
import TransButton from '@/core/TransButton';
import AssetLoaderList from "@/components/AssetLoaderList";
import FormHeader from "@/components/FormHeader";

interface ProductionBatchFormOpts {
    batchNo: number,
    savedBatch?: ProductionBatchCache, 
    update: Function,
    close: Function,
    result?: APIResult
}

const PacketQtyRow: FC<PacketItemQty> = ({ itemId, name, qty }) => {
    let borderOn = false;
    // borderOn = true;

    const MAX_QTY = 250;

    return <div key={itemId} className={`${borderOn ? 'border border-pink-700': ''} flex flex-col justify-start w-full items-center`}>
        <PacketQty itemId={itemId} name={name} qty={qty}  />
        <div className={`${borderOn ? 'border border-green-700': ''} w-full px-2 -my-2`}>
            <div className="overflow-hidden h-1 text-xs flex bg-green-200">
            <div style={{ width: `${Math.floor((qty*100)/MAX_QTY)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-700"></div>
            </div>
        </div>
    </div>
}

const ItemQtyForm: FC<{data: PacketItemQty, add: Function, cancel: Function }> = ({ data, add, cancel }) => {
    let borderOn = false;
    borderOn = true;

    const MAX_QTY = 250;

    const active = {
        btn: 'bg-blue-500',
        textBG: 'bg-slate-500 text-white',
        nameBG: 'bg-blue-50'
    }

    const [val, setVal] = useState(`${data.qty == 0 ? '': data.qty}`);

    const update = (e: any) => {
        // alert(e);
        setVal(e.target.value);
    }

    useEffect(() => {
        setVal(`${data.qty == 0 ? '': data.qty}`);
    }, [data])

    return <div className={`${borderOn ? 'border border-gray-300': ''} bg-white flex flex-col 
        gap-6 justify-start w-full items-center rounded pb-4`}>
        <div className={`w-full min-h-14 
            flex flex-col ${active.nameBG} 
            rounded-t `} >
            <div className={
                `${active.textBG}
                w-full rounded-t text-center`}>{data.itemId}</div>
            <div className="text-center py-2">
                <span className={`text-blue-800 font-light inline-block w-fit text-lg`}>{data.name}</span>
            </div>
        </div>

        <div className={`mt-2 w-full'}`}>
            <input
                type={'number'}
                autoFocus={true}
                placeholder="0"
                className={`block w-36 rounded border-0 py-1.5 p-4
                    shadow-sm font-bold
                    placeholder:text-gray-300 text-gray-600 
                    focus:ring-2 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-400
                    lg:text-6xl xl:leading-6 text-right`}
                value={val}
                min={1}
                max={MAX_QTY}
                onChange={update}
            />
        </div>
        <button 
          type='button' 
          disabled={!val}
          onClick={() => {
            add({
                ...data, qty: parseInt(val)
            })
          }}
          className={`py-2 px-6 text-sm rounded-md uppercase w-36
              ${val && parseInt(val) > 0 && parseInt(val) <= MAX_QTY 
                ? 'cursor-pointer text-indigo-500  bg-indigo-50 transition-all duration-500 hover:bg-indigo-100'
                : 'cursor-not-allowed text-gray-300 bg-gray-100'}
              font-semibold text-center shadow-xs `}>
              Add Item
        </button>

        {parseInt(val) > MAX_QTY && <p className="bg-red-500 text-center text-white font-semibold px-4 py-2 rounded w-fit">Max: 250 only</p>}

        <TransButton label='Clear' update={cancel} />
    </div>
}


const PacketItemList:FC<{ data: PacketItemQty[] }> = ({ data })  => {

    let borderOn = false;
    // borderOn = true;

    return (
        <div className={` ${borderOn ? 'border border-gray-700': ''} `}>
           <ul className='flex flex-col min-h-72 rounded-lg w-full gap-2'>
                {data.map(pkt => <PacketQtyRow {...pkt} key={pkt.itemId} />)}
            </ul>
        </div>
    );
}

interface ItemIdQtyMap {
    [key: string]: PacketItemQty;
}


const ProductionBatchForm: FC<ProductionBatchFormOpts> = ({ batchNo, update, close, result, savedBatch }) => {
    let borderOn = false;
    borderOn = true;

    const [batch, setBatch] = useState<ProductionBatchCache | undefined>(savedBatch);

    const [currentItemQty, setCurrentItemQty] = useState<PacketItemQty | undefined>();
    const [itemListMap, setItemListMap] = useState<ItemIdQtyMap>({});

    const clearNClose = () => {
        setBatch(undefined);
        setCurrentItemQty(undefined);
        close();
    }

    const addToBatch = (data: PacketItemQty) => {
        // alert(JSON.stringify(data));
        setCurrentItemQty(undefined);

        let existing = itemListMap;

        /*
        batchNo: number,
        items: PacketItemQty[],
        batchPackets: number,
        batchTime: string,
        downloadLink?: string,
        linkExpiryTime?: number
        */
        existing[data.itemId] = data;
        setItemListMap(existing);
        setBatch({
            batchNo,
            items: Object.values(existing),
            batchPackets: Object.values(existing).reduce((acc, o) => acc + o.qty, 0),
            batchTime: (new Date()).toISOString()
        })
    }

    useEffect(() => {
        if (result && !result.error) {
            clearNClose();
        }

    }, [result]);

    useEffect(() => {
        if (savedBatch) {
            // alert(JSON.stringify(savedBatch));
            setBatch(savedBatch);

            const { items } = savedBatch;
            const previousMap = items.reduce((acc: ItemIdQtyMap, o: PacketItemQty) => {
                acc[`${o.itemId}`] = o;
                return acc;
            }, {});
            setItemListMap(previousMap)
        } else {
            setBatch(undefined);
        }

    }, [savedBatch]);

    return (<div className={`${borderOn ? 'border border-gray-300': 'bg-white'} min-h-40 h-fit rounded bg-green-50`}>
        <FormHeader close={clearNClose} batch={batch} isConfirm={true} />
        {result && result.done && result.error && <p className="rounded p-2 bg-white text-red-700 italic">{JSON.parse(result.error).message}</p>}
        {/* {result && result.done && result.error && <div className="border border-gray-400 rounded  bg-white p-2">
            <code className=" text-red-500 font-light">
            {JSON.parse(result.error).config.data}
        </code></div>} */}
        <div className="flex flex-row w-full min-h-40 mt-6 ps-0 gap-2 justify-between">
            <AssetLoaderList type={'item'} localFilter={{ value: '' }} assetFilter={{ field: 'PACKET', value: '1' }} 
                update={(selected: any) => {
                    const { assetId, name } = selected;
                    let current = { itemId: assetId, name, qty: 0 };
                    if (itemListMap && itemListMap[assetId]) {
                        current = { ...current, qty: itemListMap[assetId].qty }
                    }
                    
                    setCurrentItemQty(current);

                }} 
                classPart="basis-4/12 bg-white"
            />
            <div className=" h-30 basis-3/12 flex flex-col items-center">
                {currentItemQty && <ItemQtyForm data={currentItemQty} add={addToBatch} cancel={() => setCurrentItemQty(undefined)} />}

                {!currentItemQty && Object.keys(itemListMap).length > 0 
                    && <TransButton label='Finalize' update={() =>  update(batch)} showAsButton={true} theme="confirm" />}
            </div>
            <div className=" h-30 basis-5/12 -my-2 ">
                <PacketItemList data={Object.values(itemListMap).sort((a, b) => a.itemId - b.itemId)} />
            </div>
        </div>
    </div>)
}

export default ProductionBatchForm;