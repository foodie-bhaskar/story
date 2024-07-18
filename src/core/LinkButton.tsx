import { FC } from 'react';
// import { useNavigate } from 'react-router-dom';

type ButtonProps = {
    label: string,
    to: string,
    nav: Function
}
const LinkButton: FC<ButtonProps> = ({ label, to, nav }) => {
    // const navigate = useNavigate();
    return <button 
        type='button' 
        onClick={() => {
            // alert(to)
            nav(to)
        }}
        className={`py-2.5 px-4 text-sm rounded uppercase -ml-4 font-regular text-center shadow-xs bg-white 
            cursor-pointer text-indigo-500  transition-all duration-500 hover:bg-indigo-200`}>
        {label}
    </button>

}

export default LinkButton;