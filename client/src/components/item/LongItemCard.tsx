import {
  formatDate,
  getBadgeClass,
  truncateContent,
} from "@/utils/generalUtils";
import { Youtube, FileText, Github, Link, ExternalLink } from "lucide-react";

interface Props {
  item: {
    id: string;
    title: string;
    url: string;
    createdAt: string;
    type: string;
  };
  index: number;
}

const getIcon = (type: string) => {
  const iconProps = { className: "h-4 w-4" };
  switch (type) {
    case "youtube":
      return <Youtube {...iconProps} className="h-4 w-4 text-red-600" />;
    case "github":
      return <Github {...iconProps} className="h-4 w-4 text-gray-900" />;
    case "blog":
      return <Link {...iconProps} className="h-4 w-4 text-blue-600" />;
    case "text":
      return <FileText {...iconProps} className="h-4 w-4 text-green-600" />;
    default:
      return <FileText {...iconProps} />;
  }
};
const LongItemCard = ({ item, index }: Props) => {
  return (
    <div
      key={item.id}
      className="content-card p-6 fade-in group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">{getIcon(item.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {item.title}
              </h3>
              <span className={getBadgeClass(item.type)}>{item.type}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {item.type === "text" ? truncateContent(item.url) : item.url}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Saved on {formatDate(item.createdAt)}
              </span>
              {item.type !== "text" && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <span>Open</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongItemCard;
