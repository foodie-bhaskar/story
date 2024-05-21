import ToggleAction from '../components/ToggleAction';

const ShowExample = ({ toggle, heading, description  }) => {
    const { child, fieldName, toggleFor, info, active, readOnly, activeValue } = toggle;
    return (
    <div className='mt-10  min-w-max'>
        <h6 className='text-lg uppercase text-gray-500 ps-10'>{heading}</h6>
        <p className='my-2 ps-10 font-light text-gray-400'>{description}</p>
        <ToggleAction 
          fieldName={fieldName} toggleFor={toggleFor} info={info} activeValue={activeValue}
          child={child} active={active} readOnly={readOnly} />
    </div>
    )
}

const ShowcaseToggle = () => {
    const toggleEx1 = {
      fieldName: 'value',
      toggleFor: 'Value',
      info: 'keep value same as the option name',
      child: {
        component: 'text',
        opts: {
          label: 'Value',
          fieldName: 'value'
        },
        placement: 'column',
        defaultShow: true
      },
      activeValue: 'Wet Gravy'
    }

    const toggleEx1b = { ...toggleEx1, active: true };
    const toggleEx1c = { ...toggleEx1, readOnly: true, active: true };

    const toggleEx4 = {
      fieldName: 'cascade',
      toggleFor: 'Visibility',
      info: 'is part of cascade dropdown',
      child: {
        component: 'dropdown',
        opts: {
          options: [
            { name: 'Brand Category', value: 'brand-category'},
            { name: 'Brand Format', value: 'brand-format'}
          ],
          name: 'Cascade'
        },
        placement: 'row'
      }
    }

    const toggleEx4b = { ...toggleEx4, active: true };
    const toggleEx4c = { ...toggleEx4, active: true, activeValue: 'brand-format' };
    const toggleEx4d = { ...toggleEx4, active: true, readOnly: true, activeValue: 'brand-format' };

    return (<div className='border border-blue-600'>
        <h1 className='uppercase w-fit'>Toggle Action Showcase</h1>
        <div className="flex flex-col py-4 w-full gap-4 border border-blue-600 pe-10">
          <div className="flex flex-row border-blue-600 justify-start gap-4">
            <ShowExample 
              toggle={toggleEx1} 
              description="As a part of form with duplicate field value, show below"
              heading="Textbox >> below" />
            <ShowExample 
              toggle={toggleEx1b} 
              description="by default active state"
              heading="Textbox >> below" />
            <ShowExample 
              toggle={toggleEx1c} 
              description="readonly or disabled mode"
              heading="Textbox >> below" />
            
        </div>

        <div className="flex flex-row border-blue-600 justify-between">
            
          <ShowExample 
              toggle={toggleEx4} 
              description="Allow to be a part of cascade dropdown, off"
              heading="Dropdown >> right" />

            <ShowExample 
              toggle={toggleEx4b} 
              description="cascade dropdown, on, nothing selected"
              heading="Dropdown >> right" />
        </div>

        <div className="flex flex-row border-blue-600 justify-between">
            
            <ShowExample 
                toggle={toggleEx4c} 
                description="cascade dropdown, on and selected"
                heading="Dropdown >> right" />
  
              <ShowExample 
                toggle={toggleEx4d} 
                description="On, pre selected and readonly"
                heading="Dropdown >> right" />
          </div>
      </div>
  </div>)
}

export default ShowcaseToggle;