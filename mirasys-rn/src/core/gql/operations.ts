import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NodeFields_AlarmNode_Fragment = (
  { __typename: 'AlarmNode' }
  & Pick<AlarmNode, 'id' | 'name' | 'parentNodeId'>
);

export type NodeFields_DigitalInputNode_Fragment = (
  { __typename: 'DigitalInputNode' }
  & Pick<DigitalInputNode, 'id' | 'name' | 'parentNodeId'>
);

export type NodeFields_DigitalOutputNode_Fragment = (
  { __typename: 'DigitalOutputNode' }
  & Pick<DigitalOutputNode, 'id' | 'name' | 'parentNodeId'>
);

export type NodeFields_FolderNode_Fragment = (
  { __typename: 'FolderNode' }
  & Pick<FolderNode, 'id' | 'name' | 'parentNodeId'>
);

export type NodeFields_VideoChannelNode_Fragment = (
  { __typename: 'VideoChannelNode' }
  & Pick<VideoChannelNode, 'id' | 'name' | 'parentNodeId'>
);

export type NodeFieldsFragment =
  | NodeFields_AlarmNode_Fragment
  | NodeFields_DigitalInputNode_Fragment
  | NodeFields_DigitalOutputNode_Fragment
  | NodeFields_FolderNode_Fragment
  | NodeFields_VideoChannelNode_Fragment
;

export type ConnectionFieldsFragment = (
  { __typename?: 'ListProfileNodesConnection' }
  & { pageInfo: (
    { __typename?: 'PageInfo' }
    & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
  ) }
);

export type RootProfileNodesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after: InputMaybe<Scalars['String']['input']>;
}>;


export type RootProfileNodesQuery = (
  { __typename?: 'Query' }
  & { listProfileNodes: Maybe<(
    { __typename?: 'ListProfileNodesConnection' }
    & {
      edges: Maybe<Array<(
        { __typename?: 'ListProfileNodesEdge' }
        & Pick<ListProfileNodesEdge, 'cursor'>
        & { node:
          | (
            { __typename: 'AlarmNode' }
            & Pick<AlarmNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'DigitalInputNode' }
            & Pick<DigitalInputNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'DigitalOutputNode' }
            & Pick<DigitalOutputNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'FolderNode' }
            & Pick<FolderNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'VideoChannelNode' }
            & Pick<VideoChannelNode, 'id' | 'name' | 'parentNodeId'>
          )
         }
      )>>,
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
      ),
    }
  )> }
);

export type ChildrenProfileNodesQueryVariables = Exact<{
  parentId: Scalars['String']['input'];
  first: Scalars['Int']['input'];
  after: InputMaybe<Scalars['String']['input']>;
}>;


export type ChildrenProfileNodesQuery = (
  { __typename?: 'Query' }
  & { listProfileNodes: Maybe<(
    { __typename?: 'ListProfileNodesConnection' }
    & {
      edges: Maybe<Array<(
        { __typename?: 'ListProfileNodesEdge' }
        & Pick<ListProfileNodesEdge, 'cursor'>
        & { node:
          | (
            { __typename: 'AlarmNode' }
            & Pick<AlarmNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'DigitalInputNode' }
            & Pick<DigitalInputNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'DigitalOutputNode' }
            & Pick<DigitalOutputNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'FolderNode' }
            & Pick<FolderNode, 'id' | 'name' | 'parentNodeId'>
          )
          | (
            { __typename: 'VideoChannelNode' }
            & Pick<VideoChannelNode, 'id' | 'name' | 'parentNodeId'>
          )
         }
      )>>,
      pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
      ),
    }
  )> }
);

export const NodeFieldsFragmentDoc = gql`
    fragment NodeFields on IProfileNode {
  id
  name
  __typename
  parentNodeId
}
    `;
export const ConnectionFieldsFragmentDoc = gql`
    fragment ConnectionFields on ListProfileNodesConnection {
  pageInfo {
    endCursor
    hasNextPage
  }
}
    `;
export const RootProfileNodesDocument = gql`
    query RootProfileNodes($first: Int!, $after: String) {
  listProfileNodes(
    where: {parentNodeId: {eq: null}}
    first: $first
    after: $after
  ) {
    edges {
      cursor
      node {
        ...NodeFields
      }
    }
    ...ConnectionFields
  }
}
    ${NodeFieldsFragmentDoc}
${ConnectionFieldsFragmentDoc}`;

/**
 * __useRootProfileNodesQuery__
 *
 * To run a query within a React component, call `useRootProfileNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootProfileNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootProfileNodesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useRootProfileNodesQuery(baseOptions: Apollo.QueryHookOptions<RootProfileNodesQuery, RootProfileNodesQueryVariables> & ({ variables: RootProfileNodesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RootProfileNodesQuery, RootProfileNodesQueryVariables>(RootProfileNodesDocument, options);
      }
export function useRootProfileNodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootProfileNodesQuery, RootProfileNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RootProfileNodesQuery, RootProfileNodesQueryVariables>(RootProfileNodesDocument, options);
        }
export function useRootProfileNodesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RootProfileNodesQuery, RootProfileNodesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RootProfileNodesQuery, RootProfileNodesQueryVariables>(RootProfileNodesDocument, options);
        }
export type RootProfileNodesQueryHookResult = ReturnType<typeof useRootProfileNodesQuery>;
export type RootProfileNodesLazyQueryHookResult = ReturnType<typeof useRootProfileNodesLazyQuery>;
export type RootProfileNodesSuspenseQueryHookResult = ReturnType<typeof useRootProfileNodesSuspenseQuery>;
export type RootProfileNodesQueryResult = Apollo.QueryResult<RootProfileNodesQuery, RootProfileNodesQueryVariables>;
export const ChildrenProfileNodesDocument = gql`
    query ChildrenProfileNodes($parentId: String!, $first: Int!, $after: String) {
  listProfileNodes(
    where: {parentNodeId: {eq: $parentId}}
    first: $first
    after: $after
  ) {
    edges {
      cursor
      node {
        ...NodeFields
      }
    }
    ...ConnectionFields
  }
}
    ${NodeFieldsFragmentDoc}
${ConnectionFieldsFragmentDoc}`;

/**
 * __useChildrenProfileNodesQuery__
 *
 * To run a query within a React component, call `useChildrenProfileNodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChildrenProfileNodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChildrenProfileNodesQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useChildrenProfileNodesQuery(baseOptions: Apollo.QueryHookOptions<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables> & ({ variables: ChildrenProfileNodesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables>(ChildrenProfileNodesDocument, options);
      }
export function useChildrenProfileNodesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables>(ChildrenProfileNodesDocument, options);
        }
export function useChildrenProfileNodesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables>(ChildrenProfileNodesDocument, options);
        }
export type ChildrenProfileNodesQueryHookResult = ReturnType<typeof useChildrenProfileNodesQuery>;
export type ChildrenProfileNodesLazyQueryHookResult = ReturnType<typeof useChildrenProfileNodesLazyQuery>;
export type ChildrenProfileNodesSuspenseQueryHookResult = ReturnType<typeof useChildrenProfileNodesSuspenseQuery>;
export type ChildrenProfileNodesQueryResult = Apollo.QueryResult<ChildrenProfileNodesQuery, ChildrenProfileNodesQueryVariables>;