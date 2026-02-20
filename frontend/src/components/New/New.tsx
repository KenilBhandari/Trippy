import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type { NewTripInput } from "../../types";
import {
  ArrowDown,
  ArrowUpDown,
  Truck,
  Check,
  Loader2,
  MapPin,
  XCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import { useDataContext } from "../../context/TripContext";

interface NewTripTabProps {
  onAddTrip: (trip: NewTripInput) => Promise<void> | void;
}

const NewTripTab = ({ onAddTrip }: NewTripTabProps) => {
  const [startPoint, setStartPoint] = useState("SDY");
  const [endPoint, setEndPoint] = useState("Vapi");
  const [tripDate, setTripDate] = useState<Date>(new Date());
  const [fare, setFare] = useState<number>(1200);
  const [numberPlate, setNumberPlate] = useState<string | null>("5281");
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addFailed, setAddFailed] = useState(false);

  const { addingTrip, setAddingTrip, startLocations, endLocations } =
    useDataContext();
  const tripTimestamp = tripDate.setHours(0, 1, 0, 1);
  const isDisabledAddBtn =
    !startPoint.trim() ||
    !endPoint.trim() ||
    !tripDate ||
    fare <= 0 ||
    addSuccess ||
    addFailed;

  const handleAdd = async () => {
    if (!startPoint || !endPoint || !tripDate) return;

    try {
      setAddingTrip(true);
      setAddSuccess(false);

      await onAddTrip({
        startPoint,
        endPoint,
        fare,
        numberPlate: numberPlate,
        tripDate: tripTimestamp,
        returnTrip: isReturnTrip,
      });

      setAddSuccess(true);

      setStartPoint("SDY");
      setEndPoint("Vapi");
      setTripDate(tripDate);
      setFare(1200);

      setTimeout(() => {
        setAddSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to add trip:", error);
      setAddFailed(true);
      setTimeout(() => {
        setAddFailed(false);
      }, 1500);
      // alert("Trip could not be saved. Please try again.");
    } finally {
      setAddingTrip(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm w-full overflow-hidden">
      {/* Header - Refined & Grounded */}
      <div className="px-6 py-4 bg-white border-b border-slate-300">
        <h2 className="text-base font-bold tracking-wide text-slate-900 uppercase">
          New Trip
        </h2>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Route Section */}
        <div className="space-y-4">
          {/* Starting Point */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Starting Point
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin
                  size={18}
                  className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
                />
              </div>
              <input
                type="text"
                autoComplete="off"
                value={startPoint}
                placeholder="Enter origin..."
                onChange={(e) => {
                  setStartPoint(e.target.value);
                  setShowStartSuggestions(false);
                }}
                onFocus={() => setShowStartSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowStartSuggestions(false), 200)
                }
                className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
              />

              {/* Suggestions Dropdown */}
              {showStartSuggestions && startLocations.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.1)] overflow-hidden">
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                    {startLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onMouseDown={() => {
                          setStartPoint(loc);
                          setShowStartSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-900 hover:text-white text-xs font-black uppercase transition-colors flex items-center justify-between group"
                      >
                        {loc}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logic-Based Connector */}
          <div className="flex items-center justify-center relative py-1">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t-2 border-slate-100"></div>
            </div>
            <button
              type="button"
              onClick={() => setIsReturnTrip((prev) => !prev)}
              className={`relative z-10 ${isReturnTrip ? "bg-blue-600 text-white" : "bg-white text-slate-600"} p-2 rounded-md border-2 border-slate-300  md:hover:border-slate-900 transition-all shadow-sm active:scale-90`}
            >
              {isReturnTrip ? (
                <ArrowUpDown size={18} strokeWidth={3} />
              ) : (
                <ArrowDown size={18} strokeWidth={3} />
              )}
            </button>
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Destination
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin
                  size={18}
                  className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
                />
              </div>
              <input
                type="text"
                autoComplete="off"
                value={endPoint}
                placeholder="Enter destination..."
                onChange={(e) => {
                  setEndPoint(e.target.value);
                  setShowEndSuggestions(false);
                }}
                onFocus={() => setShowEndSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowEndSuggestions(false), 200)
                }
                className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
              />

              {showEndSuggestions && endLocations.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.1)] overflow-hidden">
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                    {endLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onMouseDown={() => {
                          setEndPoint(loc);
                          setShowEndSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-900 hover:text-white text-xs font-black uppercase transition-colors flex items-center justify-between group"
                      >
                        {loc}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-all"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fare Section */}
        <div className="flex flex-col gap-1.5 pt-2">
          <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Fare Amount
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 font-black text-slate-400 text-xl italic">
              ₹
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={fare === 0 ? "" : fare}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9]*$/.test(val)) setFare(val === "" ? 0 : Number(val));
              }}
              placeholder="0.00"
              className="w-full font-black text-xl pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Trip Date
            </label>
            <DatePicker
              selected={tripDate}
              onChange={(date: Date | null) => date && setTripDate(date)}
              maxDate={new Date()}
              popperPlacement="bottom-start"
              // wrapperClassName allows the datepicker container to fill the parent
              wrapperClassName="w-full"
              customInput={
                <button className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-sm font-black text-slate-900 hover:border-slate-400 transition-all">
                  {tripDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                  <Calendar size={18} className="text-slate-500" />
                </button>
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Vehicle No.
            </label>
            <div className="relative flex items-center">
              <Truck className="absolute left-3 text-slate-400" size={18} />
              <input
                type="text"
                value={numberPlate ?? ""}
                placeholder="GJ 15..."
                onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
                className="w-full font-black text-sm pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 uppercase focus:bg-white focus:border-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button - Thick Industrial Action */}
        <button
          onClick={handleAdd}
          disabled={isDisabledAddBtn || addingTrip}
          className={`w-full py-4 md:py-5 font-black text-sm uppercase tracking-[0.3em] rounded-lg transition-all duration-200 flex items-center justify-center gap-3 borde
          ${
            addFailed
              ? "bg-red-600 border-red-800 text-white shadow-lg shadow-red-100"
              : addSuccess
                ? "bg-emerald-600 border-emerald-800 text-white shadow-lg shadow-emerald-100"
                : addingTrip
                  ? "bg-slate-400 border-slate-500 text-white cursor-wait"
                  : isDisabledAddBtn
                    ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed border-b-0"
                    : "bg-slate-900 border-black text-white active:border-b-0 active:translate-y-[4px] shadow-lg shadow-slate-200"
          }`}
        >
          {addingTrip ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : addSuccess ? (
            <Check className="h-5 w-5" strokeWidth={3} />
          ) : addFailed ? (
            <XCircle className="h-5 w-5" />
          ) : null}
          {addingTrip
            ? "Processing"
            : addSuccess
              ? "Saved"
              : addFailed
                ? "Failed"
                : "Add Trip"}
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default React.memo(NewTripTab);
