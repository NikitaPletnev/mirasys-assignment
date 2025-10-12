import React, { PropsWithChildren } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

import { GRAPHQL_HTTP } from '@/core/config';
import { useAuthStore } from '@/features/auth/model';

const httpLink = new HttpLink({ uri: GRAPHQL_HTTP });

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().accessToken;
  return {
    headers: {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const retryLink = new RetryLink({
  attempts: (count, _op, error) => !!error && count <= 2,
  delay: (count) => Math.min(300 * count, 800),
});

const errorLink = onError(({ networkError, graphQLErrors, operation }) => {
  if (networkError) {
    console.warn('[NET]', operation.operationName, networkError);
  }
  if (graphQLErrors) {
    graphQLErrors.forEach((e) => console.warn('[GQL]', operation.operationName, e.message, e.extensions));
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        listProfileNodes: {
          keyArgs: ['where'],
          merge(existing, incoming) {
            if (!existing) return incoming;
            return { ...incoming, edges: [ ...(existing.edges ?? []), ...(incoming.edges ?? []) ] };
          },
        },
      },
    },
  },
});

export const apollo = new ApolloClient({
  link: from([retryLink, errorLink, authLink, httpLink]),
  cache,
});

export function ApolloRoot({ children }: PropsWithChildren) {
  return <ApolloProvider client={apollo}>{children}</ApolloProvider>;
}
