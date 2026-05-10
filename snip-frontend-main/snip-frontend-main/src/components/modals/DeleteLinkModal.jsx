import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "../ui/alert-dialog";
import { Trash2 } from "lucide-react";

export function DeleteLinkModal({ isOpen, onClose, onSubmit, isLoading }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* FIXED: Removed default harsh border, added soft border-slate-200 and shadow-xl */}
      <AlertDialogContent className="sm:max-w-sm rounded-3xl p-6 border border-slate-100 shadow-2xl bg-white">
        
        <div className="flex flex-col items-center text-center pt-2">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-5">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            Delete Link?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] text-slate-500 mt-2 leading-relaxed">
            This action cannot be undone. All analytics and QR codes will stop working.
          </AlertDialogDescription>
        </div>

        {/* Side-by-side buttons exactly like your screenshot */}
        <AlertDialogFooter className="flex flex-row justify-center gap-3 mt-6 sm:space-x-0 w-full">
          <AlertDialogCancel 
            className="flex-1 h-11 rounded-xl text-[14px] font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 m-0 transition-colors"
            onClick={onClose}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-[14px] font-bold rounded-xl shadow-sm transition-all m-0"
            onClick={(e) => { e.preventDefault(); onSubmit(); }}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, delete it"}
          </AlertDialogAction>
        </AlertDialogFooter>
        
      </AlertDialogContent>
    </AlertDialog>
  );
}