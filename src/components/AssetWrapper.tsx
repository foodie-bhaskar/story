import { FC } from 'react';
import { WrapperProps, AssetTypes } from "@/App.type";
import PackageForm from './PackageForm';
import ItemForm from './ItemForm';

const Wrapper: FC<WrapperProps> = ({ type, content }) => {
    switch (type) {
        case AssetTypes.PACKAGE:
            // alert(`WP : ${JSON.stringify(content.package)}`);
            return content.package ? <PackageForm formType={content.package.formType} pkg={content.package.pkg} callbackFn={content.package.callbackFn}/>: null;
        case AssetTypes.ITEM:
            // alert(`WP : ${JSON.stringify(content.package)}`);
            return content.item ? <ItemForm formType={content.item.formType} item={content.item.item} callbackFn={content.item.callbackFn}/>: null;
        default:
            return null; // Or handle an invalid type
    }
}

export default Wrapper;