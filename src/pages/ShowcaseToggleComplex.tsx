import { useState, useEffect } from 'react';
import FoodieText from '../core/FoodieText';
import ToggleComplex from '../components/ToggleComplex';

const ShowcaseToggleComplex = () => {
    const [optionName, setOptionName] = useState<string>('Millet');
    const [optionValue, setOptionValue] = useState<string>('');
    
    return (<div className='border border-blue-600 bg-white sm:w-3/6 mx-auto'>
        <h1 className='uppercase w-fit'>Toggle Complex Showcase</h1>
        <div className="flex flex-col py-4 w-full gap-4 border border-blue-600 pe-10 mx-auto">
            <div className="sm:w-1/6">
                <ToggleComplex initialComponent="FoodieText" />
            </div>
        </div>
    </div>)
}

export default ShowcaseToggleComplex;