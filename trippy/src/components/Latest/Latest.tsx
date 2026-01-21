import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useDataContext } from "../../context/TripContext";
import { formatDate, formatTime } from "../../utils/FormatDate";

const Latest = () => {
  const { last10Trips } = useDataContext();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Last 10 Trips</h2>

      {last10Trips.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No trips yet</p>
      ) : (
        <div className="space-y-3">
          {last10Trips.map((trip) => (
            <div
              key={trip._id}
              className="border text-black border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                {/* Trip Start */}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <span>{trip.startPoint}</span>

                    <ArrowRight size={14} className="text-gray-400" />

                    <span>{trip.endPoint}</span>

                    {trip.returnTrip && (
                      <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                        Return
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs text-gray-500">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{formatDate(trip.tripDate)}</span>

                      <span className="opacity-60">•</span>

                      <Clock size={13} className="text-gray-400" />
                      <span>{formatTime(trip.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Trip End */}
              </div>
              <div className="font-bold text-green-700">₹{trip.fare}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Latest;
