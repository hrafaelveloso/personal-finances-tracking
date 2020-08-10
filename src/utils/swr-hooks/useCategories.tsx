import useSWR, { ConfigInterface } from 'swr';
import { ICategory } from '../../interfaces';

const useCategories = (options?: ConfigInterface): IUseCategories => {
  const { data, error, mutate } = useSWR('/categories', options);

  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

interface IUseCategories {
  categories?: ICategory[];
  isLoading: boolean;
  isError: boolean;
  mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
}

export default useCategories;
