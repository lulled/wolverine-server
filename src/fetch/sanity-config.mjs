import {createClient} from  '@sanity/client';
import imageUrlBuilder from'@sanity/image-url';

const client = createClient({
  projectId: 'o1y4uqoj',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-11-10', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

// const builder = imageUrlBuilder(client);

// export const urlFor = (source) => {
//   return builder.image(source);
// };

// exporting const client to be used everywhere its needed !!
// exporting const urlFor to be used everywhere its needed !!
module.exports = client;