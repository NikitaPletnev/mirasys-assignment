import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import ProfileTreeScreen from '../features/profileTree/ui/ProfileTreeScreen';
import { RootProfileNodesDocument, ChildrenProfileNodesDocument } from '../core/gql/operations';

const rootMock = {
  request: { query: RootProfileNodesDocument, variables: { first: 50, after: null } },
  result: {
    data: {
      listProfileNodes: {
        edges: [
          { cursor: 'c1', node: { id: 'f1', name: 'Folder A', __typename: 'FolderNode', parentNodeId: null } },
          { cursor: 'c2', node: { id: 'v1', name: 'Cam 1', __typename: 'VideoChannelNode', parentNodeId: null } },
        ],
        pageInfo: { endCursor: 'c2', hasNextPage: false },
      },
    },
  },
};

const childMock = {
  request: { query: ChildrenProfileNodesDocument, variables: { parentId: 'f1', first: 50, after: null } },
  result: {
    data: {
      listProfileNodes: {
        edges: [
          { cursor: 'c3', node: { id: 'v2', name: 'Cam 2', __typename: 'VideoChannelNode', parentNodeId: 'f1' } },
        ],
        pageInfo: { endCursor: 'c3', hasNextPage: false },
      },
    },
  },
};

function Wrapper({ children }: any) {
  return <MockedProvider mocks={[rootMock, childMock]} addTypename>{children}</MockedProvider>;
}

test('renders root and expands folder', async () => {
  render(<ProfileTreeScreen />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(screen.getByText('Folder A')).toBeTruthy();
    expect(screen.getByText('Cam 1')).toBeTruthy();
  });

  // клик по стрелке ▸ (первый toggle)
  const toggles = screen.getAllByText('▸');
  toggles[0].props.onPress();

  await waitFor(() => {
    expect(screen.getByText('Cam 2')).toBeTruthy();
  });
});
