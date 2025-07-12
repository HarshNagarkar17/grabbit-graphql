import { LOCALSTORAGE_KEYS } from "@/constants";
import { UserItemsDocument } from "@/graphql/types";
import { useQuery } from "@apollo/client";

export const useGetUserItems = () => {
  const accessToken = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH.ACCESS_TOKEN);

  return useQuery(UserItemsDocument, {
    skip: !accessToken,
  });
};
