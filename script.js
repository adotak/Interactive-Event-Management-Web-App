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
const accessibilityInputs = document.querySelectorAll("input[name='accessibility']");
const accessibilityFilters = document.querySelectorAll("input[name='accessibility-filter']");
const languageSelect = document.getElementById("languageSelect");
const volunteerRoleInput = document.getElementById("volunteerRole");
const volunteerCountInput = document.getElementById("volunteerCount");
const volunteerStartInput = document.getElementById("volunteerStart");
const volunteerEndInput = document.getElementById("volunteerEnd");

const translations = {
    en: {
        direction: "ltr",
        subtitle: "Manage Your Events Easily",
        languageLabel: "Language:",
        searchPlaceholder: "Search events by name or date...",
        searchLabel: "Search events by name or date",
        addEventHeading: "Add a New Event",
        eventNameLabel: "Event Name:",
        eventNamePlaceholder: "Enter event name",
        eventDateLabel: "Event Date:",
        eventDescriptionLabel: "Event Description:",
        eventDescriptionPlaceholder: "Enter event description",
        accessibilityLegend: "Accessibility Features Available",
        filterLegend: "Show events with all selected features",
        volunteerLegend: "Volunteer Shift (Optional)",
        volunteerRoleLabel: "Role:",
        volunteerRolePlaceholder: "e.g. Registration desk",
        volunteerCountLabel: "Volunteers needed:",
        volunteerCountPlaceholder: "e.g. 3",
        volunteerStartLabel: "Start:",
        volunteerEndLabel: "End:",
        addEventButton: "Add Event",
        eventsHeading: "Find Accessible Events",
        footerText: "© 2026 Event Horizon. All rights reserved.",
        onlineStatus: "Online - your events are saved on this device.",
        offlineStatus: "Offline - you can still view and manage your saved events.",
        emptyEvents: "No events found. Add one to get started!",
        noAccessibility: "No accessibility features listed.",
        deleteEvent: "Delete Event",
        shiftDetails: "Volunteer shift",
        volunteersNeeded: "volunteers needed",
        volunteersRemaining: "openings remaining",
        noVolunteers: "No volunteer shift listed.",
        volunteerNamePlaceholder: "Your name",
        signUp: "Sign up",
        signedUp: "Signed up",
        volunteerNameRequired: "Please enter your name before signing up.",
        validation: "⚠️ Please fill in all fields (Event Name, Date, and Description)"
    },
    ur: {
        direction: "rtl",
        subtitle: "اپنے پروگرام آسانی سے منظم کریں",
        languageLabel: "زبان:",
        searchPlaceholder: "نام یا تاریخ کے ذریعے پروگرام تلاش کریں...",
        searchLabel: "نام یا تاریخ کے ذریعے پروگرام تلاش کریں",
        addEventHeading: "نیا پروگرام شامل کریں",
        eventNameLabel: "پروگرام کا نام:",
        eventNamePlaceholder: "پروگرام کا نام درج کریں",
        eventDateLabel: "پروگرام کی تاریخ:",
        eventDescriptionLabel: "پروگرام کی تفصیل:",
        eventDescriptionPlaceholder: "پروگرام کی تفصیل درج کریں",
        accessibilityLegend: "دستیابی کی سہولیات",
        filterLegend: "منتخب سہولیات رکھنے والے پروگرام دکھائیں",
        volunteerLegend: "رضاکاروں کی شفٹ (اختیاری)",
        volunteerRoleLabel: "ذمہ داری:",
        volunteerRolePlaceholder: "مثلاً رجسٹریشن ڈیسک",
        volunteerCountLabel: "ضروری رضاکار:",
        volunteerCountPlaceholder: "مثلاً 3",
        volunteerStartLabel: "آغاز:",
        volunteerEndLabel: "اختتام:",
        addEventButton: "پروگرام شامل کریں",
        eventsHeading: "قابل رسائی پروگرام تلاش کریں",
        footerText: "© 2026 ایونٹ ہورائزن۔ جملہ حقوق محفوظ ہیں۔",
        onlineStatus: "آن لائن - آپ کے پروگرام اس ڈیوائس پر محفوظ ہیں۔",
        offlineStatus: "آف لائن - آپ اپنے محفوظ پروگرام دیکھ اور منظم کر سکتے ہیں۔",
        emptyEvents: "کوئی پروگرام نہیں ملا۔ شروع کرنے کے لیے ایک پروگرام شامل کریں!",
        noAccessibility: "دستیابی کی سہولیات درج نہیں ہیں۔",
        deleteEvent: "پروگرام حذف کریں",
        shiftDetails: "رضاکاروں کی شفٹ",
        volunteersNeeded: "رضاکار درکار ہیں",
        volunteersRemaining: "جگہیں باقی ہیں",
        noVolunteers: "رضاکاروں کی شفٹ درج نہیں ہے۔",
        volunteerNamePlaceholder: "آپ کا نام",
        signUp: "رجسٹر کریں",
        signedUp: "رجسٹریشن مکمل",
        volunteerNameRequired: "رجسٹر کرنے سے پہلے اپنا نام درج کریں۔",
        validation: "⚠️ براہ کرم تمام خانے مکمل کریں (نام، تاریخ اور تفصیل)"
    }
};

const accessibilityLabels = {
    "ramp": { en: "Ramp / step-free access", ur: "ریمپ / بغیر سیڑھی رسائی" },
    "sign-language": { en: "Sign-language interpreter", ur: "اشاروں کی زبان کا ترجمان" },
    "captions": { en: "Captions", ur: "تحریری عنوانات" },
    "quiet-room": { en: "Quiet room", ur: "پرسکون کمرہ" },
    "prayer-space": { en: "Prayer space", ur: "نماز کی جگہ" }
};

let currentLanguage = localStorage.getItem("eventHorizonLanguage") || "en";

function getTranslation(key) {
    return translations[currentLanguage][key];
}

function applyLanguage() {
    const translation = translations[currentLanguage];
    document.documentElement.lang = currentLanguage === "ur" ? "ur" : "en";
    document.documentElement.dir = translation.direction;
    document.querySelector(".language-picker").firstChild.textContent = `${translation.languageLabel} `;
    document.getElementById("appSubtitle").textContent = translation.subtitle;
    document.getElementById("searchInput").placeholder = translation.searchPlaceholder;
    document.getElementById("searchInput").setAttribute("aria-label", translation.searchLabel);
    document.getElementById("addEventHeading").textContent = translation.addEventHeading;
    document.getElementById("eventNameLabel").textContent = translation.eventNameLabel;
    document.getElementById("eventName").placeholder = translation.eventNamePlaceholder;
    document.getElementById("eventDateLabel").textContent = translation.eventDateLabel;
    document.getElementById("eventDescriptionLabel").textContent = translation.eventDescriptionLabel;
    document.getElementById("eventDescription").placeholder = translation.eventDescriptionPlaceholder;
    document.getElementById("accessibilityLegend").textContent = translation.accessibilityLegend;
    document.getElementById("filterLegend").textContent = translation.filterLegend;
    document.getElementById("volunteerLegend").textContent = translation.volunteerLegend;
    document.getElementById("volunteerRoleLabel").textContent = translation.volunteerRoleLabel;
    document.getElementById("volunteerRole").placeholder = translation.volunteerRolePlaceholder;
    document.getElementById("volunteerCountLabel").textContent = translation.volunteerCountLabel;
    document.getElementById("volunteerCount").placeholder = translation.volunteerCountPlaceholder;
    document.getElementById("volunteerStartLabel").textContent = translation.volunteerStartLabel;
    document.getElementById("volunteerEndLabel").textContent = translation.volunteerEndLabel;
    document.getElementById("addEventButton").textContent = translation.addEventButton;
    document.getElementById("eventsHeading").textContent = translation.eventsHeading;
    document.getElementById("footerText").textContent = translation.footerText;
    document.querySelectorAll("[data-accessibility-label]").forEach(label => {
        const feature = label.dataset.accessibilityLabel;
        label.textContent = accessibilityLabels[feature][currentLanguage];
    });
    languageSelect.value = currentLanguage;
    updateConnectionStatus();
    searchEvents();
}

function updateConnectionStatus() {
    connectionStatus.textContent = navigator.onLine
        ? getTranslation("onlineStatus")
        : getTranslation("offlineStatus");
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

function getVolunteerMarkup(event, eventIndex) {
        if (!event.volunteerShift || !event.volunteerShift.role || !event.volunteerShift.required) {
            return `<p class="no-volunteers">${getTranslation("noVolunteers")}</p>`;
        }

        const shift = event.volunteerShift;
        const signups = Array.isArray(shift.signups) ? shift.signups : [];
        const remaining = Math.max(shift.required - signups.length, 0);
        const time = shift.start && shift.end ? `${shift.start} - ${shift.end}` : "";
        const signupButton = remaining > 0
            ? `<div class="volunteer-signup">
                <input id="volunteer-name-${eventIndex}" type="text" placeholder="${getTranslation("volunteerNamePlaceholder")}" aria-label="${getTranslation("volunteerNamePlaceholder")}">
                <button class="btn-signup" onclick="signUpForShift(${eventIndex})">${getTranslation("signUp")}</button>
            </div>`
            : `<p class="shift-full">${getTranslation("signedUp")}</p>`;

        return `
            <div class="volunteer-shift">
                <strong>${getTranslation("shiftDetails")}: ${shift.role}</strong>
                <span>${time}</span>
                <span>${remaining} ${getTranslation("volunteersRemaining")} (${shift.required} ${getTranslation("volunteersNeeded")})</span>
                ${signupButton}
            </div>
        `;
}

// ==================== DISPLAY EVENTS FUNCTION ====================
// This function creates and shows all events on the page
function displayEvents(eventsToShow = events) {
    // First, clear all existing event cards
    eventsList.innerHTML = "";

    // Check if there are any events to show
    if (eventsToShow.length === 0) {
        eventsList.textContent = getTranslation("emptyEvents");
        eventsList.className = "events-container empty-events";
        return;
    }

    eventsList.className = "events-container";

    // Loop through each event and create a card for it
    eventsToShow.forEach(event => {
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

        const eventAccessibility = Array.isArray(event.accessibility) ? event.accessibility : [];
        const accessibilityMarkup = eventAccessibility.length > 0
            ? `<div class="accessibility-badges" aria-label="Accessibility features">
                ${eventAccessibility.map(feature => `<span class="accessibility-badge">${accessibilityLabels[feature]?.[currentLanguage] || feature}</span>`).join("")}
            </div>`
            : `<p class="no-accessibility">${getTranslation("noAccessibility")}</p>`;
        const eventIndex = events.indexOf(event);

        // Create the HTML content for the event card
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p class="event-date">📅 ${formatDate(event.date)}</p>
            <p class="event-description">${event.description}</p>
            ${accessibilityMarkup}
            ${getVolunteerMarkup(event, eventIndex)}
            <button class="btn-delete" onclick="deleteEvent(${eventIndex})">${getTranslation("deleteEvent")}</button>
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
    const accessibility = Array.from(accessibilityInputs)
        .filter(input => input.checked)
        .map(input => input.value);
    const volunteerRole = volunteerRoleInput.value.trim();
    const volunteerCount = Number.parseInt(volunteerCountInput.value, 10);
    const volunteerShift = volunteerRole && volunteerCount > 0
        ? {
            role: volunteerRole,
            required: volunteerCount,
            start: volunteerStartInput.value,
            end: volunteerEndInput.value,
            signups: []
        }
        : null;

    // FORM VALIDATION: Check if all fields are filled in
    if (!name || !date || !description) {
        // Show warning message
        warningMessage.textContent = getTranslation("validation");
        warningMessage.classList.add("show");
        return;
    }

    // Hide warning message if everything is okay
    warningMessage.classList.remove("show");

    // Create a new event object
    const newEvent = {
        name: name,
        date: date,
        description: description,
        accessibility: accessibility,
        volunteerShift: volunteerShift
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

function signUpForShift(index) {
    const nameInput = document.getElementById(`volunteer-name-${index}`);
    const name = nameInput.value.trim();
    if (!name) {
        warningMessage.textContent = getTranslation("volunteerNameRequired");
        warningMessage.classList.add("show");
        return;
    }

    const event = events[index];
    if (!event || !event.volunteerShift) {
        return;
    }

    const signups = Array.isArray(event.volunteerShift.signups)
        ? event.volunteerShift.signups
        : [];
    if (signups.length >= event.volunteerShift.required) {
        return;
    }

    signups.push(name);
    event.volunteerShift.signups = signups;
    warningMessage.classList.remove("show");
    saveEvents();
    searchEvents();
}

// ==================== SEARCH FUNCTION ====================
// This function filters events by name or date as the user types
function searchEvents() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedFeatures = Array.from(accessibilityFilters)
        .filter(input => input.checked)
        .map(input => input.value);
    const filteredEvents = events.filter(event => {
        const nameMatch = event.name.toLowerCase().includes(searchTerm);
        const dateMatch = event.date.includes(searchTerm);
        const eventAccessibility = Array.isArray(event.accessibility) ? event.accessibility : [];
        const accessibilityMatch = selectedFeatures.every(feature => eventAccessibility.includes(feature));

        return (searchTerm === "" || nameMatch || dateMatch) && accessibilityMatch;
    });

    displayEvents(filteredEvents);
}

// ==================== EVENT LISTENERS ====================
// These listen for user actions and run functions when they happen

// When the form is submitted (user clicks "Add Event")
eventForm.addEventListener("submit", addEvent);

// When user types in the search box
searchInput.addEventListener("input", searchEvents);
accessibilityFilters.forEach(filter => filter.addEventListener("change", searchEvents));
languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value;
    localStorage.setItem("eventHorizonLanguage", currentLanguage);
    applyLanguage();
});

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

// ==================== INITIALIZE (Run when page loads) ====================
// This code runs when the page first loads
sortEventsByDate();
applyLanguage();
registerServiceWorker();
