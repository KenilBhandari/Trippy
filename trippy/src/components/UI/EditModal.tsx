import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  Loader2,
  Check,
  ArrowUpDown,
  MapPin,
  Edit,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDataContext } from "../../context/TripContext";
import type { Trip } from "../../types";

type EditModalProps = {
  onUpdate: (updatedTrip: Trip) => Promise<void>;
};

const EditModal = ({ onUpdate }: EditModalProps) => {
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

    {/* Modal Content */}
    <div className="relative bg-white w-full max-w-md rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-4 sm:p-6">
      {/* Header matching New Trip style */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-md">
          <Edit size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-800 leading-tight">
            Edit Journey
          </h2>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {/* Start Point Section */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={activeTrip.startPoint || ""}
            placeholder="Starting from..."
            onChange={(e) => {
              handleChange("startPoint", e.target.value);
              setShowStartSuggestions(false);
            }}
            onFocus={() => setShowStartSuggestions(true)}
            onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
            className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
          />
          {showStartSuggestions && (
            <div className="absolute z-20 w-full mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col gap-2">
                {startLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleChange("startPoint", loc)}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:text-gray-900 rounded-lg text-sm font-bold transition-all"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Return Trip Toggle Connector */}
        <div className="flex items-center justify-center -my-1 sm:-my-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTrip((prev: any) => ({
                ...prev,
                returnTrip: !prev.returnTrip,
              }));
            }}
            className="bg-white p-2 rounded-full border border-gray-100 shadow-md text-blue-600 hover:scale-110 active:scale-95 transition-all duration-300"
          >
            {activeTrip.returnTrip ? (
              <ArrowUpDown size={18} strokeWidth={2.5} />
            ) : (
              <ArrowDown size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* End Point Section */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={activeTrip.endPoint || ""}
            placeholder="Going to..."
            onChange={(e) => {
              handleChange("endPoint", e.target.value);
              setShowEndSuggestions(false);
            }}
            onFocus={() => setShowEndSuggestions(true)}
            onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
            className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
          />
          {showEndSuggestions && (
            <div className="absolute z-20 w-full mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col gap-2">
                {endLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleChange("endPoint", loc)}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:text-gray-900 rounded-lg text-sm font-bold transition-all"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fare Section */}
        <div className="space-y-1.5">
          <label className="ml-1 text-xs sm:text-sm font-medium text-gray-400">
            Fare
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <input
              type="number"
              value={activeTrip.fare}
              onChange={(e) => handleChange("fare", Number(e.target.value))}
              placeholder="Enter fare"
              className="w-full font-bold pl-7 pr-4 py-3 sm:py-3.5 bg-white border border-gray-300 rounded-2xl text-gray-900 text-sm sm:text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Date Section */}
        <div className="space-y-1.5">
          <label className="ml-1 text-xs sm:text-sm font-medium text-gray-400">
            Trip Date
          </label>
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 bg-gray-100/50 rounded-2xl w-fit border border-gray-100">
            <DatePicker
              selected={new Date(activeTrip.tripDate)}
              onChange={(date: Date | null) => {
                if (date) handleChange("tripDate", date.getTime());
              }}
              maxDate={new Date()}
              popperPlacement="bottom-start"
              customInput={
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white shadow-sm rounded-2xl text-xs sm:text-sm text-gray-800 font-semibold hover:bg-gray-50 transition-all active:scale-95">
                  <span className="text-blue-500 text-base sm:text-lg">●</span>
                  {new Date(activeTrip.tripDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </button>
              }
            />
            <button
              type="button"
              onClick={() => handleChange("tripDate", Date.now())}
              className="pr-2 sm:pr-4 pl-1 sm:pl-2 py-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setActiveTrip(null)}
            className="flex-1 py-3 sm:py-3.5 bg-gray-100 text-gray-600 rounded-xl sm:rounded-2xl font-bold hover:bg-gray-200 transition-all text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating || updateSuccess}
            className={`flex-[2] py-3 sm:py-3.5 font-bold rounded-xl sm:rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center text-sm sm:text-base
            ${
              updateFailed
                ? "bg-red-600 text-white"
                : updateSuccess
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          `}
          >
            {updating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving…</span>
              </div>
            ) : updateSuccess ? (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Updated!</span>
              </div>
            ) : updateFailed ? (
              <span>Update Failed</span>
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

export default React.memo(EditModal);