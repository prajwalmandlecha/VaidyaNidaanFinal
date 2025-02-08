import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import Home from "./src/screens/Home";
// import Prediction from "./src/screens/Prediction";
import Chat from "./src/screens/Chat";
import PatientPage from "./src/screens/PatientPage";
import Profile from "./src/screens/Profile";

import { UserProvider, UserContext } from "./src/context/UserContext";
import { useContext } from "react";
import LogOutLink from "./src/components/LogOutLink";
import AddPatient from "./src/screens/AddPatient";
import Analysis from "./src/screens/Analysis";
import UpdatePatient from "./src/screens/UpdatePatient";
import Result from "./src/screens/Result";
// import PredictionResult from "./src/screens/PredictionResult";

const AuthStack = createStackNavigator();
const AppStack = createBottomTabNavigator();
const MainStack = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={AppNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen name="PatientPage" component={PatientPage} />
      <MainStack.Screen name="Add Patient" component={AddPatient} />
      <MainStack.Screen name="Update Patient" component={UpdatePatient} />
      <MainStack.Screen name="MRI Analysis" component={Analysis} />
      <MainStack.Screen name="Result" component={Result} />
      {/* <MainStack.Screen name="Prediction" component={Prediction} /> */}
      {/* <MainStack.Screen name="PredictionResult" component={PredictionResult} /> */}
    </MainStack.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
  };
  return (
    <AppStack.Navigator
      screenOptions={{
        headerRight: () => <LogOutLink onPress={() => handleLogout()} />,
        tabBarActiveTintColor: "#07054A",
        tabBarInactiveTintColor: "#A0A3B1",
      }}
    >
      <AppStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <AppStack.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
      <AppStack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </AppStack.Navigator>
  );
};

const AppContent = () => {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
