import { toast } from 'react-toastify';

export const copyToClipboard = (text: string): void => {
  // Use the navigator clipboard API if available
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard', { position: 'top-center' });
  }
};

/**
 * Add commas to large numbers and limit to three decimal places if nonzero
 * @param {number|string} num - The number to format
 * @param {number} decimals - The number of decimals to show
 * @return {string} - The formatted number
 */
export const formatNumber = (num: number | string, decimals = 2): string => {
  if (!num) return '0'; // Don't append decimals to 0
  // If desired decimals exceed max significant decimal places then do not convert to float
  // and directly commify instead (here for number inputs)
  try {
    if (typeof num === 'string') {
      num = parseFloat(num);
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } catch (e) {
    return '0';
  }
};

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const sortArbitrayType = (a: any, b: any): number => {
  // If a and b are of different types, compare their types
  if (typeof a !== typeof b) {
    return typeof a < typeof b ? -1 : 1;
  }

  // If a and b are of the same type, compare their values
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export const truncateAddress = (address: string): string => {
  const len = address.length;
  return `0x${address.substring(2, 6)}...${address.substring(
    len - 6,
    len - 1
  )}`;
};

export const truncateText = (text: string): string => {
  const len = text.length;
  return `${text.substring(2, 6)}...${text.substring(len - 6, len - 1)}`;
};
