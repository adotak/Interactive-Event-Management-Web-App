// ==================== INITIAL EVENTS (Sample Data) ====================
// This is an array of objects with predefined events to display initially
let events = [
    {
        name: "Tech Conference 2026",
        date: "2026-07-15",
        description: "Annual technology conference featuring talks from industry leaders."
    },
    {
        name: "Summer Workshop",
        date: "2026-06-20",
        description: "Hands-on workshop covering web development best practices."
    },
    {
        name: "Networking Meetup",
        date: "2026-06-10",
        description: "Connect with other developers and professionals in the tech industry."
    }
];

const savedEvents = localStorage.getItem("eventHorizonEvents");
if (savedEvents) {
    try {
        const parsedEvents = JSON.parse(savedEvents);
        if (Array.isArray(parsedEvents)) {
            events = parsedEvents;
        }
    } catch (error) {
        console.error("Could not load saved events:", error);
    }
}

function saveEvents() {
    localStorage.setItem("eventHorizonEvents", JSON.stringify(events));
}

// ==================== GET HTML ELEMENTS ====================
// These are variables that hold references to HTML elements we'll use in JavaScript
const eventForm = document.getElementById("eventForm");
const eventNameInput = document.getElementById("eventName");
const eventDateInput = document.getElementById("eventDate");
const eventDescriptionInput = document.getElementById("eventDescription");
const eventsList = document.getElementById("eventsList");
const searchInput = document.getElementById("searchInput");
const warningMessage = document.getElementById("warningMessage");
const connectionStatus = document.getElementById("connectionStatus");

function updateConnectionStatus() {
    connectionStatus.textContent = navigator.onLine
        ? "Online - your events are saved on this device."
        : "Offline - you can still view and manage your saved events.";
    connectionStatus.classList.toggle("offline", !navigator.onLine);
}

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    navigator.serviceWorker.register("./service-worker.js")
        .catch(error => {
            console.error("Could not register the service worker:", error);
        });
}

// ==================== DISPLAY EVENTS FUNCTION ====================
// This function creates and shows all events on the page
function displayEvents(eventsToShow = events) {
    // First, clear all existing event cards
    eventsList.innerHTML = "";

    // Check if there are any events to show
    if (eventsToShow.length === 0) {
        eventsList.innerHTML = "<p style='text-align: center; color: #999;'>No events found. Add one to get started!</p>";
        return;
    }

    // Loop through each event and create a card for it
    eventsToShow.forEach((event, index) => {
        // Create a div for the event card
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";

        // Check if the event date is in the past
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

        if (eventDate < today) {
            // Add the "past-event" class to gray out past events
            eventCard.classList.add("past-event");
        }

        // Create the HTML content for the event card
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p class="event-date">📅 ${formatDate(event.date)}</p>
            <p class="event-description">${event.description}</p>
            <button class="btn-delete" onclick="deleteEvent(${index})">Delete Event</button>
        `;

        // Add the card to the page
        eventsList.appendChild(eventCard);
    });
}

// ==================== FORMAT DATE FUNCTION ====================
// This function converts a date like "2026-07-15" to a readable format like "July 15, 2026"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// ==================== ADD EVENT FUNCTION ====================
// This function runs when the user clicks the "Add Event" button
function addEvent(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get the values from the form inputs
    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value.trim();

    // FORM VALIDATION: Check if all fields are filled in
    if (!name || !date || !description) {
        // Show warning message
        warningMessage.textContent = "⚠️ Please fill in all fields (Event Name, Date, and Description)";
        warningMessage.classList.add("show");
        return;
    }

    // Hide warning message if everything is okay
    warningMessage.classList.remove("show");

    // Create a new event object
    const newEvent = {
        name: name,
        date: date,
        description: description
    };

    // Add the new event to the events array
    events.push(newEvent);

    // Sort events by date (ascending order - earliest first)
    sortEventsByDate();
    saveEvents();

    // Clear the form fields
    eventForm.reset();

    // Refresh the display to show the new event
    displayEvents();
}

// ==================== SORT EVENTS BY DATE ====================
// This function automatically sorts events by date (earliest first)
function sortEventsByDate() {
    events.sort((event1, event2) => {
        const date1 = new Date(event1.date);
        const date2 = new Date(event2.date);
        return date1 - date2; // Returns negative if date1 is earlier, positive if later
    });
}

// ==================== DELETE EVENT FUNCTION ====================
// This function removes an event from the list
function deleteEvent(index) {
    // Remove the event at the specified index from the events array
    events.splice(index, 1);
    saveEvents();

    // Refresh the display to remove the deleted event
    displayEvents();
}

// ==================== SEARCH FUNCTION ====================
// This function filters events by name or date as the user types
function searchEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
        // If search box is empty, show all events
        displayEvents();
        return;
    }

    // Filter events that match the search term
    const filteredEvents = events.filter(event => {
        // Check if the search term is in the event name or date
        const nameMatch = event.name.toLowerCase().includes(searchTerm);
        const dateMatch = event.date.includes(searchTerm);

        return nameMatch || dateMatch; // Return true if either matches
    });

    // Display only the filtered events
    displayEvents(filteredEvents);
}

// ==================== EVENT LISTENERS ====================
// These listen for user actions and run functions when they happen

// When the form is submitted (user clicks "Add Event")
eventForm.addEventListener("submit", addEvent);

// When user types in the search box
searchInput.addEventListener("input", searchEvents);

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

// ==================== INITIALIZE (Run when page loads) ====================
// This code runs when the page first loads
sortEventsByDate();
displayEvents();
updateConnectionStatus();
registerServiceWorker();
