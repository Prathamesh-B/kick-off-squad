"use client";

import { SWRConfig } from "swr";

const swrConfig = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
};

export function SWRProvider({ children }) {
    return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
