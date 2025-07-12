import { LOCALSTORAGE_KEYS, ROUTES } from "@/constants";
import useUser from "@/hooks/use-user";
import { getItem } from "@/services/local-storage";
import { Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";

const ProtectedPagesLayout = () => {
  const accessToken = getItem(LOCALSTORAGE_KEYS.AUTH.ACCESS_TOKEN);

  const { loading, error, data } = useUser();

  if (!accessToken) return <Navigate to={ROUTES.AUTH.LOGIN} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    const isAuthError = error?.graphQLErrors?.some(
      (err) =>
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.extensions?.code === "FORBIDDEN"
    );

    if (isAuthError) {
      localStorage.clear();
      window.location.href = ROUTES.AUTH.LOGIN;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your connection and try again
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data?.me) {
    window.location.href = ROUTES.AUTH.LOGIN;
  }

  return <AppLayout />;
};

export default ProtectedPagesLayout;
