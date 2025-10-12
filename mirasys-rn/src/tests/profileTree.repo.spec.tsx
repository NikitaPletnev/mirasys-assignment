import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ROOT_NODES } from '../features/profileTree/api/queries.graphql'; // если экспортируешь
import { renderHook, waitFor } from '@testing-library/react-native';
import { useRootRepo } from '../features/profileTree/api/repo';

const rootMock = {
  request: {
    query: ROOT_NODES,
    variables: { first: 50, after: null },
  },
  result: {
    data: {
      listProfileNodes: {
        edges: [
          { cursor: 'c1', node: { id: '1', name: 'Root A', __typename: 'FolderNode', parentNodeId: null } },
          { cursor: 'c2', node: { id: '2', name: 'Root B', __typename: 'VideoChannelNode', parentNodeId: null } },
        ],
        pageInfo: { endCursor: 'c2', hasNextPage: false },
      },
    },
  },
};

test('useRootRepo returns nodes and pageInfo', async () => {
  const wrapper = ({ children }: any) => <MockedProvider mocks={[rootMock]} addTypename>{children}</MockedProvider>;
  const { result } = renderHook(() => useRootRepo(null), { wrapper });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.nodes?.length).toBe(2);
    expect(result.current.pageInfo?.endCursor).toBe('c2');
  });
});
