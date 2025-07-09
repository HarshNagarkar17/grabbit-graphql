import { LOCALSTORAGE_KEYS, ROUTES } from "@/constants";
import { MeDocument } from "@/graphql/types";
import { getItem } from "@/services/local-storage";
import { useQuery } from "@apollo/client";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedPagesLayout = () => {
  const { loading, error, data } = useQuery(MeDocument, {
    skip: !getItem(LOCALSTORAGE_KEYS.AUTH.ACCESS_TOKEN),
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <div>loading...</div>;
  if (error || !data?.me.id) return <Navigate to={ROUTES.AUTH.LOGIN} />;

  return <Outlet />;
};

export default ProtectedPagesLayout;
