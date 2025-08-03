import { Asset, AssetOptions, DocumentMeta, Query } from './types/client.types';

const getUrl = async <T = any>(url: string, options?: {query?: Query<T>; apiKey?: string;}): Promise<Array<DocumentMeta<T>>> => {
  const { query, apiKey } = options || {};
  const queryParams = new URLSearchParams();

  if (query) {
    if (query.locale) {queryParams.set('locale', query.locale);}
    if (query.limit) {queryParams.set('limit', String(query.limit));}
    if (query.skip) {queryParams.set('skip', String(query.skip));}
    if (query.populate) {queryParams.set('populate', String(query.populate));}
    if (query.filter) {queryParams.set('filter', JSON.stringify(query.filter));}
    if (query.fields) {
      queryParams.set('fields', JSON.stringify(query.fields));
    }
    if (query.sort) {queryParams.set('sort', JSON.stringify(query.sort));}
  }

  const headers = new Headers();
  if (apiKey !== undefined) {
    headers.set('api-key', apiKey);
  }

  const res = await fetch(`${url}?${queryParams.toString()}`, {
    headers,
  });

  return await res.json();
};

const collectionPrototype = <T = any>(host: string, collectionName: string, apiKey?: string) => {
  const bulkEndpoint = `${host}/content/items/${collectionName}`;
  const singletonEndpoint = `${host}/content/item/${collectionName}`;

  return {
    query: (queryObject?: Query<T>) => getUrl<T>(bulkEndpoint, {query: queryObject, apiKey}),
    document: (id: string) => getUrl<T>(`${singletonEndpoint}/${id}`, {apiKey}),
  };
};

const getImagePath = (host: string, assetId: string, options?: AssetOptions): string => {
  const query = new URLSearchParams();

  if (options) {
    if (options.resizeMode) {query.set('m', options.resizeMode);}
    if (options.width) {query.set('w', String(options.width));}
    if (options.height) {query.set('h', String(options.height));}
    if (options.quality) {query.set('q', String(options.quality));}
    if (options.mime) {query.set('mime', options.mime);}
    if (options.redirectToThumbnail) {query.set('re', String(options.redirectToThumbnail));}
    if (options.cacheInvalidationTimestamp) {query.set('t', String(options.cacheInvalidationTimestamp));}
    if (options.binary) {query.set('o', String(Number(options.binary)));}
  }

  return `${host}/assets/image/${assetId}?${query.toString()}`;
};

const fetchAsset = async (url: string, options?: {apiKey: string;}): Promise<Asset> => {
  const {apiKey} = options || {};
  const headers = new Headers();

  if (apiKey) {
    headers.set('api-key', apiKey);
  }

  const response = await fetch(url, {
    headers,
  });

  return await response.json();
}

const defaultImageOptions: AssetOptions = {
  width: 800,
  binary: true,
};

const imagePrototype = (host: string, assetId: string, options: AssetOptions = defaultImageOptions) => {
  return {
    path: getImagePath(host, assetId, options),
    fetch: () => fetchAsset(getImagePath(host, assetId, options)),
  };
}

export const createClient = (host: string, apiKey?: string) => {
  return {
    collection: <T = any>(name: string) => collectionPrototype<T>(host, name, apiKey),
    image: (assetId: string, options?: AssetOptions) => imagePrototype(host, assetId, options),
  }
};
