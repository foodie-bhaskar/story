import { FC, useState, useEffect } from "react";
import { FieldOpts, DropdownOpts, DYNA_TYPE, SequenceChoiceOpts, ToggleCore, DynamicFieldProps, Option, Placement } from "@/App.type";
import SeqChoice from "@/core/SeqChoice";
import FoodieToggle from "@/core/FoodieToggle";
import FoodieText from "@/core/FoodieText";
import Dropdown from "@/core/Dropdown";

interface ToggleComplexProps {
  toggle: ToggleCore,
  placement?: Placement,
  component: DynamicFieldProps,
  offComponent?: DynamicFieldProps,
  linkedExternalVal?: string | Option[] | number,
  isLoading?: boolean
}

const DynamicField: React.FC<DynamicFieldProps> = ({ type, fieldProps }) => {
  switch (type) {
    case DYNA_TYPE.TEXT:
      return <FoodieText {...(fieldProps as FieldOpts)} />;
    case DYNA_TYPE.DROPDOWN:
      return <Dropdown {...(fieldProps as DropdownOpts)} />;
    case DYNA_TYPE.CHOICE:
      return <SeqChoice {...(fieldProps as SequenceChoiceOpts)} />
    default:
      return <p>Not supported {type}</p>; 
  }
};

const updateProps = (type: DYNA_TYPE, props: DynamicFieldProps["fieldProps"], preset?: string | Option[] | number):
FieldOpts | DropdownOpts | SequenceChoiceOpts => {
  if (preset) {
    switch (type) {
      case DYNA_TYPE.TEXT:
        let textFields = props as FieldOpts;
        if (typeof preset == 'string') {
          return { ...textFields, value: preset } as FieldOpts;
        } else {
          throw Error(`Preset value is not of correct type: [ ${typeof preset} ]`);
        }

      case DYNA_TYPE.DROPDOWN:
        let dropdownFields = props as DropdownOpts;
        if (preset instanceof Array) {
          return { ...dropdownFields, options: preset }
        } else {
          throw Error(`Preset value is not of correct type: [ Array ]`);
        }

      case DYNA_TYPE.CHOICE:
        let choiceFields = props as SequenceChoiceOpts;
        if (typeof preset == 'number') {
          return { ...choiceFields, selectedValue: `${preset}` } as SequenceChoiceOpts
        } else {
          throw Error(`Preset value is not of correct type: [ ${typeof preset} ]`);
        }

      default:
        throw Error(`Type ${type} not supported`);
    }
  } else {
    return props;
  }
}

const ToggleComplex: FC<ToggleComplexProps> = ({ toggle, component, offComponent, placement, linkedExternalVal, isLoading }) => {
  let borderOn = false;
  // borderOn = true;

  const [isRow] = useState<boolean>(placement ? placement.valueOf() === 'row':  true);
  const { toggleName, state, info, onToggleChange, readOnly } = toggle;
  const [isOn, setIsOn] = useState<boolean>(!!state.valueOf());
  const [props, setProps] = useState<FieldOpts | DropdownOpts | SequenceChoiceOpts>(updateProps(component.type, component.fieldProps, linkedExternalVal));

  const activate = (isToggleOn: boolean) => {
    setIsOn(isToggleOn);
    if (onToggleChange && typeof onToggleChange === 'function') {
      onToggleChange(isToggleOn);
    }
  }

  useEffect(() => {
    if (linkedExternalVal) {
      const up = updateProps(component.type, component.fieldProps, linkedExternalVal);
      setProps(up);
    }
  }, [linkedExternalVal, component]);

  return (<div className={`min-w-full flex flex-col group/toggle ${borderOn ? 'border border-blue-700': ''}`}>
    <label className="block text-sm font-medium leading-6 text-gray-600">
        {toggleName}
    </label>
    <div className={`${borderOn ? 'border border-green-400': ''} mt-2 md:min-w-full w-full flex 
        ${isRow ? 'flex-row  gap-10': 'flex-col gap-1'}`}>
      <FoodieToggle label={info} active={!!state.valueOf()} action={activate} readOnly={readOnly} fullWidth={isRow} />
      <div className={`${isRow && component.type == DYNA_TYPE.CHOICE ? '-mt-5': ''}`} >
        {isLoading && <>loading...</>}
        {!isLoading && isOn && component && <DynamicField type={component.type} fieldProps={props} />}
        {!isLoading && !isOn && offComponent && <DynamicField type={offComponent.type} fieldProps={offComponent.fieldProps} />}
      </div>
    </div>
  </div>);
}

export default ToggleComplex;