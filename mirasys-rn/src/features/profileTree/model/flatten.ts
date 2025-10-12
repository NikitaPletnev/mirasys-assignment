export function insertChildren(
  flat: Row[],
  parentId: string,
  childDepth: number,
  kids: Array<{ id: string; name: string; kind: Kind; parentId: string | null }>,
  pageInfo: { endCursor: string | null; hasNextPage: boolean },
): Row[] {
  const idx = flat.findIndex((n) => n.id === parentId);
  if (idx === -1) return flat;

  let subtreeEnd = idx + 1;
  while (subtreeEnd < flat.length && flat[subtreeEnd].depth > flat[idx].depth) subtreeEnd++;

  const existingChildIds = new Set(
    flat.slice(idx + 1, subtreeEnd)
      .filter((r) => r.depth === childDepth && r.parentId === parentId)
      .map((r) => r.id),
  );

  let insertAt = idx + 1;
  for (let i = idx + 1; i < subtreeEnd; i++) {
    if (flat[i].depth === childDepth && flat[i].parentId === parentId) insertAt = i + 1;
  }

  const newRows: Row[] = kids
    .filter((k) => !!k.id && !existingChildIds.has(k.id))
    .map((k) => ({
      id: k.id,
      name: k.name,
      kind: k.kind,
      parentId: k.parentId ?? parentId,
      depth: childDepth,
      isExpanded: false,
      hasNextPage: false,
      endCursor: null,
    }));

  if (!newRows.length) {
    const parent = flat[idx];
    if (parent.isExpanded !== true ||
      parent.endCursor !== pageInfo.endCursor ||
      parent.hasNextPage !== pageInfo.hasNextPage) {
      const next = flat.slice();
      next[idx] = { ...parent, isExpanded: true, endCursor: pageInfo.endCursor, hasNextPage: pageInfo.hasNextPage };
      return next;
    }
    return flat;
  }

  const next = [...flat.slice(0, insertAt), ...newRows, ...flat.slice(insertAt)];
  next[idx] = { ...next[idx], isExpanded: true, endCursor: pageInfo.endCursor, hasNextPage: pageInfo.hasNextPage };
  return next;
}
