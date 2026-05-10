import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export function QrModal({ isOpen, onClose, selectedQr }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm p-6 bg-white border-slate-200 rounded-2xl shadow-xl">
        
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight text-center">
            Share via QR
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-4">
            {/* 1 & 4. Better alt text and pixelated rendering for razor-sharp QR */}
            <img 
              src={selectedQr?.url} 
              className="w-44 h-44" 
              alt="QR code for shortened link" 
              style={{ imageRendering: "pixelated" }} 
            />
          </div>
          {/* 5. Added 'link' for better UX context */}
          <p className="font-semibold text-[14px] text-slate-700 truncate w-full px-4 text-center">
            {selectedQr?.title ? `${selectedQr.title} link` : "Your shortened link"}
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-center gap-3 pt-4 mt-2 border-t border-slate-100 sm:space-x-0 w-full">
          <Button 
            variant="ghost" 
            className="flex-1 h-10 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-100 m-0" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="flex-1 h-10 bg-orange-600 hover:bg-orange-500 text-white text-[14px] font-bold rounded-xl shadow-sm transition-all m-0" 
            onClick={() => { 
              // 2. Defensive programming: Prevent crash if URL is missing
              if (!selectedQr?.url) return;
              const a = document.createElement("a"); 
              a.href = selectedQr.url; 
              a.download = "snip-qr.png"; 
              a.click(); 
            }}
          >
            <Download className="w-4 h-4 mr-2" /> Save
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}