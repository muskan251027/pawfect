export const rootUrl = "http://localhost/"; 
export const links = [
    {name: "My Profile", path: "/profile"},
    {name: "Edit Profile", path: "/editProfile"},
    {name: "My Pets", path: "/petsList"},
    {name: "Add a new pet", path: "/addPet"}
];

export const petlinks = [
    {name: "Back to Account", path: "/profile"},
    {name: "My Profile", path: "/petProfile"},
    {name: "Edit Profile", path: "/editPetProfile"},
    {name: "My Requests", path: "/petRequests"},
    {name: "My Connections", path: "/petConnections"},
    {name: "Send Requests", path: "/sendRequest"}
];

export function stringValidation(str) {
    if(str == "") {
        return false;
    }
    else {
        return true;
    }
}

export function emptySelectValidation(str) {
    if(str == "0") {
        return false;
    }
    else {
        return true;
    }
}

export function emailValidation(str) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
}

export function numberValidation(value) {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0;
}

export function decimalValidationAndConversion(value) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return null; // Invalid or non-positive value
    }
    const decimalValue = parsedValue.toFixed(2);
    return parseFloat(decimalValue);
  }