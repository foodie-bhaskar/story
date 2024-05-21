export interface AppProps {
    title: string;
}

export interface Child {
    component: string,
    opts: FieldOpts | DropdownOpts,
    placement?: string,
    defaultShow?: boolean
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
    optionAction: Function
}

export interface FieldOpts {
    label: string,
    fieldName: string,
    active?: boolean
    action?: Function,
    value?: string,
    readOnly?: boolean
}

export interface CoreFieldOpts {
    type: string,
    fieldName: string,
    label: string,
}

export interface ToggleActionOpts {
    fieldName: string,
    toggleFor: string,
    active?: boolean,
    info: string,
    child: Child,
    readOnly?: boolean,
    activeValue?: string
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
    options: Option[],
    callbackFn: Function
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
