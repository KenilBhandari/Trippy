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
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
      onClick={() => !deleting && onClose()}
    />
    {/* Modal */}
    <div className="relative bg-white w-full max-w-sm rounded-lg shadow-2xl border border-slate-300 animate-in zoom-in-95 duration-150 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-slate-300">
        <h2 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
          Delete Trip
        </h2>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center gap-2 mb-5">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${
              deleteSuccess
                ? "bg-emerald-100 text-emerald-600"
                : deleteFailed
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-600"
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
            <h3 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
              {deleteSuccess
                ? "Trip Deleted"
                : deleteFailed
                  ? "Delete Failed"
                  : "Delete Trip?"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
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
              className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.2em] text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting || deleteSuccess}
            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 transition-colors
              ${
                deleteSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
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
