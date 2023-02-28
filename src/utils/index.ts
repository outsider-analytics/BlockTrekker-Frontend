export const sortArbitrayType = (a: any, b: any) => {
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
}

export const truncateAddress = (address: string): string => {
    const len = address.length;
    return `0x${address.substring(2, 6)}...${address.substring(len - 6, len - 1)}`;
};