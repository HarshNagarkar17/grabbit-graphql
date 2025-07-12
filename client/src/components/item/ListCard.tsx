import { Folder, Link, FileText, Github, Youtube } from "lucide-react";
import { formatDate } from "@/utils/generalUtils";

const getIcon = (type: string, className = "h-5 w-5") => {
  switch (type) {
    case "folder":
      return <Folder className={`${className} text-blue-500`} />;
    case "youtube":
      return <Youtube className={`${className} text-red-500`} />;
    case "github":
      return <Github className={`${className} text-gray-700`} />;
    case "blog":
      return <Link className={`${className} text-blue-600`} />;
    case "text":
      return <FileText className={`${className} text-green-600`} />;
    default:
      return <FileText className={`${className} text-gray-500`} />;
  }
};

const getBadgeClass = (type: string) => {
  const baseClass =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  switch (type) {
    case "youtube":
      return `${baseClass} bg-red-50 text-red-700 border border-red-200`;
    case "github":
      return `${baseClass} bg-gray-50 text-gray-700 border border-gray-200`;
    case "blog":
      return `${baseClass} bg-blue-50 text-blue-700 border border-blue-200`;
    case "text":
      return `${baseClass} bg-green-50 text-green-700 border border-green-200`;
    default:
      return `${baseClass} bg-gray-50 text-gray-700 border border-gray-200`;
  }
};

interface Props {
  item: {
    type: string;
    url: string;
    title: string;
    createdAt: string;
  };
}
const ListCard = ({ item }: Props) => {
  return (
    <>
      <div className="flex-shrink-0">{getIcon(item.type)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          {item.type !== "folder" && (
            <span className={getBadgeClass(item.type)}>{item.type}</span>
          )}
        </div>
        {item.url && (
          <p className="text-sm text-gray-500 truncate">{item.url}</p>
        )}
      </div>

      <div className="flex-shrink-0 text-xs text-gray-400">
        {formatDate(item.createdAt)}
      </div>
    </>
  );
};

export default ListCard;
