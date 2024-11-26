import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AbstractProductAsset, AssetItem, ItemQtyOtps, PackageQtyOtps } from '@/App.type';

type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MONTH_IDX: Record<Month, string> = {
  'Jan': '01',
  'Feb': '02',
  'Mar': '03',
  'Apr': '04',
  'May': '05',
  'Jun': '06',
  'Jul': '07',
  'Aug': '08',
  'Sep': '09',
  'Oct': '10',
  'Nov': '11',
  'Dec': '12'
};

const MONTH_NAMES = Object.keys(MONTH_IDX) as Month[];

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

export function formattedDate(providedDate: Date | undefined = undefined) {
  const defDate = providedDate || new Date();

  const [, mon, date, year] = defDate.toDateString().split(' ') as [string, Month, string, string];
  
  return `${year}-${MONTH_IDX[mon]}-${date.padStart(2, '0')}`;
}

export function convertDateFormat(dateString: string): string {
  // Parse the input date
  const [year, month, day] = dateString.split('-');

  // Find the month name
  const monthName = MONTH_NAMES[parseInt(month) - 1];

  // Format the new date string
  return `${day}-${monthName}-${year.slice(-2)}`;
}

export function convertToDayNameFormat(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  
  const date = new Date(year, month - 1, day);  // month is 0-indexed in Date constructor
  
  const dayOfMonth = day;
  const monthName = MONTH_NAMES[date.getMonth()];
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()];

  return `${dayOfMonth} ${monthName}, ${dayOfWeek}`;
}

/* Format = 2024-09-16T15:40:19.444Z */
export function isDateString(str: string | undefined) {
  let valid = false;
  if (str && str.length == 24) {
    valid = true;
     // Try to parse the string as a date using ISO 8601 format
    const parts = str.split('T');
    if (parts.length == 2) {
      if (parts[0].length == 10 && parts[0].split('-').length == 3 && parts[1].length == 13 && parts[1].split(':').length == 3) {
        const date = new Date(str);
        // Check if the parsed date is valid and not NaN
        valid = !isNaN(date.getTime());
        // valid = true;
      }
    } 
  }
  return valid;
}

/*s
*/

export function convertISOToISTFormat(isoDateString: string): string {
  const date = new Date(isoDateString);
  
  // Convert to IST (UTC+5:30)
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));

  const day = istDate.getUTCDate();
  const month = MONTH_NAMES[istDate.getUTCMonth()];
  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();

  // Round minutes to nearest 5
  const roundedMinutes = minutes; //Math.floor(minutes / 5) * 5;
  
  // Format hours and minutes
  const formattedTime = `${hours}:${roundedMinutes.toString().padStart(2, '0')}`;

  return `${day} ${month}, ${formattedTime}`;
}

export function getDateDaysAgo(days: number): string {
  const today = new Date();
  const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  
  const [, mon, date, year] = pastDate.toDateString().split(' ') as [string, Month, string, string];
  
  return `${year}-${MONTH_IDX[mon]}-${date.padStart(2, '0')}`;
}

export function dateRange(daysAgo: number | undefined = undefined) {
  const range = [];

  if (daysAgo) {
    range.push(getDateDaysAgo(daysAgo))
  }

  range.push(formattedDate());
  return range;
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

export function replaceHashMarks(input: string) {
    // return input.replace(/#/g, "-H-");
    return input.replace(/#/g, "%23");
}

export function restoreHashMarks(encoded: string) {
    return encoded.replace(/-H-/g, "#");
}