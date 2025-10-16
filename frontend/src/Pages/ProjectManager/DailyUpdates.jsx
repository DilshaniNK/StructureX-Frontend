import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function DailyUpdates() {
  const [update, setUpdate] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Hardcoded user for now (can later come from login / route)
  const userid = "EMP_001";

  useEffect(() => {
    if (userid) {
      axios
        .get(
          `http://localhost:8086/api/v1/project_manager/daily-updates/${userid}`
        )
        .then((response) => {
          console.log("✅ Data from backend:", response.data);
          // Normalize the response into an array so callers can safely use array methods
          const data = response.data;
          let arr = [];
          if (Array.isArray(data)) {
            arr = data;
          } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
            // some APIs wrap results in an `updates` field
            arr = data.updates;
          } else if (data && typeof data === "object") {
            // single object -> wrap in array
            arr = [data];
          }
          setUpdate(arr);
        })
        .catch((error) => {
          console.error("❌ Error fetching updates:", error);
        });
    } else {
      console.warn("⚠️ No user ID provided, skipping fetch.");
    }
  }, [userid]);

  // Filter updates by selected date
  const filteredUpdates = selectedDate
    ? update.filter((u) => u.date === selectedDate)
    : update;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-amber-100 group animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-amber-600">
                Total Updates
              </p>
              <p className="text-2xl font-bold text-gray-900 transition-all duration-500 transform group-hover:scale-110 group-hover:text-amber-700">
                <span className="inline-block animate-number-count">{update.length}</span>
              </p>
            </div>
            <div
              className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-amber-200 group-hover:rotate-12 group-hover:scale-110" >
              <FileText className="text-amber-600 transition-colors duration-300 group-hover:text-amber-700" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-amber-100 group animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-amber-600">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 transition-all duration-500 transform group-hover:scale-110 group-hover:text-amber-700">
                <span className="inline-block animate-number-count">
                  {
                    update.filter(
                      (u) =>
                        u.note?.toLowerCase().includes("completed") ||
                        u.note?.toLowerCase().includes("done")
                    ).length
                  }
                </span>
              </p>
            </div>
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-amber-200 group-hover:rotate-12 group-hover:scale-110" >
              <CheckCircle2 className="text-amber-600 transition-colors duration-300 group-hover:text-amber-700" size={24} />
            </div>
          </div>
        </div>

        <div
          className="bg-amber-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-amber-100 group animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-amber-600">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 transition-all duration-500 transform group-hover:scale-110 group-hover:text-amber-700" >
                <span className="inline-block animate-number-count">
                  {
                    update.filter(
                      (u) =>
                        !u.note?.toLowerCase().includes("completed") &&
                        !u.note?.toLowerCase().includes("done")
                    ).length
                  }
                </span>
              </p>
            </div>
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-amber-200 group-hover:rotate-12 group-hover:scale-110">
              <Clock className="text-amber-600 transition-colors duration-300 group-hover:text-amber-700" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-amber-100 group animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-amber-600">
                Active Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 transition-all duration-500 transform group-hover:scale-110 group-hover:text-amber-700" >
                <span className="inline-block animate-number-count">
                  {new Set(update.map((u) => u.projectId)).size}
                </span>
              </p>
            </div>
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-amber-200 group-hover:rotate-12 group-hover:scale-110" >
              <BarChart3 className="text-amber-600 transition-colors duration-300 group-hover:text-amber-700" size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-gray-500" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setSelectedDate("")}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-6">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map((u, index) => (
            <div
              key={u.updateId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <FileText className="text-amber-600" size={32} />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-amber-800">
                        Project: {u.projectId}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        By: {u.employee_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
                      <CalendarDays size={16} />
                      <span>
                        {new Date(u.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {u.note}
                  </p>
                </div>
              </div>
              <div className={`h-2 ${u.note?.toLowerCase().includes("completed") || u.note?.toLowerCase().includes("done") ? 'bg-green-400' : 'bg-amber-400'}`}></div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold">No updates found</h3>
            <p>There are no updates for the selected date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
