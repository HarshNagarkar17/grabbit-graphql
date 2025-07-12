import { Skeleton } from "@/components/ui/skeleton";

const ItemStatCard = ({
  name,
  count,
  loading,
}: {
  name: string;
  count: number;
  loading: boolean;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      {loading ? (
        <>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </>
      ) : (
        <>
          <div className="text-2xl font-semibold text-gray-900">{count}</div>
          <div className="text-sm text-gray-500 mt-1">{name}</div>
        </>
      )}
    </div>
  );
};

export default ItemStatCard;
