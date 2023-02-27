export const truncateAddress = (address: string): string => {
    const len = address.length;
    return `0x${address.substring(2, 6)}...${address.substring(len - 6, len - 1)}`;
};