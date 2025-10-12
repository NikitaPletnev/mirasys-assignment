export const log = {
  info: (...a: any[]) => console.log('[I]', ...a),
  warn: (...a: any[]) => console.warn('[W]', ...a),
  err:  (...a: any[]) => console.error('[E]', ...a),
};
