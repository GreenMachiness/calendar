import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  return (
    <div>
      <br></br>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{ // these can be interchanged
          start: "today prev,next", //selection tools
          center: "title", // month in the center
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will give view buttons for month/week/day
        }}
        height={"90vh"}
      />
    </div>
  );
}

export default Calendar;