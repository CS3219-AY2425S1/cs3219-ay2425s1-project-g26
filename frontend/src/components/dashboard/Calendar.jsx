import React, { useEffect, useState } from "react";
import "./Calendar.css"; 

const Calendar = ({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  onlineDates = new Set(),
}) => {
  const [activeDays, setActiveDays] = useState(new Set());

  useEffect(() => {
    console.log("calendar", onlineDates);
    
    const formattedOnlineDates = Array.from(onlineDates).map(date => {
      const [year, month, day] = date.split("-");
      return formatDate(parseInt(year), parseInt(month) - 1, parseInt(day));
    });
    
    setActiveDays(new Set(formattedOnlineDates));
  }, [currentMonth, currentYear, onlineDates]);

  const formatDate = (year, month, day) => {
    const paddedMonth = String(month + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = formatDate(currentYear, currentMonth, day);
      const isActive = activeDays.has(formattedDate);
      calendarDays.push(
        <div key={day} className={`calendar-day ${isActive ? "active" : ""}`}>
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-button" onClick={handlePrevMonth}>
          &#8592;
        </button>
        <h2>
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
        <button className="calendar-button" onClick={handleNextMonth}>
          &#8594;
        </button>
      </div>

      <h3 className="days-online">
        Days Online in{" "}
        {new Date(currentYear, currentMonth).toLocaleString("default", {
          month: "long",
        })}
      </h3>

      <div className="calendar">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;
