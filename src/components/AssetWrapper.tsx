import { FC } from 'react';
import { WrapperProps, AssetTypes } from "@/App.type";
import PackageForm from './PackageForm';

const Wrapper: FC<WrapperProps> = ({ type, content }) => {
    switch (type) {
        case AssetTypes.PACKAGE:
            // alert(`WP : ${JSON.stringify(content.package)}`);
            return content.package ? <PackageForm formType={content.package.formType} pkg={content.package.pkg} />: null;
        default:
            return null; // Or handle an invalid type
    }
}

export default Wrapper;