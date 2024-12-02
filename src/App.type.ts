import { FC } from 'react';

export interface AppProps {
    title: string;
}

export enum ToggleState {Off = 0, On = 1};
export enum Placement { BELOW = 'column', RIGHT = 'row' };
export enum Component { TEXT = 'text', DROPDOWN = 'dropdown', SEQCHOICES = 'seqchoices' };
export enum FormType { CREATE = 'create', EDIT = 'edit', VIEW = 'view' };

export enum AssetTypes { ITEM = 'item', PACKAGE = 'package' };

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
    type?: string,
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
    action: Function,
    errorMessage?: string
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
    wt: Weight,
    update: Function,
    readOnly?: boolean
}

export interface CascadeComboOpts {
    cascade: string,
    hierarchy: string[],
    update: Function,
    value?: Option[],
    readOnly?: boolean
}

export interface Stage {
    label: string,
    field: string,
    value?: number
}

export interface BuildUpComboOpts {
    name: string,
    stages: Stage[],
    update: Function,
    values?: Option[],
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
    checked: boolean,
    readOnly?: boolean
}

export interface SequenceChoiceOpts {
    label: string,
    position?: string,
    size: number,
    selectedValue?: string,
    selectedCallback: Function,
    step?: number,
    readOnly?: boolean,
    allowMore?: boolean
}

export interface ChoiceOpts {
    readOnly?: boolean,
    label: string,
    position?: string,
    choices: string[],
    selectedValue?: string,
    selectedCallback: Function
}

export interface SearchOpts {
    placeholder: string,
    callback: Function
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
    // consumptionCount: number,
    isVeg: boolean,
    cuisineCombo: Option[],
    typeCombo: Option[],
    costBuildup: Option[],
    weight: Weight,
    name?: string,
    assetId?: string
}

export interface AssetItem {
    assetId: string,
    itemId: string,
    name: string
}

export interface Cache {
    data: number,
    payload: ProductionBatchCache[],
    createdAt: string,
    updatedAt?: string,
    type: string
    group: string,
    distinctItems?: number
    isPending?: boolean
}

export interface PacketItemQty {
    itemId: number,
    name: string,
    qty: number
}

export interface ProductionBatchCache {
    batchNo: number,
    items: PacketItemQty[],
    batchPackets: number,
    batchTime: string,
    downloadLink?: string,
    linkExpiryTime?: number
}

export interface AssetPackage {
    assetId: string,
    packageId?: string,
    name: string
}

export interface AssetProduct {
    assetId: string
    packages: PackageQtyOtps[],
    items: ItemQtyOtps[],
    isVeg: boolean,
    id: string,
    name: string
}

export interface UpdatePackageAsset {
    compartments?: number,
    packagingCost?: number,
    volume?: number,
    imageUrl?: string,
    packagingTypeCombo?: Option[]
}

export interface PackageAsset {
    compartments: number,
    packagingCost: number,
    volume: number,
    containerType: string,
    containerSize: string,
    imageUrl: string,
    packagingTypeCombo: Option[],
    name?: string,
    assetId?: string
}

export interface PackageFormOpts {
    pkg?: PackageAsset,
    formType: FormType,
    callbackFn?: Function
}

export interface ItemFormOpts {
    formType: FormType,
    callbackFn?: Function
    item?: ItemOpts
}

export interface WrapperContent {
    package?: PackageFormOpts;
    item?: ItemFormOpts
}

export interface WrapperProps {
    type: AssetTypes;
    content: WrapperContent
}

export interface BrandProduct {
    brandName: string,
    productName: string,
    productType: string,
    brandTypeProductPrefix: string,
    variantSequence: number,
    createdAt: number,
    mapped?: boolean
}

export interface ProductAsset {
    assetId?: string
    packages: PackageQtyOtps[],
    items: ItemQtyOtps[],
    isVeg: boolean,
    id: string,
    name: string
}

export interface AbstractProductAsset {
    assetId: string
    packages: PackageQtyOtps[],
    items: ItemQtyOtps[],
    isVeg: boolean,
    name: string,
    createdAt: number,
    primary: string
}

export interface UpdateProductAsset {
    assetId: string
    packages?: PackageQtyOtps[],
    items?: ItemQtyOtps[]
}

export interface ItemAsset {
    id: string,
    name: string,
    vendor: string,
    assetId?: string
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
    qty: number,
    readOnly?: boolean,
    action?: Function,
    theme?: string
}

export interface Package {
    packageId: string,
    name: string
}

export interface PackageQtyOtps {
    package: Package,
    qty: number,
    readOnly?: boolean,
    action?: Function,
    theme?: string
}

export interface Product {
    items: ItemQtyOtps[],
    packages: PackageQtyOtps[]
}

export interface Store {
    id: string,
    name: string,
    city: string
}

export interface FilterOpts {
    value: string,
    field?: string
}

export interface APIResult {
    done: boolean,
    error?: string
}