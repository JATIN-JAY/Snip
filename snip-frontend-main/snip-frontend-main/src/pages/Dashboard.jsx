import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { LinkCard } from "../components/dashboard/LinkCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Link as LinkIcon, Search } from "lucide-react";
import { CreateLinkModal } from "../components/modals/CreateLinkModal";
import { EditLinkModal } from "../components/modals/EditLinkModal";
import { DeleteLinkModal } from "../components/modals/DeleteLinkModal";
import { QrModal } from "../components/modals/QrModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentHost = window.location.host; 

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [formData, setFormData] = useState({ title: "", originalUrl: "", customAlias: "", expiresAt: "" });
  const [editData, setEditData] = useState({ id: null, title: "", originalUrl: "" });
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [selectedQr, setSelectedQr] = useState({ url: "", title: "" });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchLinks(token);
  }, []);

  async function fetchLinks(token) {
    try {
      const res = await api.get(`/api/links`);
      setLinks(res.data.links); 
    } catch (e) { 
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load links"); 
      }
    } finally { 
      setLoading(false); 
    }
  }

  async function handleCreate() {
    if (!formData.originalUrl.trim()) return toast.error("URL is required");
    setSubmitLoading(true);
    try {
      const res = await api.post(`/api/links/shorten`, formData);
      const newLink = { 
        ...res.data, 
        _id: res.data._id, 
        title: formData.title || "Untitled", 
        originalUrl: formData.originalUrl, 
        clicks: 0, 
        qrCode: res.data.qrDataUrl, 
        shortId: res.data.finalId,
        createdAt: new Date().toISOString()
      };
      
      setLinks(prev => [newLink, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: "", originalUrl: "", customAlias: "", expiresAt: "" });
      toast.success("Link Snapped!");
    } catch (e) { 
      toast.error(e.response?.data?.message || "Error creating link"); 
    } finally { 
      setSubmitLoading(false); 
    }
  }

  async function handleEdit() {
    if (!editData.originalUrl.trim()) return toast.error("URL cannot be empty");
    setSubmitLoading(true);
    try {
      await api.patch(`/api/links/${editData.id}`, 
        { title: editData.title, originalUrl: editData.originalUrl }
      );
      
      setLinks(prev => prev.map(l => l._id === editData.id ? { ...l, title: editData.title, originalUrl: editData.originalUrl } : l));
      setIsEditModalOpen(false);
      toast.success("Link Updated");
    } catch (e) { 
      toast.error("Update failed"); 
    } finally { 
      setSubmitLoading(false); 
    }
  }

  async function handleDelete() {
    setSubmitLoading(true);
    try {
      await api.delete(`/api/links/${linkToDelete}`);
      
      setLinks(prev => prev.filter(l => l._id !== linkToDelete));
      setIsDeleteModalOpen(false);
      toast.success("Link Deleted");
    } catch (e) { 
      toast.error("Delete failed"); 
    } finally { 
      setSubmitLoading(false); 
      setLinkToDelete(null); 
    }
  }

  const copyToClipboard = (shortId) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortId}`);
    setCopiedLink(shortId);
    toast.success("Link copied!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const filteredLinks = links.filter(link => 
    (link.title && link.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (link.originalUrl && link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (link.shortId && link.shortId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <DashboardHeader />

      <main className="max-w-5xl mx-auto p-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Your Links</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-xl w-full"
              />
            </div>
            <Button 
              className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-sm transition-all font-bold px-5 w-full sm:w-auto" 
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} /> Create Link
            </Button>
          </div>
        </div>

        {!loading && links.length > 0 && <DashboardStats links={links} />}

        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-28 w-full border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm mt-8">
            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No links created yet</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              You haven't shortened any URLs yet. Create your first Snip to start tracking analytics.
            </p>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm" 
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Create your first link
            </Button>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm mt-8">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No results found</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              We couldn't find any links matching "{searchQuery}".
            </p>
            <Button 
              variant="outline"
              className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl" 
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredLinks.map((link) => (
              <LinkCard 
                key={link._id} 
                link={link} 
                currentHost={currentHost}
                copiedLink={copiedLink}
                onCopy={copyToClipboard}
                onEdit={(data) => { setEditData(data); setIsEditModalOpen(true); }}
                onDelete={(id) => { setLinkToDelete(id); setIsDeleteModalOpen(true); }}
                onQr={(data) => { setSelectedQr(data); setIsQrModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </main>

      <CreateLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        formData={formData} 
        setFormData={setFormData} 
        onSubmit={handleCreate} 
        isLoading={submitLoading} 
      />
      <EditLinkModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        editData={editData} 
        setEditData={setEditData} 
        onSubmit={handleEdit} 
        isLoading={submitLoading} 
      />
      <DeleteLinkModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onSubmit={handleDelete} 
        isLoading={submitLoading} 
      />
      <QrModal 
        isOpen={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)} 
        selectedQr={selectedQr} 
      />
    </div>
  );
}