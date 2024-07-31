import { FC } from 'react';
import { ItemQtyOtps } from '../App.type';
import AssetQty from '@/core/AssetQty';

const ItemQty: FC<ItemQtyOtps> = ({ item, qty, readOnly, action, theme }) => {
    const { itemId, name } = item;


    return <AssetQty id={itemId} name={name} qty={qty} readOnly={readOnly} action={action} theme={theme} />

}
  
export default ItemQty;