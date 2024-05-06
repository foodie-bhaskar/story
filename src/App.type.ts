export interface AppProps {
    title: string;
}

export interface Option {
    name: string,
    value: string,
    action?: Function
}

export interface ListOptions {
    options: Option[]
}
