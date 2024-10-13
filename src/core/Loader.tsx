import { FC, useState } from "react";

interface LoaderOpts {
    size?: number
}

const Loader: FC<LoaderOpts> = ({ size }) => {
    const DEFAULT_SIZE = 12;

    const [loaderSize] = useState(size || DEFAULT_SIZE);
    return <div
        className={`inline-block h-${loaderSize} w-${loaderSize} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
        role="status">
        <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
    </div>
}

export default Loader;