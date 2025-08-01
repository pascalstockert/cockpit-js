import { Asset, AssetOptions, DocumentMeta, Query } from './types/client.types';

const getUrl = async <T = any>(url: string, query?: Query<T>): Promise<Array<DocumentMeta<T>>> => {
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

  const res = await fetch(`${url}?${queryParams.toString()}`);

  return await res.json();
};

const collectionPrototype = <T = any>(host: string, collectionName: string) => {
  const bulkEndpoint = `${host}/content/items/${collectionName}`;
  const singletonEndpoint = `${host}/content/item/${collectionName}`;

  return {
    document: (id: string) => getUrl<T>(`${singletonEndpoint}/${id}`),
    query: (queryObject?: Query<T>) => getUrl<T>(bulkEndpoint, queryObject),
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

const fetchAsset = async (url: string): Promise<Asset> => {
  const response = await fetch(url);

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

export const createClient = (host: string) => {
  return {
    collection: <T = any>(name: string) => collectionPrototype<T>(host, name),
    image: (assetId: string, options?: AssetOptions) => imagePrototype(host, assetId, options),
  }
};
