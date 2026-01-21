import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type { NewTripInput } from "../../types";
import { ArrowDown, ArrowUp, Check, Plus, XCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import { useDataContext } from "../../context/TripContext";

interface NewTripTabProps {
  onAddTrip: (trip: NewTripInput) => Promise<void> | void;
}

const NewTripTab = ({ onAddTrip }: NewTripTabProps) => {
  const [startPoint, setStartPoint] = useState("SDY");
  const [endPoint, setEndPoint] = useState("Umbergaon");
  const [tripDate, setTripDate] = useState<Date>(new Date());
  const [fare, setFare] = useState<number>(200);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addFailed, setAddFailed] = useState(false);

  const { addingTrip, setAddingTrip, startLocations, endLocations } =
    useDataContext();

  const tripTimestamp = tripDate.setHours(0, 0, 0, 0);

  const isDisabledAddBtn =
    !(startPoint.trim()) ||
    !(startPoint.trim()) ||
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
        tripDate: tripTimestamp,
        returnTrip: isReturnTrip,
      });

      setAddSuccess(true);

      setStartPoint("SDY");
      setEndPoint("Vapi");
      setTripDate(new Date());
      setFare(200);

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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 md:p-2 rounded-lg">
          <Plus className="text-white" size={16} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">New Trip</h2>
      </div>

      <div className="space-y-6">
        {/* Points */}
        <div className="space-y-4">
          {/* From Section */}
          <div className="relative group">
            <input
              type="text"
              value={startPoint}
              placeholder="Starting from..."
              onChange={(e) => {
                setStartPoint(e.target.value);
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
                      onClick={() => setStartPoint(loc)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold text-gray-600 transition-all"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle Connector*/}
          <div className="flex items-center justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={() => setIsReturnTrip((prev) => !prev)}
              className="bg-white p-1 rounded-full border border-gray-100 shadow-sm text-gray-400 hover:text-blue-600 transition"
            >
              {isReturnTrip ? (
                <div className="flex gap-1 text-blue-600 items-center leading-none">
                  <ArrowUp size={18} strokeWidth={3} />
                  <ArrowDown size={18} strokeWidth={3} />
                </div>
              ) : (
                <ArrowDown size={20} strokeWidth={3} />
              )}
            </button>
          </div>

          {/* To Section */}
          <div className="relative group">
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
              className="w-full font-bold text-base px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
            />

            {showEndSuggestions && (
              <div className="absolute z-20 w-full mt-2 p-2 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex flex-col gap-2">
                  {endLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setEndPoint(loc)}
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
          <label className="ml-1 text-sm font-medium text-gray-400">Fare</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[1-9][0-9]*"
            value={fare === 0 ? "" : fare}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*$/.test(val)) {
                setFare(val === "" ? 0 : Number(val));
              }
            }}
            placeholder="Enter fare"
            className="w-full font-bold px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>

        {/* Date - modern & simple */}
        <div className="space-y-1.5">
          <label className="ml-1 text-sm font-medium text-gray-400">
            Trip Date
          </label>

          <div className="flex items-center gap-3 p-1.5 bg-gray-100/50 rounded-2xl w-fit border border-gray-100">
            <div className="relative">
              <DatePicker
                selected={tripDate}
                onChange={(date: Date | null) => {
                  if (date) setTripDate(date);
                }}
                maxDate={new Date()}
                // withPortal
                popperPlacement="bottom-start"
                customInput={
                  <button className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-xl text-[14px] text-gray-800 font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]">
                    <span className="text-blue-500 text-lg">●</span>
                    {tripDate
                      ? tripDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Select date"}
                  </button>
                }
              />
            </div>

            <button
              onClick={() => setTripDate(new Date())}
              className="pr-4 pl-2 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleAdd}
          disabled={isDisabledAddBtn}
          className={`w-full py-3.5 font-medium rounded-xl shadow-md transition-all duration-200 mt-2 flex items-center justify-center
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
          }

          `}
        >
          {addingTrip ? (
            <span>Adding…</span>
          ) : addSuccess ? (
            <div className="flex items-center gap-2.5">
              <Check className="h-5 w-5" />
              <span>Trip Added!</span>
            </div>
          ) : addFailed ? (
            <div className="flex items-center gap-2.5 ">
              <XCircle className="h-5 w-5" />{" "}
              {/* Use your preferred error icon */}
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

export default NewTripTab;
