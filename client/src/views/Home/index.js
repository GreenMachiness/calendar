import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Slide from '@mui/material/Slide';

function MyCalendar() {
  // want to get the current date 
  // get rid of time.
  const currentDate = new Date().toISOString().split("T")[0];
  
  //need tasks to render into my calendar to see if it works
  const [tasks, setTasks] = useState([ 
    { title: "Clean Car", date: "2023-12-25" },
    { title: "Change Brush", date: "2023-12-28" },
  ]);

  //hooks for showing form for creating tasks, initial render is false
  const [showForm, setShowForm] = useState(false);

  // hooks task title for that task
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // hooks for that task date
  const [newTaskDate, setNewTaskDate] = useState(currentDate); // Set the default value here

  //need a function when clicking on a calendar date, it would bring up the form for that current date
  const openFormOnDate = (date) => {
    //set show form to render form
    setShowForm(true);
    //setting the date of that form of the current date
    setNewTaskDate(date);
  };
  //need a function to add task for calendar
  const addTask = () => {
    const newTask = {
      title: newTaskTitle,
      date: newTaskDate,
    };
    //when adding a new task, it would also render the tasks that was already added
    setTasks([...tasks, newTask]);
    setShowForm(false);
    setNewTaskTitle("");
    setNewTaskDate(currentDate);
  };

  return (
    <div style={{ maxWidth: "90vh", margin: "0 auto", paddingTop: "20px" }}>
      <Button variant="contained" onClick={() => { setShowForm(true); setNewTaskDate(currentDate); }}>
        Add Task
      </Button>

      <Dialog open={showForm} TransitionComponent={Slide} onClose={() => setShowForm(false)} transitionDuration={500}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <TextField
            type="date"
            margin="dense"
            label="Task Date"
            fullWidth
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={addTask}>Save</Button>
        </DialogActions>
      </Dialog>

      <div style={{ maxWidth: "90vh", margin: "0 auto", paddingTop: "20px" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={tasks}
          dateClick={(info) => openFormOnDate(info.dateStr)}
        />
      </div>
    </div>
  );
}

export default MyCalendar;
