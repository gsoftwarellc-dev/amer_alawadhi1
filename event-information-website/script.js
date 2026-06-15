// Store the event names and ticket prices in one object.
const eventData = {
    technology: {
        name: "Technology Conference 2026",
        price: 50
    },
    music: {
        name: "Music Festival 2026",
        price: 75
    },
    business: {
        name: "Business Leadership Summit",
        price: 100
    }
};

// Get the form and output elements from the page.
const ticketForm = document.getElementById("ticket-form");
const eventSelect = document.getElementById("event-select");
const ticketQuantityInput = document.getElementById("ticket-quantity");
const errorMessage = document.getElementById("error-message");
const resultPlaceholder = document.getElementById("result-placeholder");
const resultDetails = document.getElementById("result-details");
const priceResult = document.getElementById("price-result");
const eventCardLinks = document.querySelectorAll(".card-link");
const eventCards = document.querySelectorAll(".event-card");

// Store the result element IDs so a loop can update the output.
const resultElementIds = [
    "result-event",
    "result-quantity",
    "result-original",
    "result-discount",
    "result-total"
];

// Get each result element using a loop.
const resultElements = {};

for (let index = 0; index < resultElementIds.length; index++) {
    const elementId = resultElementIds[index];
    resultElements[elementId] = document.getElementById(elementId);
}

// Run the calculation when the user submits the form.
ticketForm.addEventListener("submit", function (event) {
    // Stop the form from refreshing the page.
    event.preventDefault();

    const selectedEventKey = eventSelect.value;
    const ticketQuantity = Number(ticketQuantityInput.value);

    // Clear the previous error before checking the new input.
    errorMessage.textContent = "";

    // Validate that both fields contain suitable values.
    if (selectedEventKey === "" && ticketQuantityInput.value === "") {
        showError("Please select an event and enter the number of tickets.");
        return;
    } else if (selectedEventKey === "") {
        showError("Please select an event.");
        return;
    } else if (ticketQuantityInput.value === "") {
        showError("Please enter the number of tickets.");
        return;
    } else if (!Number.isInteger(ticketQuantity) || ticketQuantity < 1) {
        showError("Please enter a whole number of tickets greater than zero.");
        return;
    }

    const selectedEvent = eventData[selectedEventKey];
    const originalPrice = selectedEvent.price * ticketQuantity;
    let discountRate = 0;

    // Apply the discount according to the required ticket ranges.
    if (ticketQuantity <= 2) {
        discountRate = 0;
    } else if (ticketQuantity <= 5) {
        discountRate = 0.10;
    } else {
        discountRate = 0.20;
    }

    const discountAmount = originalPrice * discountRate;
    const finalTotalPrice = originalPrice - discountAmount;

    // Prepare all output values in the same order as the result element IDs.
    const resultValues = [
        selectedEvent.name,
        ticketQuantity,
        formatCurrency(originalPrice),
        formatCurrency(discountAmount),
        formatCurrency(finalTotalPrice)
    ];

    // Use a loop to display each calculated value.
    for (let index = 0; index < resultElementIds.length; index++) {
        const elementId = resultElementIds[index];
        resultElements[elementId].textContent = resultValues[index];
    }

    // Show the completed price summary.
    resultPlaceholder.hidden = true;
    resultDetails.hidden = false;
    priceResult.classList.add("calculated");
});

// Display an error and hide any old calculation.
function showError(message) {
    errorMessage.textContent = message;
    resultPlaceholder.hidden = false;
    resultDetails.hidden = true;
    priceResult.classList.remove("calculated");
}

// Convert a number to a simple US dollar price.
function formatCurrency(amount) {
    return "$" + amount.toFixed(2);
}

// Select an event and move to the ticket calculator.
function openTicketCalculator(eventKey) {
    eventSelect.value = eventKey;
    errorMessage.textContent = "";
    document.getElementById("tickets").scrollIntoView({
        behavior: "smooth"
    });
}

// Select the matching event when a card's ticket link is clicked.
for (let index = 0; index < eventCardLinks.length; index++) {
    eventCardLinks[index].addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openTicketCalculator(eventCardLinks[index].dataset.event);
    });
}

// Make the complete event card clickable with mouse or keyboard.
for (let index = 0; index < eventCards.length; index++) {
    eventCards[index].addEventListener("click", function () {
        openTicketCalculator(eventCards[index].dataset.event);
    });

    eventCards[index].addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openTicketCalculator(eventCards[index].dataset.event);
        }
    });
}

// Remove an old error as soon as the user changes an input.
eventSelect.addEventListener("change", clearError);
ticketQuantityInput.addEventListener("input", clearError);

function clearError() {
    errorMessage.textContent = "";
}
