import { getToken } from '@lifi/sdk';

export async function fetchTokenPrice(chainId: number, tokenAddress: string): Promise<string | null> {
    try {
      const token = await getToken(chainId, tokenAddress);
      return token.priceUSD;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
}

export async function calculateTokenAmount(chainId: number, tokenAddress: string, usdcAmount: number): Promise<number | null> {
  try {
    const tokenPrice = await fetchTokenPrice(chainId, tokenAddress);
    if (!tokenPrice) {
      throw new Error('Failed to fetch token price');
    }

    const tokenAmount = usdcAmount / parseFloat(tokenPrice);
    return tokenAmount;
  } catch (error) {
    console.error('Error calculating token amount:', error);
    return null;
  }
}