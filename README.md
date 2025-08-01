# @pasu/cockpit-client
cockpit-client is an unofficial API client for [Cockpit CMS](https://getcockpit.com), which is licensed under the [MIT License](https://github.com/agentejo/cockpit/blob/next/LICENSE).

The aim for this package is to get you away from having to write queries yourself, while retaining the
necessary flexibility of filtering, sorting and shaping the data you need.

> [!IMPORTANT]  
> As of now, this package is still in development and does not implement all the endpoints Cockpit exposes via its API.
> To see what is currently implemented, check the documentation provided below.

## Installation
Add `@pasu/cockpit-client` as a dependency via npm:

`npm install @pasu/cockpit-client`

## Usage
### Example using vanilla JS
```js
import { createClient } from '@pasu/cockpit-client';

// instantiate a client with the link to your Cockpit-API:
const client = createClient('https://path.to.my/api');

// select a collection to query documents from
const postCollection = client.collection('posts');

// query documents from the selected collection, with optional filters/options
const posts = await postCollection.query({limit: 3});
```

### Example using TypeScript

```ts
// Asset contains all metadata the Cockpit-API exposes
import { createClient, Asset } from '@pasu/cockpit-client';

// define types of your documents
interface Post {
  title: string;
  description: string;
  thumbnail: Asset;
}

// instantiate a client with the link to your Cockpit-API:
const client = createClient('https://path.to.my/api');

// select a collection to query documents from, providing a type for all its documents
const postCollection = client.collection<Post>('post');

// query documents from the selected collection, including proper typing
const posts: Post = await postCollection.query({limit: 3});
```

## Documentation
TBA
