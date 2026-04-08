// maintenance.js

// Define the start and end times for maintenance mode (24-hour format)
const startHour = 9; // 9:00 AM
const endHour = 18;  // 6:00 PM

// Get the current time (hours only)
const currentHour = new Date().getHours();

// Check if the current time is within the maintenance period
if (currentHour >= startHour && currentHour < endHour) {
    // Redirect to the maintenance page during maintenance hours
    window.location.href = '/maintenance.html'; 
} else {
    // Allow users to access the regular site outside maintenance hours
    console.log("Site is running normally.");
}
