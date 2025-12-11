import { useCallback, useEffect, useRef, useState } from "react";

import { renderAsciiFromFile, renderAsciiFromUrl } from "../api";
import type { AsciiRenderOptions, AsciiRenderResponse } from "../types";

interface UseAsciiRenderConfig {
  pollIntervalMs?: number;
  maxRetries?: number;
}

type AsciiRenderSource =
  | { type: "url"; url: string; options?: AsciiRenderOptions }
  | { type: "file"; file: File; options?: AsciiRenderOptions };

export function useAsciiRender(
  config: UseAsciiRenderConfig = {}
): {
  ascii: string | null;
  data: AsciiRenderResponse | null;
  loading: boolean;
  error: string | null;
  renderFromUrl: (url: string, options?: AsciiRenderOptions) => void;
  renderFromFile: (file: File, options?: AsciiRenderOptions) => void;
  retry: () => void;
} {
  const { pollIntervalMs = 2000, maxRetries = 2 } = config;

  const [data, setData] = useState<AsciiRenderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lastSource = useRef<AsciiRenderSource | null>(null);
  const retryCount = useRef(0);
  const retryTimeout = useRef<number | null>(null);

  const clearRetry = useCallback(() => {
    if (retryTimeout.current !== null) {
      window.clearTimeout(retryTimeout.current);
      retryTimeout.current = null;
    }
  }, []);

  const execute = useCallback(
    async (source: AsciiRenderSource) => {
      setLoading(true);

      try {
        const response =
          source.type === "url"
            ? await renderAsciiFromUrl(source.url, source.options)
            : await renderAsciiFromFile(source.file, source.options);

        setData(response);
        setError(null);
        setLoading(false);
        retryCount.current = 0;
        clearRetry();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Request failed";

        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          retryTimeout.current = window.setTimeout(() => {
            void execute(source);
          }, pollIntervalMs);
        } else {
          setError(message);
          setLoading(false);
          clearRetry();
        }
      }
    },
    [clearRetry, maxRetries, pollIntervalMs]
  );

  const renderFromUrl = useCallback(
    (url: string, options?: AsciiRenderOptions) => {
      const source: AsciiRenderSource = { type: "url", url, options };
      lastSource.current = source;
      retryCount.current = 0;
      clearRetry();
      setData(null);
      setError(null);
      void execute(source);
    },
    [clearRetry, execute]
  );

  const renderFromFile = useCallback(
    (file: File, options?: AsciiRenderOptions) => {
      const source: AsciiRenderSource = { type: "file", file, options };
      lastSource.current = source;
      retryCount.current = 0;
      clearRetry();
      setData(null);
      setError(null);
      void execute(source);
    },
    [clearRetry, execute]
  );

  const retry = useCallback(() => {
    if (!lastSource.current) return;

    retryCount.current = 0;
    clearRetry();
    void execute(lastSource.current);
  }, [clearRetry, execute]);

  useEffect(() => clearRetry, [clearRetry]);

  return {
    ascii: data?.ascii ?? null,
    data,
    loading,
    error,
    renderFromUrl,
    renderFromFile,
    retry,
  };
}
