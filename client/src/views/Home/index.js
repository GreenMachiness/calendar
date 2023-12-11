import React, { useState, useEffect } from "react";
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
import Slide from "@mui/material/Slide";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { createTask } from "../../utility/api";
import { fetchMe, fetchTasks } from "../../utility/api";
import { isUserLoggedIn, clearToken } from "../../utility/utils";

function Calendar() {
  // want to get the current date
  // get rid of time.
  const currentDate = new Date().toISOString().split("T")[0];
  const currentHour = new Date();
  //round up to the nearest hour for task start time
  currentHour.setHours(currentHour.getHours() + 1);
  //set minutes to 0
  currentHour.setMinutes(0);
  //render the end time with after the hour of the currenthour
  function initialEndTime(start) {
    const startTime = new Date();
    //sethours method manipulates the time
    startTime.setHours(
      // get hours and add it by 1 to get ahead of start time
      parseInt(start.slice(0, 2)) + 1,
      //gets minutes and turns it into 0, the start will always be 0
      parseInt(start.slice(3, 5))
    );
    // console.log("start time:", startTime)
    return startTime.toTimeString().slice(0, 5);
  }

  const priorityColors = {
    optional: "blue",
    important: "green",
    urgent: "red",
  };

  // need tasks to render into my calendar to see if it works
  const [tasks, setTasks] = useState([
    { title: "Clean Car", date: "2023-12-25" },
    {
      title: "Change Brush",
      date: "2023-12-28",
      color: priorityColors.urgent, // use the color from your priorityColors object
    },
  ]);

  // hooks for showing form for creating tasks, initial render is false
  const [showForm, setShowForm] = useState(false);

  // hooks task title for that task
  const [taskTitle, setTaskTitle] = useState("");

  // hooks for that task date
  const [taskStartDate, setTaskStartDate] = useState(null);
  const [taskEndDate, setTaskEndDate] = useState(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [taskStartTime, setTaskStartTime] = useState(
    currentHour.toTimeString().slice(0, 5) //set initial render to the next hour rounded up
  );
  const [taskEndTime, setTaskEndTime] = useState(() =>
    initialEndTime(taskStartTime)
  );
  const [notifyValue, setNotifyValue] = useState("");
  const [notifyUnit, setNotifyUnit] = useState("minutes");
  const [priority, setPriority] = useState("optional");
  const [repetitionValue, setRepetitionValue] = useState("");
  const [repetitionUnit, setRepetitionUnit] = useState("days");
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn()); // usestate for loggedIn or not
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if user is logged in
    if (isLoggedIn) {
      // fetch user's id using user token
      fetchMe().then((result) => {
        // console.log("fetchMe: ", result);
        // set user id state variable with the user id from the fetch request
        setUserId(result.data.id);
        // console.log("result.data:", result.data);
        setUser(result.data);
        // console.log("result user:", result.data)
      });
    }
  }, []);
  //need to fetch tasks from database and render them on calendar
  useEffect(() => {
    const getAllTasks = async () => {
      try {
        //use the fetchTasks from api.js to get tasks
        const fetchedTasks = await fetchTasks();

        //getting error that its not iterable, need to format the object to get tasks correctly
        if (fetchedTasks && Array.isArray(fetchedTasks.data)) {
          //format tasks to correctly fetch the tasks from database.
          const formattedTasks = fetchedTasks.data.map((task) => ({
            title: task.title,
            start: task.start,
            end: task.end,
            timeStart: task.timeStart,
            timeEnd: task.timeEnd,
            allDay: task.isAllDay,
            priorityLevel: task.priority,
            color: task.color,
            eventColor: task.eventColor,
            userId: task.userId,
          }));
          console.log("tasks:", formattedTasks);

          //set state to get all the tasks and formmated tasks
          setTasks([...tasks, ...formattedTasks]);
          console.log("hello:", taskStartDate);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    getAllTasks();
  }, []);

  const handleNotifyValueChange = (e) => {
    setNotifyValue(e.target.value);
  };

  const handleNotifyUnitChange = (e) => {
    setNotifyUnit(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleRepetitionValueChange = (e) => {
    setRepetitionValue(e.target.value);
  };

  const handleRepetitionUnitChange = (e) => {
    setRepetitionUnit(e.target.value);
  };

  // need a function to handle clicking on an event/task in the calendar
  const handleEventClick = (clickInfo) => {
    const clickedEvent = clickInfo.event;

    // get the details of the clicked event
    const clickedTask = {
      title: clickedEvent.title,
      start: clickedEvent.startStr,
      end: clickedEvent.endStr || taskEndDate,
      isAllDay: clickedEvent.allDay,
      color: clickedEvent.backgroundColor,
    };

    // render the form fields with the details of the clicked task
    setTaskTitle(clickedTask.title);
    setTaskStartDate(taskStartDate);
    setTaskEndDate(clickedTask.end.slice(0, 10));
    setIsAllDay(clickedTask.isAllDay);

    // open the form with the task details
    setShowForm(true);
  };

  // need a function when clicking on a calendar date, it would bring up the form for that current date
  const openFormOnDate = (date) => {
    // set show form to render form
    setShowForm(true);
    // setting the date of that form as the current date
    setTaskStartDate(date);
    setTaskEndDate(date);
  };

  const generateRepeatedTasks = () => {
    const newTasks = [];

    if (repetitionValue && parseInt(repetitionValue) > 0) {
      const interval = parseInt(repetitionValue);
      const startDate = new Date(taskStartDate);
      const endDate = new Date(taskEndDate);

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + interval)
      ) {
        const newTask = {
          title: taskTitle,
          start: date.toISOString().split("T")[0],
          end: date.toISOString().split("T")[0],
          allDay: isAllDay,
          color: priorityColors[priority],
          eventColor: priorityColors[priority],
        };
        newTasks.push(newTask);
      }
    }

    return newTasks;
  };

  // need a function to add task for calendar
  const addTask = async () => {
    const newTask = {
      title: taskTitle,
      start: taskStartDate,
      end: taskEndDate,
      timeStart: `${taskStartTime}`,
      timeEnd: `${taskEndTime}`,
      allDay: isAllDay,
      priorityLevel: priority,
      color: priorityColors[priority],
      eventColor: priorityColors[priority],
      userId: userId,
    };
    // console.log("bye:", taskStartDate)

    console.log("newtask:", newTask);
    try {
      const createdTask = await createTask(newTask);

      console.log("Task created:", createdTask);

      // set tasks with all the rendered tasks, the created tasks, plus tasks with repetition
      setTasks([...tasks, newTask, createdTask, ...generateRepeatedTasks()]);

      //
      setShowForm(false);
      setTaskTitle("");
      setTaskStartDate(taskStartDate);
      setTaskEndDate(taskEndDate);
      setIsAllDay(false);
    } catch (error) {
      console.error("Error creating task:", error.message);
    }
  };

  // CSS for cursor on calendar
  const clickCursor = `
    .fc-daygrid-day, .fc-timegrid-slot {
      cursor: pointer;
    }
  `;

  return (
    <div style={{ maxWidth: "90vh", margin: "0 auto", paddingTop: "20px" }}>
      <Button
        variant="contained"
        onClick={() => {
          setShowForm(true);
          setTaskStartDate(taskStartDate);
          setTaskEndDate(taskEndDate);
        }}
      >
        Add Task
      </Button>

      <Dialog
        open={showForm}
        TransitionComponent={Slide}
        onClose={() => setShowForm(false)}
        transitionDuration={500}
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              type="date"
              margin="dense"
              label="Start Date"
              fullWidth
              value={taskStartDate}
              onChange={(e) => setTaskStartDate(e.target.value)}
            />
            <TextField
              type="date"
              margin="dense"
              label="End Date"
              fullWidth
              value={taskEndDate}
              onChange={(e) => setTaskEndDate(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              type="time"
              margin="dense"
              label="Start Time"
              fullWidth
              value={taskStartTime}
              onChange={(e) => setTaskStartTime(e.target.value)}
              disabled={isAllDay}
            />
            <TextField
              type="time"
              margin="dense"
              label="End Time"
              fullWidth
              value={taskEndTime}
              onChange={(e) => setTaskEndTime(e.target.value)}
              disabled={isAllDay}
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
              />
            }
            label="All-day"
          />
          <FormControl fullWidth>
            <div style={{ display: "flex", gap: "10px" }}>
              <TextField
                type="number"
                margin="dense"
                label="Repeat Every"
                value={repetitionValue}
                onChange={handleRepetitionValueChange}
                style={{ width: "150px" }}
              />
              <Select
                value={repetitionUnit}
                onChange={handleRepetitionUnitChange}
                style={{ marginTop: "8px" }}
              >
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="years">Years</MenuItem>
              </Select>
            </div>
          </FormControl>
          <FormControl fullWidth>
            <div style={{ display: "flex", gap: "10px" }}>
              <TextField
                type="number"
                margin="dense"
                label="Notify Me Before"
                value={notifyValue}
                onChange={handleNotifyValueChange}
                style={{ width: "150px" }}
              />
              <Select
                value={notifyUnit}
                onChange={handleNotifyUnitChange}
                style={{ marginTop: "8px" }}
              >
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hours">Hours</MenuItem>
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="days">Weeks</MenuItem>
              </Select>
            </div>
          </FormControl>
        </DialogContent>
        <FormControl sx={{ m: 1, ml: 3, mt: 2 }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <InputLabel id="demo-simple-select-label">
              Priority Level
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={priority}
              label="Priority Level"
              onChange={handlePriorityChange}
              sx={{ minWidth: "150px" }}
            >
              <MenuItem value="optional">Optional</MenuItem>
              <MenuItem value="important">Important</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </div>
        </FormControl>
        <TextField
          id="filled-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          variant="filled"
          sx={{ width: "92%", my: 1, ml: 3 }} // Adjust width and add margin on y-axis
        />
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setShowForm(false)}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addTask}
            style={{ color: "white" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <style>{clickCursor}</style>
      <div style={{ maxWidth: "90vh", margin: "0 auto", paddingTop: "20px" }}>
        {/* full calendar import */}
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
          eventClick={handleEventClick}
          eventContent={(arg) => (
            <div
              style={{
                padding: "2px",
                backgroundColor: arg.event.backgroundColor,
                color:
                  arg.event.backgroundColor === priorityColors.urgent ||
                  arg.event.backgroundColor === priorityColors.important ||
                  arg.event.backgroundColor === priorityColors.optional
                    ? "white"
                    : "black",
              }}
            >
              {arg.timeText && <strong>{arg.timeText.slice(0, 5)}</strong>}
              <p>{arg.event.title}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default Calendar;
