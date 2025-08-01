export type Asset<T = {}> = T & {
  /**
   * User-ID of creator
   */
  _cby: string;

  /**
   * Timestamp of creation
   */
  _created: number;

  /**
   * ID of document
   */
  _id: string;

  /**
   * User-ID of latest modification
   */
  _mby: string;

  /**
   * Timestamp of latest modification
   */
  _modified: number;

  title: string;
  description: string;
  altText: string;
  colors: string[];
  tags: string[];
  folder: string;
  path: string;
  height: number;
  width: number;
  size: number;
  thumbhash: string;
  type: string;
  mime: string;
};


export type AssetOptions = {
  resizeMode?: 'thumbnail' | 'bestFit' | 'resize' | 'fitToWidth' | 'fitToHeight';
  width?: number;
  height?: number;
  quality?: number;
  mime?: 'auto' | 'gif' | 'jpeg' | 'png' | 'webp' | 'bmp';
  redirectToThumbnail?: boolean;
  cacheInvalidationTimestamp?: number;
  binary?: boolean;
}

export type DocumentMeta<T = {}> = T & {
  /**
   * User-ID of creator
   */
  _cby: string;

  /**
   * Timestamp of creation
   */
  _created: number;

  /**
   * ID of document
   */
  _id: string;

  /**
   * User-ID of latest modification
   */
  _mby: string;

  /**
   * Timestamp of latest modification
   */
  _modified: number;

  /**
   * Publication state
   */
  _state: number;
};

export type Query<T = {}> = {
  locale?: string;
  limit?: number;
  skip?: number;
  populate?: 0 | 1;

  filter?: DocumentFilter<T>;
  fields?: DocumentFields<T>;
  sort?: DocumentSort<T>;
};

export type DocumentFilter<T = {}> = {
  [key in keyof Partial<T>]: any;
};

export type DocumentFields<T = {}> = {
  [key in keyof Partial<T>]: boolean;
}

export type DocumentSort<T = {}> = {
  [key in keyof Partial<T>]: -1 | 1;
}
