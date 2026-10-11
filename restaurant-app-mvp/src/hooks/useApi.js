import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';

/** Reusable request state for screens that read data from the REST API. */
export default function useApi(path, options = {}, enabled = true) {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(Boolean(enabled)); const [error, setError] = useState('');
  const optionsKey = JSON.stringify({ method: options.method || 'GET', body: options.body || null, headers: options.headers || {} });
  const requestOptions = useMemo(() => ({ ...options }), [optionsKey]);
  const refetch = useCallback(async () => {
    if (!enabled) return null;
    setLoading(true); setError('');
    try { const result = await apiRequest(path, requestOptions); setData(result); return result; }
    catch (e) { setError(e.message || 'Something went wrong'); throw e; }
    finally { setLoading(false); }
  }, [path, optionsKey, enabled]);
  useEffect(() => {
    if (!enabled) { setLoading(false); return undefined; }
    let alive = true; setLoading(true); setError('');
    apiRequest(path, requestOptions).then(result => { if (alive) setData(result); }).catch(e => { if (alive) setError(e.message || 'Something went wrong'); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path, optionsKey, enabled]);
  return { data, loading, error, refetch };
}
