import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useListProfileNodesQuery } from '@/features/profile-tree/graphql/generated/graphql';
import NodeRow from './components/NodeRow';

export default function TreeScreen() {
  const { data, loading, fetchMore } = useListProfileNodesQuery({
    variables:{ first:50, order:[{ name:'ASC' }] }
  });

  const nodes = data?.listProfileNodes?.nodes ?? [];
  const pageInfo = data?.listProfileNodes?.pageInfo;

  const onEnd = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({ variables: { after: pageInfo.endCursor, first: 50 } });
    }
  }, [pageInfo, fetchMore]);

  return (
    <View style={{ flex:1, backgroundColor:'#000' }}>
      {loading && nodes.length===0 ? <ActivityIndicator style={{ marginTop:24 }} /> : (
        <FlatList
          data={nodes}
          keyExtractor={(it)=>it.id}
          renderItem={({item})=> <NodeRow node={item} />}
          onEndReachedThreshold={0.5}
          onEndReached={onEnd}
        />
      )}
    </View>
  );
}
