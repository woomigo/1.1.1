import React from "react";
import { LogBox} from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./Navigation";

LogBox.ignoreAllLogs();

const App = () => {

  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );

}

export default App;
