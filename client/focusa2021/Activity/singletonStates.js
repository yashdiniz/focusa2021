import { Alert } from "react-native";

let login = false;

const isLoggedIn = () => {
    // Alert.alert(login.toString());
    return login;
}

const loggedInSuccessfully = () => {
    return (login = true);
}

export { isLoggedIn, loggedInSuccessfully };