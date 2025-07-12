import { LOCALSTORAGE_KEYS } from "@/constants";
import { MeDocument } from "@/graphql/types";
import { getItem } from "@/services/local-storage";
import { useQuery } from "@apollo/client";

const useUser = () => {
  const accessToken = getItem(LOCALSTORAGE_KEYS.AUTH.ACCESS_TOKEN);

  return useQuery(MeDocument, {
    skip: !accessToken,
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });
};

export default useUser;
