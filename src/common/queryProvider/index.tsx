import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { PropsWithChildren } from "react";

const MAX_RETRIES = 3;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount >= MAX_RETRIES) {
          return false;
        }

        if (
          isAxiosError(error) &&
          HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0)
        ) {
          return false;
        }

        return true;
      },
    },
  },
});

export const ReactQueryProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
