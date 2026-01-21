import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Pencil, Loader2, Check, XCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDataContext } from "../../context/TripContext";
import type { Trip } from "../../types"; 

type EditModalProps = {
  onUpdate: (updatedTrip: Trip) => Promise<void>;
};

export default function EditModal({ onUpdate }: EditModalProps) {
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(false);

  const { startLocations, endLocations, activeTrip, setActiveTrip } =
    useDataContext();

  if (!activeTrip) return null;

  const handleChange = (field: keyof Trip, value: string | number) => {
    setActiveTrip({
      ...activeTrip,
      [field]: value,
    });
  };

  const handleUpdate = async () => {
    if (!activeTrip) return;

    try {
      setUpdating(true);
      setUpdateFailed(false);
      setUpdateSuccess(false);

      await onUpdate(activeTrip);

      setUpdateSuccess(true);

      // auto close after success
      setTimeout(() => {
        setActiveTrip(null);
        setUpdateSuccess(false);
      }, 900);
    } catch (error) {
      console.error(error);
      setUpdateFailed(true);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (updateFailed) setUpdateFailed(false);
  }, [activeTrip]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={() => setActiveTrip(null)}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Pencil className="text-white" size={18} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Edit Journey</h3>
            <p className="text-gray-400 text-xs font-medium">
              Update your trip details
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 space-y-6">
          {/* Start Point */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={activeTrip.startPoint || ""}
                placeholder="Starting from..."
                onChange={(e) => {
                  handleChange("startPoint", e.target.value);
                  setShowStartSuggestions(false);
                }}
                onFocus={() => setShowStartSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowStartSuggestions(false), 200)
                }
                className="w-full font-bold text-base px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
              />
              {showStartSuggestions && (
                <div className="absolute z-20 w-full mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col gap-2">
                    {startLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange("startPoint", loc)}
                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold text-gray-600 transition-all"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Return Trip Toggle */}
            <div className="flex items-center justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setActiveTrip((prev: Trip | null) => {
                    if (!prev) return prev;
                    return { ...prev, returnTrip: !prev.returnTrip };
                  });
                }}
                className="bg-white p-1.5 rounded-full border border-gray-100 shadow-md text-gray-400 hover:text-blue-600 transition active:scale-90"
              >
                {activeTrip.returnTrip ? (
                  <div className="flex gap-1 text-blue-600 items-center px-1">
                    <ArrowUp size={16} strokeWidth={3} />
                    <ArrowDown size={16} strokeWidth={3} />
                  </div>
                ) : (
                  <ArrowDown size={18} strokeWidth={3} />
                )}
              </button>
            </div>

            {/* End Point */}
            <div className="relative">
              <input
                type="text"
                value={activeTrip.endPoint || ""}
                placeholder="Going to..."
                onChange={(e) => {
                  handleChange("endPoint", e.target.value);
                  setShowEndSuggestions(false);
                }}
                onFocus={() => setShowEndSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowEndSuggestions(false), 200)
                }
                className="w-full font-bold text-base px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
              />
              {showEndSuggestions && (
                <div className="absolute z-20 w-full mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col gap-2">
                    {endLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange("endPoint", loc)}
                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold text-gray-600 transition-all"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fare */}
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-medium text-gray-400">
              Fare (INR)
            </label>
            <input
              type="number"
              value={activeTrip.fare}
              onChange={(e) => handleChange("fare", Number(e.target.value))}
              placeholder="Enter fare"
              className="w-full font-bold px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-base shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          {/* Trip Date */}
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-medium text-gray-400">
              Trip Date
            </label>
            <div className="flex items-center gap-3 p-1.5 bg-gray-50 rounded-2xl w-fit border border-gray-100">
              <DatePicker
                selected={new Date(activeTrip.tripDate)}
                onChange={(date: Date | null) => {
                  if (date) handleChange("tripDate", date.getTime());
                }}
                popperPlacement="bottom-start"
                maxDate={new Date()}
                customInput={
                  <button className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-xl text-[14px] text-gray-800 font-semibold hover:bg-gray-50 transition-all border border-gray-100">
                    <span className="text-blue-500">●</span>
                    {new Date(activeTrip.tripDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </button>
                }
              />
              <button
                onClick={() => handleChange("tripDate", Date.now())}
                className="pr-4 pl-2 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Today
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpdate}
              disabled={updating || updateSuccess}
              className={`flex-[2] py-3.5 font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center
    ${
      updateFailed
        ? "bg-red-600 text-white"
        : updateSuccess
          ? "bg-green-600 text-white"
          : updating
            ? "bg-blue-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
    }
  `}
            >
              {updating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving…</span>
                </div>
              ) : updateSuccess ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Updated</span>
                </div>
              ) : updateFailed ? (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  <span>Update Failed</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
