import { InitialData } from 'src/core/models/response.model';

export const extractInitialData = (props: any): InitialData | null => {
  const initialDataOnServer = (props && props.staticContext) || null;
  const initialDataOnClient = (typeof window !== typeof undefined && (window as any).__initialData__) || null;
  return initialDataOnServer || initialDataOnClient;
};
