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
import { fetchMe, fetchTasks, updateTask } from "../../utility/api";
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
  const [selectedTask, setSelectedTask] = useState(null);

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
            id: task.id,
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
          // console.log("tasks:", formattedTasks);

          //set state to get all the tasks and formmated tasks
          setTasks([...tasks, ...formattedTasks]);
          // console.log("hello:", taskStartDate);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };
    //when testing, make this an empty array, it infinitely loops
    getAllTasks();
  }, [tasks]);

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

  const handleEventClick = async (clickInfo) => {
    //something wrong with the start and end, wrong format.
    const clickedEvent = clickInfo.event;

    const { id, title, start, end, allDay, borderColor } = clickedEvent;
    //fomrat the date so that it can be added onto database. it will only take YYYY/MM/DD
    const formattedStartDate = new Date(start).toISOString().split("T")[0];
    const formattedEndDate = new Date(end).toISOString().split("T")[0];

    setTaskTitle(title);
    setTaskStartDate(formattedStartDate);
    setTaskEndDate(formattedEndDate);
    setIsAllDay(allDay);
    //cant get priority level, clickInfo.event from full calendar doesnt have priority level, they do have colors. Assign colors with a priority level, giving us a priority level we can set
    const priorityMap = {
      green: "important",
      red: "urgent",
      blue: "optional",
    };

    // console.log("get ID:", clickedEvent)

    const selectedPriority = priorityMap[borderColor];

    setPriority(selectedPriority);
    setSelectedTask(id);
    setShowForm(true);
    console.log("id:", id);
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

    try {
      if (selectedTask) {
        // need a way to update a task through ID, using the form of creating a task, we can update it by getting the data of the selected task
        const updatedTask = await updateTask(selectedTask, newTask);
        console.log("Task updated:", updatedTask);

        // set tasks to updated tasks, would render the changes of the task.
        const updatedTasks = tasks.map((task) =>
          task.id === selectedTask ? updatedTask : task
        );
        setTasks(updatedTasks);
      } else {
        // if else, create that task,
        const createdTask = await createTask(newTask);
        console.log("Task created:", createdTask);

        // setTasks with the new tasks that has been created.
        setTasks([...tasks, newTask, createdTask, ...generateRepeatedTasks()]);
      }

      // close the form
      setShowForm(false);
      setTaskTitle("");
      setTaskStartDate(currentDate);
      setTaskEndDate(currentDate);
      setIsAllDay(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error:", error.message);
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
