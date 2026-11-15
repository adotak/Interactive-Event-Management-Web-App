/*
 * script-explained.js
 *
 * This is a teaching copy of script.js.
 * It demonstrates the basic event-management lifecycle:
 *
 *     data -> modify data -> save data -> render data
 *
 * index.html still loads script.js. This file is intentionally separate so
 * the working application is not changed while the code is being studied.
 */

// DATA: the initial events shown when no saved events exist yet.
let events = [
    {
        id: "tech-conference-2026",
        name: "Tech Conference 2026",
        date: "2026-07-15",
        description: "Annual technology conference featuring talks from industry leaders."
    },
    {
        id: "summer-workshop",
        name: "Summer Workshop",
        date: "2026-06-20",
        description: "Hands-on workshop covering web development best practices."
    },
    {
        id: "networking-meetup",
        name: "Networking Meetup",
        date: "2026-06-10",
        description: "Connect with other developers and professionals in the tech industry."
    }
];

const storageKey = "eventHorizonEvents";

// localStorage stores strings, so JSON converts the array to and from text.
const savedEvents = localStorage.getItem(storageKey);
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

// SAVE: persist the current source-of-truth array in the browser.
function saveEvents() {
    localStorage.setItem(storageKey, JSON.stringify(events));
}

// These references connect JavaScript to elements in index.html.
const eventForm = document.getElementById("eventForm");
const eventNameInput = document.getElementById("eventName");
const eventDateInput = document.getElementById("eventDate");
const eventDescriptionInput = document.getElementById("eventDescription");
const eventsList = document.getElementById("eventsList");
const searchInput = document.getElementById("searchInput");
const warningMessage = document.getElementById("warningMessage");

// DISPLAY: turn each event object into a card on the page.
function displayEvents(eventsToShow = events) {
    eventsList.replaceChildren();

    if (eventsToShow.length === 0) {
        eventsList.textContent = "No events found. Add one to get started!";
        return;
    }

    eventsToShow.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";

        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDate < today) {
            eventCard.classList.add("past-event");
        }

        const title = document.createElement("h3");
        title.textContent = event.name;

        const date = document.createElement("p");
        date.className = "event-date";
        date.textContent = formatDate(event.date);

        const description = document.createElement("p");
        description.className = "event-description";
        description.textContent = event.description;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete Event";
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        eventCard.append(title, date, description, deleteButton);
        eventsList.appendChild(eventCard);
    });
}

// Convert an ISO date such as 2026-07-15 into readable text.
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

// MODIFY: validate the form, create an object, and add it to events.
function addEvent(event) {
    event.preventDefault();

    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value.trim();

    if (!name || !date || !description) {
        warningMessage.textContent = "Please fill in all fields (Event Name, Date, and Description)";
        warningMessage.classList.add("show");
        return;
    }

    warningMessage.classList.remove("show");
    events.push({
        id: crypto.randomUUID(),
        name,
        date,
        description
    });

    sortEventsByDate();
    saveEvents();
    eventForm.reset();
    displayEvents();
}

// Keep the earliest event first.
function sortEventsByDate() {
    events.sort((firstEvent, secondEvent) => {
        return new Date(firstEvent.date) - new Date(secondEvent.date);
    });
}

// Delete by id, rather than by a filtered array index.
function deleteEvent(eventId) {
    events = events.filter(event => event.id !== eventId);
    saveEvents();
    searchEvents();
}

// FILTER: show events whose name or date contains the search text.
function searchEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
        displayEvents();
        return;
    }

    const filteredEvents = events.filter(event => {
        const nameMatches = event.name.toLowerCase().includes(searchTerm);
        const dateMatches = event.date.includes(searchTerm);
        return nameMatches || dateMatches;
    });

    displayEvents(filteredEvents);
}

// EVENT LISTENERS: run functions when the user interacts with the page.
eventForm.addEventListener("submit", addEvent);
searchInput.addEventListener("input", searchEvents);

// INITIALIZE: sort before the first render, so the page is drawn once correctly.
sortEventsByDate();
displayEvents();
