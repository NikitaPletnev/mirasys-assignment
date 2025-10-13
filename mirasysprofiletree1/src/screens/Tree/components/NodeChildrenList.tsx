import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useListProfileNodesQuery } from '@/features/profile-tree/graphql/generated/graphql';
import NodeRow from './NodeRow';

export default function NodeChildrenList({ parentId }: { parentId: string }) {
  const { data, loading, fetchMore } = useListProfileNodesQuery({
    variables:{ first:50, where:{ parentNodeId:{ eq: parentId } } }
  });
  const nodes = data?.listProfileNodes?.nodes ?? [];
  const pageInfo = data?.listProfileNodes?.pageInfo;

  const onEnd = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({ variables: { after: pageInfo.endCursor, first: 50, where:{ parentNodeId:{ eq: parentId } } } });
    }
  }, [pageInfo, fetchMore, parentId]);

  if (loading && nodes.length===0) return <ActivityIndicator style={{ marginLeft:16 }} />;
  return (
    <View style={{ marginLeft:16 }}>
      <FlatList data={nodes} keyExtractor={(it)=>it.id} renderItem={({item})=> <NodeRow node={item} />} onEndReached={onEnd} onEndReachedThreshold={0.5}/>
    </View>
  );
}
