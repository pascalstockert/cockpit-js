import { createClient } from '../src/client';

describe('client', () => {
  const apiKey = 'super-secure-api-key';
  const origin = 'https://test.me';
  const apiPath = 'api';
  const collection = 'tests';

  const client = createClient(`${origin}/${apiPath}`, apiKey);
  const testCollection = client.collection(collection);

  beforeEach(() => {
    global.fetch = jest.fn().mockReturnValue(Promise.resolve({json: () => {}})) as jest.Mock;
  });

  describe('collection:query', () => {
    let urlObject: URL;
    let headers: Headers;

    beforeEach(async () => {
      await testCollection.query({
        locale: 'de-DE',
        limit: 100,
        skip: 100,
        populate: 0,
        filter: {},
        fields: {},
        sort: {},
      });
      const [url, options] = (fetch as jest.Mock).mock.calls[0];
      urlObject = new URL(url);
      headers = options.headers;
    });


    it('should fetch once', () => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should build correct url', () => {
      expect(urlObject.origin).toEqual(origin);
      expect(urlObject.pathname).toEqual(`/${apiPath}/content/items/${collection}`);
    });

    it('should build correct query params', async () => {
      const searchParams = Array.from(urlObject.searchParams.keys());

      expect(searchParams).toContain('locale');
      expect(searchParams).toContain('limit');
      expect(searchParams).toContain('skip');
      expect(searchParams).toContain('filter');
      expect(searchParams).toContain('fields');
      expect(searchParams).toContain('sort');
    });

    it('should append API-key to query', async () => {
      expect(headers.has('api-key')).toBe(true);
      expect(headers.get('api-key')).toEqual(`${apiKey}`);
    });
  });

  describe('collection:document', () => {
    const documentId = 'test';

    let urlObject: URL;
    let headers: Headers;

    beforeEach(async () => {
      await testCollection.document(documentId);
      const [url, options] = (fetch as jest.Mock).mock.calls[0];
      urlObject = new URL(url);
      headers = options.headers;
    });

    it('should fetch once', () => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should build correct url', () => {
      expect(urlObject.origin).toEqual(origin);
      expect(urlObject.pathname).toEqual(`/${apiPath}/content/item/${collection}/${documentId}`);
    });

    it('should append API-key to query', async () => {
      expect(headers.has('api-key')).toBe(true);
      expect(headers.get('api-key')).toEqual(`${apiKey}`);
    });
  });

  describe('image', () => {
    const imageId = 'test';
    const image = client.image(imageId, {
      resizeMode: 'thumbnail',
      width: 400,
      height: 400,
      quality: 80,
      mime: 'webp',
      redirectToThumbnail: true,
      cacheInvalidationTimestamp: (new Date()).getTime(),
      binary: true,
    });


    it('should return correct image URL with options', async () => {
      const imageUrlString = image.path;
      const imageUrl = new URL(imageUrlString);
      const searchParams = Array.from(imageUrl.searchParams.keys());

      expect(imageUrl.origin).toEqual(origin);
      expect(imageUrl.pathname).toEqual(`/${apiPath}/assets/image/${imageId}`);

      expect(searchParams).toContain('m');
      expect(searchParams).toContain('w');
      expect(searchParams).toContain('h');
      expect(searchParams).toContain('q');
      expect(searchParams).toContain('mime');
      expect(searchParams).toContain('re');
      expect(searchParams).toContain('t');
      expect(searchParams).toContain('o');
    });

    it('should fetch asset correctly', async () => {
      await image.fetch();
      const [url, _] = (fetch as jest.Mock).mock.calls[0];
      const urlObject = new URL(url);
      // const headers = options.headers;

      expect(fetch).toHaveBeenCalledTimes(1);

      expect(urlObject.origin).toEqual(origin);
      expect(urlObject.pathname).toEqual(`/${apiPath}/assets/image/${imageId}`);

      /* TODO implement api-key to be passed
      expect(headers.has('api-key')).toBe(true);
      expect(headers.get('api-key')).toEqual(`${apiKey}`);
       */
    });
  });
});
