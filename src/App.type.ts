export interface AppProps {
    title: string;
}

export enum ToggleState {Off = 0, On = 1};
export enum Placement { BELOW = 'column', RIGHT = 'row' };
export enum Component { TEXT = 'text', DROPDOWN = 'dropdown' };

export interface Child {
    component: Component,
    opts: FieldOpts | DropdownOpts
}

export interface Option {
    name: string,
    value: string,
    action?: Function,
    readOnly?: boolean
}

export interface ToggleOpts {
    label: string,
    active?: boolean
    action?: Function,
    readOnly?: boolean
}

export interface ListOptions {
    options: Option[],
    optionAction: Function,
    readOnly?: boolean
}

export interface FieldOpts {
    label: string,
    fieldName: string,
    active?: boolean
    action?: Function,
    value?: string,
    readOnly?: boolean,
    size?: string
}

export interface CoreFieldOpts {
    type: string,
    fieldName: string,
    label: string,
}

export interface ToggleCore {
    fieldName: string,
    toggleName: string,
    state: ToggleState,
    info: string,
    onToggleChange?: Function,
    readOnly?: boolean
}

export interface ToggleChildren {
    on?: Child,
    off?: Child,
    placement?: Placement
}

export interface ToggleActionOpts {
    toggle: ToggleCore,
    children: ToggleChildren,
    linkedExternalVal?: string | Option[],
    isLoading?: boolean,
}

export interface FormAction {
    action: Function
}

export interface DropdownOpts {
    name: string,
    selectedValue?: string,
    options: Option[],
    selectedCallback?: Function,
    readOnly?: boolean
}

export interface DropdownFormOpts {
    name: string,
    cascade?: string,
    cascadeOptions: Option[],
    defaultValue?: string,
    readOnly?: boolean,
    options: Option[],
    callbackFn?: Function
}

export interface CheckboxOpts {
    label: string,
    info?: string
    checkFn: Function,
    checked: boolean
}

export interface SequenceChoiceOpts {
    label: string,
    type: string,
    size: number,
    selected?: string,
    callback: Function,
    step?: number
}
