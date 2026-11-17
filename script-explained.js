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
const defaultEvents = [
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

// Only keep complete event records from storage. This protects rendering from
// stale or manually edited localStorage data.
function isValidEvent(event) {
    return event &&
        typeof event.id === "string" &&
        typeof event.name === "string" &&
        typeof event.date === "string" &&
        typeof event.description === "string" &&
        isValidDate(event.date);
}

function isValidDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;
}

function loadEvents() {
    try {
        const savedEvents = localStorage.getItem(storageKey);
        if (!savedEvents) {
            return defaultEvents;
        }

        const parsedEvents = JSON.parse(savedEvents);
        return Array.isArray(parsedEvents)
            ? parsedEvents.filter(isValidEvent)
            : defaultEvents;
    } catch (error) {
        console.error("Could not load saved events:", error);
        return defaultEvents;
    }
}

let events = loadEvents();

// SAVE: persist the current source-of-truth array in the browser.
function saveEvents() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(events));
    } catch (error) {
        console.error("Could not save events:", error);
        warningMessage.textContent = "Events could not be saved on this device.";
        warningMessage.classList.add("show");
    }
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
        const eventCard = document.createElement("article");
        eventCard.className = "event-card";

        const eventDate = parseDate(event.date);
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
        deleteButton.setAttribute("aria-label", `Delete ${event.name}`);
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        eventCard.append(title, date, description, deleteButton);
        eventsList.appendChild(eventCard);
    });
}

// Parse date-only values as local dates so they do not move to the previous day.
function parseDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

// Convert an ISO date such as 2026-07-15 into readable text.
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return parseDate(dateString).toLocaleDateString("en-US", options);
}

function createEventId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// MODIFY: validate the form, create an object, and add it to events.
function addEvent(event) {
    event.preventDefault();

    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value.trim();

    if (!name || !description || !isValidDate(date)) {
        warningMessage.textContent = "Please fill in all fields (Event Name, Date, and Description)";
        warningMessage.classList.add("show");
        return;
    }

    warningMessage.classList.remove("show");
    events.push({
        id: createEventId(),
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
        return parseDate(firstEvent.date) - parseDate(secondEvent.date);
    });
}

// Delete by id, rather than by a filtered array index.
function deleteEvent(eventId) {
    events = events.filter(event => event.id !== eventId);
    saveEvents();
    searchEvents();
}

// FILTER: show events whose name, date, or description contains the search text.
function searchEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
        displayEvents();
        return;
    }

    const filteredEvents = events.filter(event => {
        const nameMatches = event.name.toLowerCase().includes(searchTerm);
        const dateMatches = event.date.includes(searchTerm);
        const descriptionMatches = event.description.toLowerCase().includes(searchTerm);
        return nameMatches || dateMatches || descriptionMatches;
    });

    displayEvents(filteredEvents);
}

// EVENT LISTENERS: run functions when the user interacts with the page.
eventForm.addEventListener("submit", addEvent);
searchInput.addEventListener("input", searchEvents);

// INITIALIZE: sort before the first render, so the page is drawn once correctly.
sortEventsByDate();
displayEvents();
