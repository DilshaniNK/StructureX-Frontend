import React from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import financial_officer from '../../assets/fo.png';

const CalenderCard = () => {
  const today = new Date();
  const day = today.getDate();
  const weekday = today.toLocaleString('default', { weekday: 'long' });
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();

  return (
    <div className="flex flex-row bg-white rounded-lg shadow-md overflow-hidden big:w-1/4 w-full mt-6">
      {/* Left image section */}
      <div className="w-1/3 bg-gray-200">
        <img
          src={financial_officer}
          alt="Financial Officer"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right content section */}
      <div className="flex-1 p-6 text-center flex flex-col justify-center items-center">
        <CalendarTodayIcon className="text-amber-500 text-5xl mb-4" />
        <h3 className="font-semibold mb-2 text-black text-3xl">{weekday}</h3>
        <p className="text-5xl font-bold text-black">{day}</p>
        <p className="text-gray-700 text-2xl">
          {month} {year}
        </p>
      </div>
    </div>
  );
};

export default CalenderCard;
