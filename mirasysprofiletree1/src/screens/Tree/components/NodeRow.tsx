import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NodeChildrenList from './NodeChildrenList';
import NodeIcon from './NodeIcon';
import { ListProfileNodesQuery } from '@/features/profile-tree/graphql/generated/graphql';

type Node = NonNullable<ListProfileNodesQuery['listProfileNodes']>['nodes'][number];

export default function NodeRow({ node }: { node: Node }) {
  const [open, setOpen] = useState(false);
  const isFolder = node.kind === 'FOLDER';

  return (
    <View>
      <TouchableOpacity onPress={() => isFolder && setOpen((v) => !v)} style={{ padding:12, flexDirection:'row', alignItems:'center' }}>
        <NodeIcon kind={node.kind} />
        <Text style={{ color:'#fff', marginLeft:8, flex:1 }}>{node.name}</Text>
        {isFolder ? <Text style={{ color:'#84f16a' }}>{open? '▾':'▸'}</Text> : null}
      </TouchableOpacity>
      {open && isFolder && <NodeChildrenList parentId={node.id} />}
    </View>
  );
}
