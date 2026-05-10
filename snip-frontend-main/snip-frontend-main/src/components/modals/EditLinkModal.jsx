import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function EditLinkModal({ isOpen, onClose, editData, setEditData, onSubmit, isLoading }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Consistent middle-ground sizing and clean background */}
      <DialogContent className="sm:max-w-md p-6 bg-white border-slate-200 rounded-2xl shadow-xl">
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            Edit Link
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-700">Destination URL *</Label>
            <Input 
              autoFocus
              className="h-10 rounded-xl border-slate-200 focus-visible:ring-orange-500 text-[14px] text-slate-900 shadow-sm" 
              value={editData.originalUrl} 
              onChange={e => setEditData({ ...editData, originalUrl: e.target.value })} 
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-700">Title</Label>
            <Input 
              className="h-10 rounded-xl border-slate-200 focus-visible:ring-orange-500 text-[14px] text-slate-900 shadow-sm" 
              value={editData.title} 
              onChange={e => setEditData({ ...editData, title: e.target.value })} 
            />
          </div>
        </div>

        {/* Structural divider with unified primary button color */}
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
            disabled={isLoading || !editData.originalUrl?.trim()}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}