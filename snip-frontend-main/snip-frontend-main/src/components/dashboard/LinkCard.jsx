import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { BarChart2, Edit, QrCode, Trash2, Copy, Check, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LinkCard({ link, copiedLink, onCopy, onEdit, onDelete, onQr }) {
  const navigate = useNavigate();
  
  const createdDate = link.createdAt
    ? new Date(link.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Just now";

  const formattedClicks = new Intl.NumberFormat("en-US").format(link.clicks || 0);
  const displayOrigin = window.location.origin;
  const displayHost = window.location.host;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-[1px] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r-full" />

      <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-[17px] text-slate-900 truncate">
              {link.title || "Untitled Link"}
            </h3>
            <span className="flex items-center shrink-0 text-[11px] font-medium text-slate-400 gap-1">
              <Calendar className="w-3 h-3" /> {createdDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-3 max-w-full">
            <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={link.originalUrl}
              className="text-[13px] text-slate-400 hover:text-slate-600 hover:underline truncate block transition-colors"
            >
              {link.originalUrl}
            </a>
          </div>

          <div className="flex items-center gap-2.5 w-fit">
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg">
              <a
                href={`${displayOrigin}/${link.shortId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-bold text-[13px] hover:underline transition-colors"
              >
                {displayHost}/{link.shortId}
              </a>
              <div className="h-3.5 w-px bg-orange-200" />
              <button
                onClick={() => onCopy(link.shortId)}
                title={copiedLink === link.shortId ? "Copied!" : "Copy"}
                aria-label="Copy short link"
                className="text-orange-400 hover:text-orange-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              >
                {copiedLink === link.shortId
                  ? <Check className="w-3.5 h-3.5 text-green-500" />
                  : <Copy className="w-3.5 h-3.5" />
                }
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <Button
            variant="outline"
            size="sm"
            title="View Analytics"
            aria-label="View Analytics"
            onClick={() => navigate(`/analytics/${link._id}`)}
            className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300 rounded-xl px-3 font-semibold gap-1.5"
          >
            <BarChart2 className="w-4 h-4" />
            {formattedClicks}
          </Button>

          <Button
            title="Generate QR Code"
            aria-label="Generate QR Code"
            variant="outline"
            size="sm"
            onClick={() => onQr({ url: link.qrCode, title: link.title })}
            className="bg-white border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl px-2.5"
          >
            <QrCode className="w-4 h-4" />
          </Button>

          <Button
            title="Edit Link"
            aria-label="Edit Link"
            variant="outline"
            size="sm"
            onClick={() => onEdit({ id: link._id, title: link.title, originalUrl: link.originalUrl })}
            className="bg-white border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl px-2.5"
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            title="Delete Link"
            aria-label="Delete Link"
            variant="outline"
            size="sm"
            onClick={() => onDelete(link._id)}
            className="bg-white border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 rounded-xl px-2.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}