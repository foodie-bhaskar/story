import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AbstractProductAsset, AssetItem, ItemQtyOtps, PackageQtyOtps } from '@/App.type';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function capitalizeFirstLetter(str: string) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function capitalizeWords(str: string) {
  if (!str) return str; // Handle empty strings
  return str
    .split('-')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

export function localDate(timeInMillis: number) {
  const date = new Date(timeInMillis);
  return date.toLocaleDateString(); //
}

function isKnownField(field: string): field is keyof AssetItem {
  return ['assetId', 'itemId', 'name'].includes(field);
}


export function includesInObject(o: AssetItem, value: string, field?: string): boolean {
  if (field && isKnownField(field)) {
    return o[field]?.toLowerCase().includes(value.toLowerCase()) ?? false;
  } else {
    return o.name.toLowerCase().includes(value.toLowerCase());
  }
}


function getAssetIdQty(assetQty: ItemQtyOtps | PackageQtyOtps): string {
  let { qty } = assetQty;
  let id: string | undefined;

  if ('item' in assetQty) {
    id = assetQty.item.itemId;
  } else if ('package' in assetQty) {
    id = assetQty.package.packageId;
  }

  if (!id) {
    throw new Error('Invalid assetQty format');
  }

  return `${id}-${qty}`;
}

function hasModifications(currentData: ItemQtyOtps[] | PackageQtyOtps[], existingData : ItemQtyOtps[] | PackageQtyOtps[]) {
  let isModified = false;

  if (currentData.length > 0) {
    if (currentData.length != existingData.length) {
      isModified = true;
    } else {
      const oldPkgIds = existingData.map((assetQty: ItemQtyOtps | PackageQtyOtps) => getAssetIdQty(assetQty));
      const newPkgIds = currentData.map((assetQty: ItemQtyOtps | PackageQtyOtps) => getAssetIdQty(assetQty));

      for (let i = 0; i < oldPkgIds.length; i++) {
        if (oldPkgIds[i] != newPkgIds[i]) {
          isModified = true;
          break;
        }
      }
    }
  }

  // alert(`isModified Valid (${isModified}): [(items | packages) - ${currentData.length}]`);

  return isModified;
}

/*
 * Check if product items and packages are filled to be valid
 */
export function isProductFormValid(items: ItemQtyOtps[], packages: PackageQtyOtps[], product: AbstractProductAsset) {
  let isValid = false; // set to false by default

  // product missing means new product mapping, so both items and packages need to there
  if (!product.items) {
    if (items && items.length && packages && packages.length) {
      console.log(`Product mapped with items::[${items.length}] and packages::[${packages.length}]`);
      isValid = true;
    }
  } else {
    // either items or packages need to be different or their quantity needs to be different
    // alert(`product existis: ${isValid}`)
    // a - if items then compare with existing product.items
    if (hasModifications(items, product.items)) {
      isValid = true;
      // alert(`product existis: ${isValid}`);
    }
    // b - if packages then compare with existing product.packages
    if (hasModifications(packages, product.packages)) {
      isValid = true;
    }
  }

  // alert(`isValid(${isValid}): [items-${items.length}] [packages-${packages.length}]`);

  return isValid;
}
