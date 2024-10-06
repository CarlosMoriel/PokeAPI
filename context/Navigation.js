import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
// Pages
import { PokedexScreen, FavoritesScreen } from '../pages/Main';
import PokemonDetailsScreen from '../pages/PokemonDetails';
import Login from "../pages/Login";
import Register from '../pages/Register';
import { signOut } from 'firebase/auth';
import { auth } from '../bd/firebase';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Pokedex') {
                        iconName = 'list-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = 'heart-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Pokedex" component={PokedexScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Favoritos" component={FavoritesScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="PokeAPI Moriel"
                component={MainTabs}
            />
            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{ title: 'Cerrar Sesión' }}
            />
        </Drawer.Navigator>
    );
};

// Componente para cerrar sesión
const LogoutScreen = ({ navigation }) => {
    navigation.replace('Login')
  
        signOut(auth)
          .then(() => {
            // Sesión cerrada correctamente
            console.log("Sesión cerrada");
            // Aquí puedes redirigir al usuario a la pantalla de inicio de sesión u otra pantalla
            navigation.navigate("Login");
          })
          .catch((error) => {
            // Ocurrió un error al cerrar la sesión
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar la sesión, intenta nuevamente.");
          });
     
    return (
        <></>
    );
};

// Componente de navegación principal (Stack Navigator)
const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ title: 'Iniciar Sesión', headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ title: 'Registrar', headerShown: false }}
                />
                <Stack.Screen
                    name="Main"
                    component={DrawerNavigator}
                    options={{
                        title: 'Pokedex',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="PokemonDetails"
                    component={PokemonDetailsScreen}
                    options={{
                        title: 'Detalles del Pokémon',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
