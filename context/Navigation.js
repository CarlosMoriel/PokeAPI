import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
// Pages
import { PokedexScreen, FavoritesScreen } from '../pages/Main';
import Login from "../pages/Login";
import Register from '../pages/Register';

// Crear los navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Componente para la navegación por pestañas (Pokedex y Favoritos)
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

// Agregar Drawer Navigator que envuelve las tabs
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
    return (
        <></>
    );
};

// Componente de navegación principal (Stack Navigator)
const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Pantallas de Login y Registro */}
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
                {/* Pantalla principal que incluye el Drawer Navigator */}
                <Stack.Screen
                    name="Main"
                    component={DrawerNavigator}
                    options={{
                        title: 'Pokedex',
                        headerShown: false, // Ocultar el header del Stack ya que se usa en el Drawer
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
