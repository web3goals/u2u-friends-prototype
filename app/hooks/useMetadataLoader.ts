import { loadJsonFromIpfs } from "@/lib/ipfs";
import { useEffect, useState } from "react";
import useError from "./useError";

/**
 * Load metadata from specified uri.
 */
export default function useMetadataLoader<T>(uri?: string): {
  data: T | undefined;
} {
  const { handleError } = useError();
  const [data, setData] = useState<T | undefined>();

  useEffect(() => {
    setData(undefined);
    if (uri) {
      loadJsonFromIpfs(uri)
        .then((data) => {
          setData(data);
        })
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  return { data };
}
