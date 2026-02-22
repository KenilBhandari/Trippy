import React, { useState } from "react";
import { Trash2, Check, XCircle, Loader2 } from "lucide-react";
import type { Trip } from "../../types";

type DeleteModalProps = {
  trip: Trip;
  onDelete: (trip: Trip) => Promise<void>;
  onClose: () => void;
};

const DeleteModal = ({
  trip,
  onDelete,
  onClose,
}: DeleteModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  if (!trip) return; // safety check

const handleDelete = async () => {
  setDeleting(true);
  setDeleteFailed(false);
  setDeleteSuccess(false);

  try {
    await onDelete(trip);

    setDeleteSuccess(true);
    setDeleting(false);

    setTimeout(() => {
      onClose();
      setDeleteSuccess(false);
    }, 1200);
  } catch (error) {
    console.error(error);
    setDeleteFailed(true);
    
    setTimeout(() => {
          setDeleteFailed(false);
          
    }, 900);
    
    setDeleting(false);
  }
};

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm"
      onClick={() => !deleting && onClose()}
    />
    {/* Modal */}
    <div className="relative bg-white w-full max-w-xs rounded-xl shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden">

      {/* Body */}
      <div className="px-5 pt-5 pb-4">
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              deleteSuccess
                ? "bg-green-100 text-green-600"
                : deleteFailed
                  ? "bg-red-100 text-red-500"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {deleteSuccess ? (
              <Check size={18} strokeWidth={2.5} />
            ) : deleteFailed ? (
              <XCircle size={18} />
            ) : (
              <Trash2 size={18} />
            )}
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-slate-800">
              {deleteSuccess
                ? "Trip Deleted"
                : deleteFailed
                  ? "Delete Failed"
                  : "Delete Trip?"}
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              {deleteSuccess
                ? "The trip was removed successfully."
                : deleteFailed
                  ? "Something went wrong. Try again."
                  : "This action cannot be undone."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!deleteSuccess && (
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg text-[12px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting || deleteSuccess}
            className={`flex-1 py-2 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors
              ${
                deleteSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
              }
            `}
          >
            {deleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting…
              </>
            ) : deleteSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Deleted
              </>
            ) : deleteFailed ? (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Retry
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}


export default React.memo(DeleteModal);