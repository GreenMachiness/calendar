const addTask = async () => {
    const newTask = {
      title: taskTitle,
      start: `${taskStartDate}T${taskStartTime}`,
      end: `${taskEndDate}T${taskEndTime}`,
      allDay: isAllDay,
      color: priorityColors[priority], //change color depending on priority
      priorityLevel: priority, //change color depending on priority
    };
  
    try {
      // Call createTask function from your API
      const createdTask = await createTask(newTask);
  
      // Handle success (you can update state or perform other actions)
      console.log("Task created:", createdTask);
  
      // Check if the task already exists in tasks array
      const taskExists = tasks.some(
        (task) =>
          task.title === newTask.title &&
          task.start === newTask.start &&
          task.end === newTask.end
      );
  
      if (taskExists) {
        // Update the existing task
        const updatedTasks = tasks.map((task) =>
          task.title === newTask.title &&
          task.start === newTask.start &&
          task.end === newTask.end
            ? newTask
            : task
        );
        setTasks(updatedTasks);
      } else {
        // Render current tasks
        setTasks([...tasks, newTask, ...generateRepeatedTasks()]);
      }
  
      // Close the form and reset form fields
      setShowForm(false);
      setTaskTitle("");
      setTaskStartDate(currentDate);
      setTaskEndDate(currentDate);
      setIsAllDay(false);
    } catch (error) {
      // Handle errors (display an error message or perform other actions)
      console.error("Error creating task:", error.message);
    }
  };