import {
    Product,
    CreateProduct,
    ProductPaginator,
    QueryOptions,
    GetParams,
    ProductQueryOptions,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { crudFactory } from './curd-factory';
  import { HttpClient } from './http-client';
  
  export const influencerProductClient = {
    ...crudFactory<any, QueryOptions, any>(API_ENDPOINTS.INFLUENCER_PRODUCTS),

    paginated: ({
      ...params
    }: Partial<any>) => {
      return HttpClient.get<any>(API_ENDPOINTS.INFLUENCER_PRODUCTS, {
        ...params,
      });
    },
  };
  