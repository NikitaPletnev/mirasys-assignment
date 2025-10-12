import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View, Text, ActivityIndicator, FlatList,
  ListRenderItemInfo, RefreshControl, Pressable,
  Platform, UIManager, LayoutAnimation,
} from 'react-native';
import { useRootRepo, useChildrenRepoLazy } from '../api/repo';
import { PAGE_SIZE } from '../../../core/config';
import { insertChildren, removeSubtree, normalizeKind, Row } from '../model/flatten';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const animateNext = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

export default function ProfileTreeScreen() {
  const [rootAfter, setRootAfter] = useState<string | null>(null);
  const [flat, setFlat] = useState<Row[]>([]);
  const initializedRef = useRef(false); // ← добавили

  const root = useRootRepo(rootAfter);
  const childrenRepo = useChildrenRepoLazy();

  useEffect(() => {
    if (initializedRef.current) return;
    if (root.loading) return;

    const src = root.nodes ?? [];
    if (!src.length) return;

    const rows: Row[] = src
      .filter(n => !!n?.id)
      .map(n => ({
        id: n.id!,
        name: n.name ?? '',
        kind: normalizeKind(n.__typename),
        parentId: n.parentNodeId ?? null,
        depth: 0,
        isExpanded: false,
        hasNextPage: false,
        endCursor: null,
      }));

    setFlat(rows);
    initializedRef.current = true;

    // debug: увидеть, что реально кладём
    console.log('INIT flat', rows.length, rows.slice(0, 3));
  }, [root.loading, root.nodes]);

  // 1) Строим базовые строки из корневых нод (стабильно, без новых ссылок на каждом рендере)
  const baseRows: Row[] = useMemo(() => {
    const nodes = root.nodes ?? [];
    return nodes
      .filter((n) => !!n?.id)
      .map((n) => ({
        id: n.id!,
        name: n.name ?? '',
        kind: normalizeKind(n.__typename),
        parentId: n.parentNodeId ?? null,
        depth: 0,
        isExpanded: false,
        hasNextPage: false,
        endCursor: null,
      }));
  }, [root.nodes]); // ← зависит только от данных из аполло

  // 2) Одноразовая инициализация плоского списка, когда пришли корневые ноды
  useEffect(() => {
    if (root.loading) return;           // ждём сеть
    if (flat.length > 0) return;        // уже инициализировано
    if (baseRows.length === 0) return;  // реально пусто — нечего добавлять
    setFlat(baseRows);
  }, [root.loading, baseRows.length, flat.length]);

  async function loadMoreRoot() {
    if (!root.pageInfo?.hasNextPage) return;
    await root.loadMore();
    setRootAfter(root.pageInfo?.endCursor ?? null);
  }

  async function onToggleFolder(r: Row) {
    if (r.kind !== 'Folder') return;

    if (r.isExpanded) {
      animateNext();
      setFlat((prev) => removeSubtree(prev, r.id));
      return;
    }

    const res = await childrenRepo.load(r.id, null);
    const kids = (childrenRepo.nodes ?? [])
      .filter((n) => !!n?.id)
      .map((n) => ({
        id: n.id!, name: n.name ?? '', kind: normalizeKind(n.__typename), parentId: n.parentNodeId ?? r.id,
      }));
    const pageInfo = {
      endCursor: res.data?.listProfileNodes?.pageInfo?.endCursor ?? null,
      hasNextPage: !!res.data?.listProfileNodes?.pageInfo?.hasNextPage,
    };

    animateNext();
    setFlat((prev) => insertChildren(prev, r.id, r.depth + 1, kids, pageInfo));
  }

  async function onLoadMoreChildren(parent: Row) {
    if (parent.kind !== 'Folder' || !parent.isExpanded) return;
    const after = parent.endCursor ?? null;

    const res = await childrenRepo.load(parent.id, after);
    const kids = (childrenRepo.nodes ?? [])
      .filter((n) => !!n?.id)
      .map((n) => ({
        id: n.id!, name: n.name ?? '', kind: normalizeKind(n.__typename), parentId: n.parentNodeId ?? parent.id,
      }));
    const pageInfo = {
      endCursor: res.data?.listProfileNodes?.pageInfo?.endCursor ?? null,
      hasNextPage: !!res.data?.listProfileNodes?.pageInfo?.hasNextPage,
    };

    animateNext();
    setFlat((prev) => insertChildren(prev, parent.id, parent.depth + 1, kids, pageInfo));
  }

  const renderItem = ({ item }: ListRenderItemInfo<Row>) => {
    const showMoreChildren = item.kind === 'Folder' && item.isExpanded && item.hasNextPage;
    return (
      <View>
        <NodeRow row={item} onToggle={onToggleFolder} />
        {showMoreChildren && (
          <Pressable style={{ paddingLeft: (item.depth + 1) * 16, paddingVertical: 6 }}
                     onPress={() => onLoadMoreChildren(item)}>
            <Text>Load more items…</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Временный HUD — можно убрать после проверки */}
      <View style={{ padding: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8, borderRadius: 8 }}>
        <Text>root.loading: {String(root.loading)}</Text>
        <Text>root.nodes: {String(root.nodes?.length ?? 0)}</Text>
        <Text>baseRows: {String(baseRows.length)}</Text>
        <Text>flat: {String(flat.length)}</Text>
        <Text>error: {String(root.error?.message || '—')}</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={flat}
        keyExtractor={(r, i) => `${r.id || 'noid'}-${r.parentId || 'root'}-${r.depth}-${i}`}
        renderItem={renderItem}
        onEndReached={loadMoreRoot}
        onEndReachedThreshold={0.6}
        ListFooterComponent={root.loading || childrenRepo.loading ? <ActivityIndicator /> : null}
      />
      {childrenRepo.error && <Text style={{ color: '#b00', padding: 8 }}>Failed to load children</Text>}
      {root.error && <Text style={{ color: '#b00', padding: 8 }}>Failed to load root</Text>}
    </View>
  );
}

function NodeRow({ row, onToggle }: { row: Row; onToggle: (r: Row) => void }) {
  const pad = { paddingLeft: row.depth * 16 };
  const isFolder = row.kind === 'Folder';
  const icon =
    row.kind === 'Folder' ? (row.isExpanded ? '📂' : '📁') :
      row.kind === 'VideoChannel' ? '🎥' :
        row.kind === 'DigitalInput' ? '🔌' : '🔋';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}>
      {isFolder && (
        <Pressable onPress={() => onToggle(row)} style={{ paddingHorizontal: 6 }}>
          <Text>{row.isExpanded ? '▾' : '▸'}</Text>
        </Pressable>
      )}
      <Text aria-hidden style={{ width: 22, textAlign: 'center' }}>{icon}</Text>
      <Text style={[{ fontSize: 16 }, pad]}>{row.name}</Text>
    </View>
  );
}
