export interface AppProps {
    title: string;
}

export interface Option {
    name: string,
    value: string,
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

export interface FormAction {
    action: Function
}

export interface DropdownOpts {
    name: string,
    assetLinked?: string,
    selectedValue?: string,
    global?: boolean,
    options: Option[],
    selectedCallback?: Function
}

export interface CheckboxOpts {
    label: string,
    info?: string
    checkFn: Function,
    checked: boolean
}
