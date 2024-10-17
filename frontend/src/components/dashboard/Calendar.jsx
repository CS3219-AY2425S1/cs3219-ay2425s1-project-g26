import React, { useEffect, useState } from "react";
import "./Calendar.css"; 

const Calendar = ({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
}) => {
  const [activeDays, setActiveDays] = useState(new Set());

  useEffect(() => {
    const localhostCheck = window.location.hostname === "localhost";
    if (localhostCheck) {
      const today = new Date().toDateString();
      setActiveDays((prev) => {
        const newActiveDays = new Set(prev);
        newActiveDays.add(today);
        return newActiveDays;
      });

      const storedDays = localStorage.getItem("activeDays");
      const activeDaysArray = storedDays ? JSON.parse(storedDays) : [];
      if (!activeDaysArray.includes(today)) {
        activeDaysArray.push(today);
        localStorage.setItem("activeDays", JSON.stringify(activeDaysArray));
      }
    }
  }, []);

  useEffect(() => {
    const storedDays = localStorage.getItem("activeDays");
    const activeDaysArray = storedDays ? JSON.parse(storedDays) : [];
    setActiveDays(new Set(activeDaysArray));
  }, [currentMonth, currentYear]);

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
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];
    const startDayIndex = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDayIndex; i++) {
      calendarDays.push(<div className="empty-day" key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = new Date(
        currentYear,
        currentMonth,
        day
      ).toDateString();
      const isActive = activeDays.has(dateString);
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
