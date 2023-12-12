//DOM Elements
// Room Booking Elements
const bookingName = document.getElementById("name");
const bookingEmail = document.getElementById("email");
const roomType = document.getElementById("room-type");
const numRooms = document.getElementById("num-rooms");
const extras = document.getElementById("extra");
const poolViewCheckbox = document.getElementById("dot-1");
const gardenViewCheckbox = document.getElementById("dot-2");
const mountainViewCheckbox = document.getElementById("dot-3");
const lakesideViewCheckbox = document.getElementById("dot-4");
const numExtraBed = document.getElementById("num-extra-bed");
const numAdults = document.getElementById("num-adults");
const numChildren = document.getElementById("num-children");
const checkInDate = document.getElementById("check-in-date");
const duration = document.getElementById("duration");
const promoCode = document.getElementById("promo");
const bookBtn = document.getElementById("booking");
const addFavoriteBtn = document.getElementById("add-favorite");
// Adventure Booking Elements
const advName = document.getElementById("Aname");
const advEmail = document.getElementById("Aemail");
const advType = document.getElementById("adventure-type");
const numLocalAdults = document.getElementById("num-adults-local");
const numForeignAdults = document.getElementById("num-adults-foreign");
const numLocalChildren = document.getElementById("num-children-local");
const numForeignChildren = document.getElementById("num-children-foreign");
const advCheckInDate = document.getElementById("Ad-check-in-date");
const guideAdult = document.getElementById("check-1");
const guideChild = document.getElementById("check-2");
const advBookBtn = document.getElementById("Abooking");
const advAddFavoriteBtn = document.getElementById("Aadd-favorite");
// Additional Options Elements
const overallCost = document.getElementById("overall-cost");
const checkLoyaltyBtn = document.getElementById("check-loyalty");
const loyaltyPoints = document.getElementById("loyalty-points");
// Declarations
let roomCost = 0;
let adventureCost = 0;
const roomPrices = {
    "Single Room": 25000.00,
    "Double Room": 35000.00,
    "Triple Room": 40000.00,
    "Studio Rooms": 60000.00,
    "Deluxe Room": 50000.00,
    "Regular Suites": 80000.00,
    "Presidential Suites": 100000.00
};
const adventureTypes = ["Diving & Boat Tours", "Hiking & Bike Rentals"];
const nBedCost = 8000.00;
const cFoodCost = 5000.00;
const promoValue = "Promo123";
let extraDetails = ""; 
// Event Listeners
bookBtn.addEventListener("click", book);
advBookBtn.addEventListener("click", bookAdv);
addFavoriteBtn.addEventListener("click", addToFavorites);
advAddFavoriteBtn.addEventListener("click", addToFavorites);
checkLoyaltyBtn.addEventListener("click", checkLoyalty);
//Promo code
function promoDiscount() {
    const promoEntered = promoCode.value.trim();

    if (promoEntered === promoValue) {
        return 0.05; // 5% discount
    } else {
        return 0;
    }
}
//Room cost calculation
function calculateRoomCost(roomType, numExtraBed, numChildren) {
    let baseCost = roomPrices[roomType] || 0;
    let extraBedCost = parseInt(numExtraBed) * nBedCost;
    let childMealCost = parseInt(numChildren) * cFoodCost;

    return baseCost + extraBedCost + childMealCost;
}
//Adventure cost calculation
function calculateAdventureCost(advType, guideAdult, guideChild, localAdult, localChild, foreignAdult, foreignChild) {
    let cost = 0;

    if (advType === "Diving & Boat Tours") {
        const divingCostLocalAdult = 5000.00;
        const divingCostLocalChild = 2000.00;
        const divingCostForeignAdult = 10000.00;
        const divingCostForeignChild = 5000.00;
        const guideAdultCost = 1000.00;
        const guideChildCost = 500.00;

        cost =
            (guideAdult ? guideAdultCost * (localAdult + foreignAdult) : 0) +
            (guideChild ? guideChildCost * (localChild + foreignChild) : 0) +
            divingCostLocalAdult * localAdult +
            divingCostLocalChild * localChild +
            divingCostForeignAdult * foreignAdult +
            divingCostForeignChild * foreignChild;
    } else if (advType === "Hiking & Bike Rentals") {
        const hikingCostLocalAdult = 8000.00;
        const hikingCostLocalChild = 4000.00;
        const hikingCostForeignAdult = 12000.00;
        const hikingCostForeignChild = 6000.00;
        const guideAdultCost = 1000.00;
        const guideChildCost = 500.00;

        cost =
            (guideAdult ? guideAdultCost * (localAdult + foreignAdult) : 0) +
            (guideChild ? guideChildCost * (localChild + foreignChild) : 0) +
            hikingCostLocalAdult * localAdult +
            hikingCostLocalChild * localChild +
            hikingCostForeignAdult * foreignAdult +
            hikingCostForeignChild * foreignChild;
    }

    return cost;
}
//room booking finction
function book() {
    const roomTypeValue = roomType.options[roomType.selectedIndex].text;
    const currentRoomCost = calculateRoomCost(roomTypeValue, numExtraBed.value, numChildren.value);
    const promoGiven = promoDiscount();
    roomCost = currentRoomCost * (1 - promoGiven);
    
    displayCurrentBooking(roomTypeValue, parseInt(numAdults.value) || 0, parseInt(numChildren.value) || 0, duration.value || 0,extras);
    resetBookingFields();
    let selectedExtras = [];
    if (poolViewCheckbox.checked) selectedExtras.push("Pool View");
    if (gardenViewCheckbox.checked) selectedExtras.push("Garden View");
    if (mountainViewCheckbox.checked) selectedExtras.push("Mountain View");
    if (lakesideViewCheckbox.checked) selectedExtras.push("Lakeside View");

    displayExtras.textContent = selectedExtras.join(", ");
}
//Adventure booking function
function bookAdv() {
    const advTypeValue = advType.options[advType.selectedIndex].text;
    const currentAdvCost = calculateAdventureCost(advTypeValue, guideAdult.checked, guideChild.checked, parseInt(numLocalAdults.value) || 0, parseInt(numLocalChildren.value) || 0, parseInt(numForeignAdults.value) || 0, parseInt(numForeignChildren.value) || 0);
    adventureCost = currentAdvCost;

    displayCurrentAdventureBooking(advTypeValue, parseInt(numLocalAdults.value) || 0, parseInt(numLocalChildren.value) || 0, parseInt(numForeignAdults.value) || 0, parseInt(numForeignChildren.value) || 0, guideAdult.checked, guideChild.checked);
    resetAdvBookingFields();
}
//Initialize storedFavorites as an Array:
var storedFavorites = [];
//add to favorite function
function addToFavorites() {
    const numRoomsInOrder = parseInt(numRooms.value) || 1;
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const order = {
        roomType: roomType.options[roomType.selectedIndex].text,
        numRooms: numRoomsInOrder,
        numAdults: parseInt(numAdults.value) || 0,
        numChildren: parseInt(numChildren.value) || 0,
        duration: duration.value,
        extras: extraDetails,
        roomCost: roomCost.toFixed(2),
        adventureType: advType.options[advType.selectedIndex].text,
        numLocalAdults: parseInt(numLocalAdults.value) || 0,
        numLocalChildren: parseInt(numLocalChildren.value) || 0,
        numForeignAdults: parseInt(numForeignAdults.value) || 0,
        numForeignChildren: parseInt(numForeignChildren.value) || 0,
        guideAdult: guideAdult.checked,
        guideChild: guideChild.checked,
        adventureCost: adventureCost.toFixed(2)
    };

    storedFavorites.push(order);
    localStorage.setItem("favorites", JSON.stringify(storedFavorites));

    alert("Added to Favorites!");
}
//functions for display current room booking area
function displayCurrentBooking(roomType, numAdults, numChildren, duration, extras) {
    const displayRoomType = document.getElementById("displayRoomType");
    const displayNumAdults = document.getElementById("displayNumAdults");
    const displayNumChildren = document.getElementById("displayNumChildren");
    const displayDuration = document.getElementById("displayDuration");
    const displayExtras = document.getElementById("displayExtras");
    const displayRoomPrice = document.getElementById("displayRoomPrice");

    displayRoomType.textContent = roomType;
    displayNumAdults.textContent = numAdults;
    displayNumChildren.textContent = numChildren;
    displayDuration.textContent = duration;
    displayExtras.textContent = extras;
    displayRoomPrice.textContent = roomCost.toFixed(2);

    updateOverallCost();
}
//function for display current adventure booking area 
function displayCurrentAdventureBooking(advType, numLocalAdults, numLocalChildren, numForeignAdults, numForeignChildren, guideAdult, guideChild) {
    const displayAdventureType = document.getElementById("displayAdventureType");
    const displayNumLocalAdults = document.getElementById("displayNumLocalAdults");
    const displayNumLocalChildren = document.getElementById("displayNumLocalChildren");
    const displayNumForeAdults = document.getElementById("displayNumForeAdults");
    const displayNumForeChildren = document.getElementById("displayNumForeChildren");
    const displayGuide = document.getElementById("displayGuide");
    const displayAdventurePrice = document.getElementById("displayAdventurePrice");

    displayAdventureType.textContent = advType;
    displayNumLocalAdults.textContent = numLocalAdults;
    displayNumLocalChildren.textContent = numLocalChildren;
    displayNumForeAdults.textContent = numForeignAdults;
    displayNumForeChildren.textContent = numForeignChildren;
    displayGuide.textContent = guideAdult ? "Adults" : (guideChild ? "Kids" : "None");
    displayAdventurePrice.textContent = adventureCost.toFixed(2);

    updateOverallCost();
}
//overall cost calculation 
function updateOverallCost() {
    const overallCostValue = document.getElementById("overall-cost");
    
    const overallCostNumber = roomCost + adventureCost;
    
    overallCostValue.textContent = overallCostNumber.toFixed(2);
}
//check Loyalty calculation
function checkLoyalty() {
  const numRoomsValue = parseInt(numRooms.value) || 0;
  loyaltyPointsValue = numRoomsValue > 3 ? numRoomsValue * 20 : 0;

  const loyaltyPointsDisplay = document.getElementById("loyalty-points");
  loyaltyPointsDisplay.textContent = loyaltyPointsValue.toFixed(2);

  alert("Loyalty Points: " + (loyaltyPointsValue || 0));
}
//check loyalty 
function checkLoyaltystore() {
  const storedLoyaltyPoints = localStorage.getItem("loyaltyPoints");
  alert("Loyalty Points: " + (storedLoyaltyPoints || 0));
}
//room booking input box resetting
function resetBookingFields() {
    bookingName.value = "";
    bookingEmail.value = "";
    roomType.selectedIndex = 0;
    numRooms.value = "";
    numExtraBed.value = "";
    numAdults.value = "";
    numChildren.value = "";
    checkInDate.value = "";
    duration.value = "";
    promoCode.value = "";
}
//adventure booking input box resetting
function resetAdvBookingFields() {
    advName.value = "";
    advEmail.value = "";
    advType.selectedIndex = 0;
    numLocalAdults.value = "";
    numLocalChildren.value = "";
    numForeignAdults.value = "";
    numForeignChildren.value = "";
    advCheckInDate.value = "";
    guideAdult.checked = false;
    guideChild.checked = false;
}


