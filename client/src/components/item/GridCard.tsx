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

const GridCard = ({ item }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        {getIcon(item.type, "h-8 w-8")}
        {item.type !== "folder" && (
          <span className={getBadgeClass(item.type)}>{item.type}</span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          {item.url && (
            <p className="text-xs text-gray-500 line-clamp-2">{item.url}</p>
          )}
        </div>

        <div className="mt-auto pt-2">
          <span className="text-xs text-gray-400">
            {formatDate(item.createdAt)}
          </span>
        </div>
      </div>
    </>
  );
};

export default GridCard;
