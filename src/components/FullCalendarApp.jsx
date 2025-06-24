import React, { useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css"; // For additional custom styling

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function FullCalendarApp() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");

  const viewOptions = [
    { label: "Daily", value: Views.DAY },
    { label: "Weekly", value: Views.WEEK },
    { label: "Monthly", value: Views.MONTH },
  ];

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start: new Date(start), end: new Date(end) });
    setShowForm(true);
  };

  const handleAddEvent = () => {
    if (!newEventTitle || !selectedSlot) return;

    const newEvent = {
      title: newEventTitle,
      start: selectedSlot.start,
      end: selectedSlot.end,
      allDay: false,
    };

    setEvents((prev) => [...prev, newEvent]);
    setNewEventTitle("");
    setSelectedSlot(null);
    setShowForm(false);
  };

  const CustomWeekHeader = ({ label, date }) => {
    const day = format(date, "d"); // Day number like 23
    const weekday = format(date, "EEE"); // Short day name like Sun
    return (
      <div className="text-center">
        <div className="text-sm font-semibold">{day}</div>
        <div className="text-xs text-gray-500">{weekday}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <span
          onClick={() => setShowForm(true)}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          + New Event
        </span>
      </div>

      <div className="w-full p-4 bg-gray-200 rounded-md flex justify-center">
        {viewOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setView(value)}
            className={`w-1/3 py-4 text-sm font-medium transition ${
              view === value
                ? "bg-white rounded-md"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h2 className="text-lg font-semibold mb-4">Add New Event</h2>
            <input
              type="text"
              placeholder="Event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleAddEvent}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow mt-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          view={view}
          onView={(v) => setView(v)}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          style={{ height: "80vh" }}
          onSelectSlot={handleSelectSlot}
          popup
          toolbar={false}
          components={{
            event: ({ event }) => (
              <div className="bg-blue-500 text-white px-2 py-1 rounded">
                {event.title}
              </div>
            ),
            week: {
              header: (props) => <CustomWeekHeader {...props} />,
            },
          }}
        />
      </div>
    </div>
  );
}
