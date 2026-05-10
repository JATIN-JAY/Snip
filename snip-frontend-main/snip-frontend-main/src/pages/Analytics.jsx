import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Activity,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import { format, parseISO, subDays, formatDistanceToNow } from "date-fns";
import { TrafficChart } from "../components/analytics/TrafficChart";
import { DevicePieChart } from "../components/analytics/DevicePieChart";
import { TopBrowsersChart } from "../components/analytics/TopBrowsersChart";
import { TopLocationsChart } from "../components/analytics/TopLocationsChart";

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/api/links/analytics/${id}`);
        setLink(response.data.link);
        setClicks(response.data.clicks || []);
      } catch (e) {
        console.error("Failed to fetch analytics:", e);
        setError("Link not found or you don't have permission to view it.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const deviceData = useMemo(() => {
    const counts = clicks.reduce((acc, curr) => {
      const device = curr.device || "Unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [clicks]);

  const browserData = useMemo(() => {
    const counts = clicks.reduce((acc, curr) => {
      const browser = curr.browser || "Unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [clicks]);

  const countryData = useMemo(() => {
    const counts = clicks.reduce((acc, curr) => {
      const country = curr.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [clicks]);

  const timelineData = useMemo(() => {
    if (clicks.length === 0) return [];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { date: format(d, "MMM dd"), rawDate: format(d, "yyyy-MM-dd"), clicks: 0 };
    });
    clicks.forEach((click) => {
      const timeString = click.createdAt || click.timestamp;
      if (!timeString) return;
      const clickDateStr = format(parseISO(timeString), "yyyy-MM-dd");
      const dayIndex = last7Days.findIndex((d) => d.rawDate === clickDateStr);
      if (dayIndex !== -1) last7Days[dayIndex].clicks += 1;
    });
    return last7Days;
  }, [clicks]);

  const lastClickText = useMemo(() => {
    if (clicks.length === 0) return null;
    const latestDate = clicks.reduce((maxDate, click) => {
      const timeString = click.createdAt || click.timestamp;
      if (!timeString) return maxDate;
      const clickDate = new Date(timeString);
      return clickDate > maxDate ? clickDate : maxDate;
    }, new Date(0));
    if (latestDate.getTime() === 0) return null;
    return formatDistanceToNow(latestDate, { addSuffix: true });
  }, [clicks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Activity className="w-8 h-8 text-orange-400 mb-4 animate-bounce" />
            <p className="text-slate-500 font-medium">Crunching your numbers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex justify-center items-center flex-col gap-4 p-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Oops!</h2>
            <p className="text-slate-500 mb-6">{error || "Link data is unavailable."}</p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = link.createdAt
    ? format(new Date(link.createdAt), "MMM dd, yyyy")
    : "Unknown";

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <DashboardHeader />

      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg mb-4 -ml-2 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white tracking-tight truncate mb-1">
                {link.title || "Untitled Link"}
              </h1>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-200 text-[13px] flex items-center gap-1.5 truncate max-w-lg transition-colors"
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                {link.originalUrl}
              </a>
            </div>

            <a
              href={`${window.location.origin}/${link.shortId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-xl text-[13px] font-bold shrink-0 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              {window.location.host}/{link.shortId}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Total Clicks</p>
              <p className="text-3xl font-bold text-white">{link.clicks || 0}</p>
              {lastClickText && (
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lastClickText}
                </p>
              )}
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Unique Devices</p>
              <p className="text-3xl font-bold text-white">{deviceData.length}</p>
              <p className="text-[11px] text-slate-500 mt-1.5">device types tracked</p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Created On</p>
              <p className="text-xl font-bold text-white mt-1">{createdDate}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-5 pb-4">
        {clicks.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No traffic yet</h3>
            <p className="text-slate-500">Share your short link to start seeing analytics here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <TrafficChart timelineData={timelineData} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DevicePieChart deviceData={deviceData} />
              <TopBrowsersChart browserData={browserData} />
              <TopLocationsChart countryData={countryData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
