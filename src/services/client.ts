import { createClient } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default client;