import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";

export function CreateLinkModal({ isOpen, onClose, formData, setFormData, onSubmit, isLoading }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 1. Compact max-w-md, clean white background, proper rounding */}
      <DialogContent className="sm:max-w-md p-6 bg-white border-slate-200 rounded-2xl shadow-xl">
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            Create new link
          </DialogTitle>
        </DialogHeader>

        {/* 2. Form fields with consistent gaps and clean h-10 inputs */}
        <div className="flex flex-col gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-700">Destination URL *</Label>
            <Input 
              autoFocus 
              className="h-10 rounded-xl border-slate-200 focus-visible:ring-orange-500 text-[14px] text-slate-900 placeholder:text-slate-400 shadow-sm" 
              placeholder="https://example.com/very-long-url" 
              value={formData.originalUrl} 
              onChange={e => setFormData({ ...formData, originalUrl: e.target.value })} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium text-slate-700">Title (Optional)</Label>
              <Input 
                className="h-10 rounded-xl border-slate-200 focus-visible:ring-orange-500 text-[14px] text-slate-900 placeholder:text-slate-400 shadow-sm" 
                placeholder="My Campaign" 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium text-slate-700">Custom Alias</Label>
              <Input 
                className="h-10 rounded-xl border-slate-200 focus-visible:ring-orange-500 text-[14px] text-slate-900 placeholder:text-slate-400 shadow-sm" 
                placeholder="my-brand" 
                value={formData.customAlias} 
                onChange={e => setFormData({ ...formData, customAlias: e.target.value })} 
            />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="flex items-center text-[13px] font-medium text-slate-700">
              <Calendar className="w-4 h-4 mr-1.5 text-slate-400" /> Expiry Date (Optional)
            </Label>
            <Input 
              className="h-10 rounded-xl border-slate-200 focus-visible:ring-orange-500 text-[14px] text-slate-900 shadow-sm" 
              type="datetime-local" 
              value={formData.expiresAt} 
              onChange={e => setFormData({ ...formData, expiresAt: e.target.value })} 
            />
          </div>
        </div>

        {/* 3. The structural divider (border-t) with NO background color */}
        <DialogFooter className="pt-4 mt-2 border-t border-slate-100 sm:justify-end sm:space-x-3">
          <Button 
            variant="ghost" 
            className="h-10 px-4 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-100" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="h-10 px-6 bg-orange-600 hover:bg-orange-500 text-[14px] font-bold text-white rounded-xl shadow-sm transition-all" 
            onClick={onSubmit} 
            disabled={isLoading || !formData.originalUrl?.trim()}
          >
            {isLoading ? "Creating..." : "Snip it"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}