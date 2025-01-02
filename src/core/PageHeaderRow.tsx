import { ReactNode, FC } from "react";

interface PageHeaderProps {
    pageName: string,
    borderOn?: boolean,
    children?: ReactNode;
}
  
const PageHeaderRow: FC<PageHeaderProps> = ({ pageName, borderOn, children }) => {
    return <div className={`${borderOn ? 'border border-pink-700': ''} flex flex-row justify-between w-full items-center`}>
        <h1 className="text-lg text-slate-600 font-semibold uppercase">{pageName}</h1>
        {children && <div className={`${borderOn ? 'border border-green-700': ''}`}>
          {children}
        </div>}
    </div>
}

export default PageHeaderRow;