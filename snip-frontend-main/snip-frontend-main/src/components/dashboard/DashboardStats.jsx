import { BarChart3, Link2, Zap } from "lucide-react";

export function DashboardStats({ links }) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  
  const activeLinks = links.filter((link) => {
    if (!link.expiresAt) return true; 
    return new Date(link.expiresAt) > new Date();
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors">
        <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center">
          <Link2 className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Total Links</p>
          <p className="text-2xl font-bold text-slate-900">{totalLinks}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
        <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Total Clicks</p>
          <p className="text-2xl font-bold text-slate-900">{totalClicks}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-green-200 transition-colors">
        <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">Active Links</p>
          <p className="text-2xl font-bold text-slate-900">{activeLinks}</p>
        </div>
      </div>
    </div>
  );
}