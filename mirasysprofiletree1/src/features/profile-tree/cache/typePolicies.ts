import { TypePolicies } from '@apollo/client';

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      listProfileNodes: {
        keyArgs: ["where", "order"],
        merge(existing = { nodes: [], pageInfo: {} }, incoming) {
          const nodes = [...(existing.nodes||[]), ...(incoming.nodes||[])];
          return { ...incoming, nodes };
        }
      }
    }
  }
};
