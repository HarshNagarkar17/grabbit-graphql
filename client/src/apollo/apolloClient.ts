import { LOCALSTORAGE_KEYS, ROUTES } from "@/constants";
import { getItem } from "@/services/local-storage";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/graphql`,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = getItem(LOCALSTORAGE_KEYS.AUTH.ACCESS_TOKEN);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const roundTripLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });

  return forward(operation).map((data) => {
    const start = operation.getContext().start as Date;
    const time = new Date().getTime() - start.getTime();
    console.log(
      `Operation ${operation.operationName} took ${time}ms to complete`
    );
    return data;
  });
});

const errorLink = onError(({ graphQLErrors, networkError, protocolErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
    graphQLErrors.some((error) => {
      if (
        error.extensions?.code === "UNAUTHENTICATED" ||
        error.extensions?.code === "FORBIDDEN"
      ) {
        localStorage.clear();
        window.location.href = ROUTES.AUTH.LOGIN;
      }
    });
  }

  if (protocolErrors) {
    protocolErrors.forEach(({ message, extensions }) => {
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      );
    });
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const cache = new InMemoryCache({});

const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, roundTripLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
export default apolloClient;
