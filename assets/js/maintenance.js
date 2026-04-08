// maintenance.js

// Fetch the maintenance settings from the settings JSON file
fetch('./content/Settings/maintenance.json')
  .then(response => response.json())
  .then(data => {
    const maintenanceMode = data.maintenance_mode;  // true or false
    const startTime = data.start_time;  // Start time in "HH:MM" format
    const endTime = data.end_time;  // End time in "HH:MM" format

    // If maintenance mode is enabled, proceed with time checking
    if (maintenanceMode) {
      // Get the current hour (24-hour format)
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();

      // Convert start and end times to hours and minutes
      const [startHour, startMinute] = startTime.split(':').map(num => parseInt(num, 10));
      const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num, 10));

      // Check if the current time is within the maintenance window
      // Current time is within the window if:
      //   (Start time <= current time < End time)
      if (
        (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
        (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute))
      ) {
        // Redirect to the maintenance page
        window.location.href = './maintenance.html';  // Redirect to the maintenance page
      }
    }
  })
  .catch(err => console.error('Failed to load maintenance settings:', err));
