import { FC } from 'react';

export interface AppProps {
    title: string;
}

export enum ToggleState {Off = 0, On = 1};
export enum Placement { BELOW = 'column', RIGHT = 'row' };
export enum Component { TEXT = 'text', DROPDOWN = 'dropdown', SEQCHOICES = 'seqchoices' };

export interface SupportedComponents {
    [key: string]: FC<FieldOpts> | FC<DropdownOpts> | FC<SequenceChoiceOpts>;
}

export interface Child {
    component: keyof SupportedComponents,
    opts: FieldOpts | DropdownOpts | SequenceChoiceOpts
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
    readOnly?: boolean,
    fullWidth?: boolean
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
    size?: string,
    selectedValue?: string,
    selectedCallback?: Function
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
    linkedExternalVal?: string | Option[] | number,
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

export interface Weight {
    main: number,
    gravy: number,
    total: number
}

export interface WeightComboOpts {
    update: Function
}

export interface CascadeComboOpts {
    cascade: string,
    hierarchy: string[],
    update: Function
}

export interface Stage {
    label: string,
    field: string,
    value?: number
}

export interface BuildUpComboOpts {
    name: string,
    stages: Stage[],
    update: Function
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
    position?: string,
    size: number,
    selectedValue?: string,
    selectedCallback: Function,
    step?: number,
    readOnly?: boolean
}

export interface ChoiceOpts {
    label: string,
    position?: string,
    choices: string[],
    selectedValue?: string,
    selectedCallback: Function
}

export interface Weight {
    total: number,
    main: number,
    gravy: number
}

export interface ItemOpts {
    id: string,
    vendor: string,
    isPacket: boolean,
    isVeg: boolean,
    cuisineCombo: Option[],
    typeCombo: Option[],
    costBuildup: Option[],
    weight: Weight
}

export interface AssetItem {
    assetId: string,
    itemId: string,
    name: string
}

export interface PackageAsset {
    compartments: number,
    packagingCost: number,
    volume: number,
    containerType: string,
    containerSize: string,
    imageUrl: string,
    packagingTypeCombo: Option[]
}

export enum DYNA_TYPE {
    TEXT = 'text',
    DROPDOWN = 'dropdown',
    CHOICE = 'sequence-choice'
}

export interface DynamicFieldProps {
    type: DYNA_TYPE
    fieldProps: FieldOpts | DropdownOpts | SequenceChoiceOpts; // Flexible props based on type
}

export interface Item {
    itemId: string,
    name: string
}

export interface ItemQtyOtps {
    item: Item,
    qty: number
}
