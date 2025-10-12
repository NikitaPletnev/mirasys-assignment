import React, { PropsWithChildren } from 'react';
import { ApolloRoot } from './providers/apollo';
import { ThemeRoot } from './providers/theme';
export default function RootProviders({ children }: PropsWithChildren) {
  return <ThemeRoot><ApolloRoot>{children}</ApolloRoot></ThemeRoot>;
}
