import React, { PropsWithChildren, useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { authLink } from '@/lib/apollo/links/authLink';
import { errorLink } from '@/lib/apollo/links/errorLink';
import { retryLink } from '@/lib/apollo/links/retryLink';
import { typePolicies } from '@/features/profile-tree/cache/typePolicies';

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://router.mirasys.dev/graphql';

export const ApolloGraphQLProvider = ({ children }: PropsWithChildren) => {
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: GRAPHQL_URL });
    return new ApolloClient({
      link: from([errorLink, retryLink, authLink, httpLink]),
      cache: new InMemoryCache({ typePolicies }),
      defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } }
    });
  }, []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
