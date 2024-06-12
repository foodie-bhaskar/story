import SeqChoice, { BASE_SEQCHOICE_OPTS } from '../core/SeqChoice';

const ShowcaseSeq = () => {
    
    return (<div className='border border-blue-600 bg-white sm:w-3/6 mx-auto'>
        <h1 className='uppercase w-fit'>Seq choice example</h1>
        <div className="flex flex-col py-4 w-full gap-4 border border-blue-600 pe-10 mx-auto">
            <SeqChoice
            label={BASE_SEQCHOICE_OPTS.label}
            type={BASE_SEQCHOICE_OPTS.type} 
            size={BASE_SEQCHOICE_OPTS.size} 
            step={3}
            selectedValue={BASE_SEQCHOICE_OPTS.selectedValue}
            selectedCallback={BASE_SEQCHOICE_OPTS.selectedCallback} 
            />
            
        </div>
  </div>)
}

export default ShowcaseSeq;