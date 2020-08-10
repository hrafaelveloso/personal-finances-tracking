import useSWR, { ConfigInterface } from 'swr';
import { ILog } from '../../interfaces';

const useLastLogs = (options?: ConfigInterface): IUseLastLogs => {
  const { data, error, mutate } = useSWR('/logs/last', options);

  return {
    logs: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

interface IUseLastLogs {
  logs?: ILog[];
  isLoading: boolean;
  isError: boolean;
  mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
}

export default useLastLogs;
