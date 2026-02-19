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
    setDeleting(false);
  }
};

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => !deleting && onClose()}
    />

    {/* Modal */}
    <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 animate-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl ${
            deleteSuccess
              ? "bg-green-100 text-green-600"
              : deleteFailed
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
          }`}
        >
          {deleteSuccess ? (
            <Check size={18} />
          ) : deleteFailed ? (
            <XCircle size={18} />
          ) : (
            <Trash2 size={18} />
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900">
          {deleteSuccess
            ? "Trip Deleted"
            : deleteFailed
              ? "Delete Failed"
              : "Delete Trip?"}
        </h3>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-500 mt-3">
        {deleteSuccess
          ? "The trip has been deleted successfully."
          : deleteFailed
            ? "Something went wrong. Please try again."
            : "This action cannot be undone."}
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        {!deleteSuccess && (
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 disabled:opacity-60"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting || deleteSuccess}
          className={`flex-1 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
              ${
                deleteFailed
                  ? "bg-red-600 text-white"
                  : deleteSuccess
                    ? "bg-green-600 text-white"
                    : deleting
                      ? "bg-red-600 text-white"
                      : "bg-red-600 text-white hover:bg-red-700"
              }
            `}
        >
          {deleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting…
            </>
          ) : deleteSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Deleted
            </>
          ) : deleteFailed ? (
            <>
              <XCircle className="h-4 w-4" />
              Retry
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);
}


export default React.memo(DeleteModal);