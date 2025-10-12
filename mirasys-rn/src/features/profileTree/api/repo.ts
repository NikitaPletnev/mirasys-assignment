import { useMemo } from 'react';
import { PAGE_SIZE } from '@/core/config';
import {
  useRootProfileNodesQuery,
  useChildrenProfileNodesLazyQuery,
} from '@/core/gql/operations';
import { useAuthStore } from '../../auth/model';

export function pickNodes(conn?: {
  edges?: Array<{ node?: any } | null> | null;
  nodes?: Array<any> | null;
}) {
  const viaEdges =
    conn?.edges?.filter((e): e is { node: any } => !!e?.node).map((e) => e.node) ?? [];
  if (viaEdges.length) return viaEdges;

  const viaNodes = conn?.nodes?.filter(Boolean) ?? [];
  return viaNodes;
}

export function useRootRepo(after?: string | null) {
  const token = useAuthStore((s) => s.accessToken);

  const q = useRootProfileNodesQuery({
    variables: { first: PAGE_SIZE, after: after ?? null },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    skip: !token,
  });

  const conn = q.data?.listProfileNodes;

  const nodes = useMemo(() => pickNodes(conn), [conn]);

  const pageInfo = conn?.pageInfo;

  async function loadMore() {
    if (!pageInfo?.hasNextPage) return;
    await q.fetchMore({ variables: { after: pageInfo.endCursor } });
  }

  return { nodes, pageInfo, loading: q.loading, error: q.error, refetch: q.refetch, loadMore };
}

export function useChildrenRepoLazy() {
  const token = useAuthStore((s) => s.accessToken);
  const [exec, q] = useChildrenProfileNodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const nodes = useMemo(() => pickNodes(q.data?.listProfileNodes), [q.data?.listProfileNodes]);

  function getNodes() {
    return pickNodes(q.data?.listProfileNodes);
  }

  async function load(parentId: string, after: string | null = null) {
    if (!token) throw new Error('Not authenticated');
    return exec({ variables: { parentId, first: PAGE_SIZE, after } });
  }

  async function loadMore(parentId: string) {
    const pi = q.data?.listProfileNodes?.pageInfo;
    if (!pi?.hasNextPage) return;
    return exec({ variables: { parentId, first: PAGE_SIZE, after: pi.endCursor } });
  }

  return {
    load, loadMore,
    loading: q.loading, error: q.error,
    nodes,
    get pageInfo() { return q.data?.listProfileNodes?.pageInfo; },
  };
}
