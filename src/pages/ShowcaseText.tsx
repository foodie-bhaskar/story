import { useState, useEffect } from 'react';
import FoodieText from '../core/FoodieText';

const ShowcaseText = () => {
    const [optionName, setOptionName] = useState<string>('Millet');
    const [optionValue, setOptionValue] = useState<string>('');

    useEffect(() => {
        function a() {
            setTimeout(() => {
                // alert('Bhaskar');
                setOptionName('Gogoi')
                setOptionValue('Bhaskar')
            }, 3000);

            setTimeout(() => {
                // alert('Bhaskar');
                setOptionName('Gogoi Bhaskar')
                setOptionValue('Bhaskar Gogoi')
            }, 6000);
        }

        // a();
    })

    return (<div className='border border-blue-600 bg-white sm:w-3/6 mx-auto'>
        <h1 className='uppercase w-fit'>Toggle Action Showcase</h1>
        <div className="flex flex-col py-4 w-full gap-4 border border-blue-600 pe-10 mx-auto">
            <div className="sm:w-1/6'">
                <FoodieText label='Option' fieldName='option-name' action={setOptionName} value={optionName}  />
            </div>

            <div className="sm:w-1/6'">
                <FoodieText label='Value' fieldName='option-val' value={optionName} />
            </div>

            <div className="sm:w-1/6'">
                <FoodieText label='Same Value' fieldName='option-val' value={optionName} readOnly={true}/>
            </div>
            
        </div>
  </div>)
}

export default ShowcaseText;