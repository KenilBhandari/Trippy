import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type { NewTripInput } from "../../types";
import { ArrowDown, ArrowUpDown, Truck, Check, Loader2, MapPin, XCircle } from "lucide-react";
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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-sm" />
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-800">
          New Trip
        </h2>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {/* From Section */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={startPoint}
            placeholder="Starting from..."
            onChange={(e) => {
              setStartPoint(e.target.value);
              setShowStartSuggestions(false);
            }}
            onFocus={() => setShowStartSuggestions(true)}
            onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
            className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
          />
          {showStartSuggestions && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-slate-300 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Scrollable Area */}
              <div className="max-h-52 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {startLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setStartPoint(loc);
                      setShowStartSuggestions(false); // Close after selection
                    }}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-blue-100"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Return Trip Connector */}
        <div className="flex items-center justify-center -my-1 sm:-my-2 relative z-10">
          <button
            type="button"
            onClick={() => setIsReturnTrip((prev) => !prev)}
            className="bg-white p-2 rounded-full border border-gray-100 shadow-md text-blue-600 hover:scale-110 active:scale-95 transition-all duration-300"
          >
            {isReturnTrip ? (
              <ArrowUpDown size={18} strokeWidth={2.5} />
            ) : (
              <ArrowDown size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* To Section */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={endPoint}
            placeholder="Going to..."
            onChange={(e) => {
              setEndPoint(e.target.value);
              setShowEndSuggestions(false);
            }}
            onFocus={() => setShowEndSuggestions(true)}
            onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
            className="w-full font-bold text-sm sm:text-base pl-10 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
          />
          {showEndSuggestions && (
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-slate-300 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Scrollable Area */}
              <div className="max-h-52 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {endLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setEndPoint(loc);
                      setShowEndSuggestions(false); // 👈 Closes the dropdown after picking
                    }}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-blue-100"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fare */}
        <div className="space-y-1.5">
          <label className="ml-1 text-xs sm:text-sm font-medium text-gray-400">
            Fare
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[1-9][0-9]*"
              value={fare === 0 ? "" : fare}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9]*$/.test(val)) setFare(val === "" ? 0 : Number(val));
              }}
              placeholder="Enter fare"
              className="w-full font-bold pl-7 pr-4 py-3 sm:py-3.5 bg-white border border-gray-300 rounded-2xl text-gray-900 text-sm sm:text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Last Row */}
        <div className="grid grid-cols-2 gap-4 items-end">
          {/* Trip Date Section */}
          <div className="flex flex-col space-y-1.5 h-full">
            <label className="ml-1 text-xs sm:text-sm font-medium text-gray-400">
              Trip Date
            </label>
            {/* Added h-full and flex to the wrapper to match the input height */}
            <div className="flex items-center p-1.5 bg-gray-100/50 rounded-2xl w-fit h-full border border-gray-100 min-h-[46px] sm:min-h-[54px]">
              <DatePicker
                selected={tripDate}
                onChange={(date: Date | null) => {
                  if (date) setTripDate(date);
                }}
                maxDate={new Date()}
                popperPlacement="bottom-start"
                // wrapperClassName allows the datepicker container to fill the parent
                wrapperClassName="w-full"
                customInput={
                  <button className="flex items-center justify-center gap-3 px-6 sm:px-10 py-2 bg-white shadow-sm rounded-2xl text-[13px] sm:text-base text-gray-800 font-semibold hover:bg-gray-50 transition-all active:scale-95 min-w-[140px] sm:min-w-[180px]">
                    <span className="text-blue-500 text-base sm:text-lg">
                      ●
                    </span>
                    {tripDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </button>
                }
              />
            </div>
          </div>

          {/* Number Plate Section */}
          <div className="flex flex-col space-y-1.5 h-full">
            <label className="ml-1 text-xs sm:text-sm font-medium text-gray-400">
              Vehicle Number
            </label>
            <div className="relative h-full flex items-center">
              <Truck
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={numberPlate ?? ""}
                placeholder="GJ 15 AB 1234"
                onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
                className="w-full h-full font-bold text-sm sm:text-base pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none min-h-[46px] sm:min-h-[54px]"
              />
            </div>
          </div>
        </div>

        {/* Add Trip Button */}
        <button
          onClick={handleAdd}
          disabled={isDisabledAddBtn}
          className={`w-full py-3 sm:py-3.5 font-medium rounded-xl md:rounded-2xl shadow-md transition-all duration-200 mt-2 flex items-center justify-center text-sm sm:text-base
        ${
          addFailed
            ? "bg-red-600 text-white cursor-not-allowed"
            : addSuccess
              ? "bg-green-600 text-white cursor-not-allowed"
              : addingTrip
                ? "bg-blue-600 text-white cursor-not-allowed"
                : isDisabledAddBtn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        >
          {addingTrip ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Adding...</span>
            </div>
          ) : addSuccess ? (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Trip Added!</span>
            </div>
          ) : addFailed ? (
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Failed to Add Trip</span>
            </div>
          ) : (
            "Add Trip"
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(NewTripTab);
