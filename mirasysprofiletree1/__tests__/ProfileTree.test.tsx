import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import { LIST_PROFILE_NODES } from '../src/features/profile-tree/graphql/queries/listProfileNodes';
import { ProfileTreeScreen } from '../src/features/profile-tree/components/ProfileTreeScreen';

const mockData = {
  request: {
    query: LIST_PROFILE_NODES,
    variables: { first: 50, after: null, where: { parentNodeId: null } },
  },
  result: {
    data: {
      listProfileNodes: {
        nodes: [
          { id: '1', name: 'Root Folder', kind: 'FolderNode', parentNodeId: null, __typename: 'FolderNode' },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    },
  },
};

describe('ProfileTreeScreen', () => {
  it('renders root nodes from GraphQL', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
        <ProfileTreeScreen />
      </MockedProvider>
    );
    
    await waitFor(() => expect(getByText('Root Folder')).toBeTruthy());
  });
});
