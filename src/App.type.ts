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

export interface Field {
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
    global?: boolean,
    options: Option[]
}
