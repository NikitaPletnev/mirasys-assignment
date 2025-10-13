import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) graphQLErrors.forEach(e => console.warn('[GraphQL]', e.message));
  if (networkError) console.warn('[Network]', networkError.message);
});
