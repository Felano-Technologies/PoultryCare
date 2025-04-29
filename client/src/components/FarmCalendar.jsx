// components/FarmCalendar.jsx
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import enUS from 'date-fns/locale/en-US';
import { isSameDay } from 'date-fns';

export default function FarmCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [farmEvents, setFarmEvents] = useState([
    { date: new Date(2025, 4, 2), type: 'Vaccination' },   // 🟢
    { date: new Date(2025, 4, 5), type: 'Health Check' },  // 🟡
    { date: new Date(2025, 4, 10), type: 'Treatment' }     // 🔴
  ]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Custom Day rendering (Dots)
  const renderDay = (day, selectedDates, pickersDayProps) => {
    const event = farmEvents.find((event) => isSameDay(day, event.date));

    return (
      <div className="relative">
        <PickersDay {...pickersDayProps} />
        {event && (
          <span
            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
              event.type === 'Vaccination'
                ? 'bg-green-500'
                : event.type === 'Health Check'
                ? 'bg-yellow-400'
                : 'bg-red-500'
            }`}
          />
        )}
      </div>
    );
  };

  // Handle when user clicks a date
  const handleDateClick = (date) => {
    const eventsOnDay = farmEvents.filter((event) => isSameDay(date, event.date));
    setSelectedDate(date);

    if (eventsOnDay.length > 0) {
      setSelectedDateEvents(eventsOnDay);
      setOpenModal(true);
    } else {
      // No event on this day -> Ask to create one
      const confirmCreate = window.confirm('No events on this day. Do you want to add a new event?');
      if (confirmCreate) {
        const eventType = prompt('Enter event type (Vaccination, Health Check, Treatment):');
        if (eventType) {
          setFarmEvents([...farmEvents, { date: date, type: eventType }]);
          alert('Event added successfully!');
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[500px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Farm Calendar</h3>

      {/* Calendar */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => handleDateClick(newValue)}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 0,
            height: '100%',
            '& .MuiPickersDay-dayWithMargin': { fontWeight: 'bold' },
          }}
          slots={{ day: (props) => renderDay(props.day, props.selectedDates, props) }}
        />
      </LocalizationProvider>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Vaccination</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span>Health Check</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span>Treatment</span>
        </div>
      </div>

      {/* Modal for Events */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-80 space-y-4">
            <h2 className="text-lg font-bold text-gray-700 text-center">Events</h2>
            <ul className="space-y-2">
              {selectedDateEvents.map((event, index) => (
                <li key={index} className="text-gray-600 text-sm">
                  📌 {event.type}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpenModal(false)}
              className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
