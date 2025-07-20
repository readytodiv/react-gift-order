import axios from 'axios';
import type { Product } from '@/data/products';

export interface Theme {
  themeId: number;
  name: string;
  image: string;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getThemes = async (): Promise<Theme[]> => {
  const { data } = await apiClient.get<{ data: Theme[] }>('/api/themes');
  return data.data;
};

export interface RankingParams {
  targetType?: string;
  rankType?: string;
}

export const getProductRanking = async (
  params: RankingParams
): Promise<Product[]> => {
  const { data } = await apiClient.get<{ data: Product[] }>('/api/products/ranking', {
    params,
  });
  return data.data;
};
