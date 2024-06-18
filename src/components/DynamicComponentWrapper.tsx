import { ReactNode, FC } from 'react';

interface DynamicComponentWrapperProps {
  component: FC<any>;
  componentProps: any; 
  children?: ReactNode; 
}

const DynamicComponentWrapper: FC<DynamicComponentWrapperProps> = ({
  component: Component,
  componentProps,
  children,
}) => {
  return (
    <div className="dynamic-component-wrapper">
      <Component {...componentProps} /> {/* Render the dynamic component */}
      {children} {/* Optionally include children elements */}
    </div>
  );
};

export default DynamicComponentWrapper;
