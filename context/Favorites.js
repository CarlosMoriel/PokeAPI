import React, { createContext, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../bd/firebase';

// Creamos el contexto
export const FavoritesContext = createContext();

// Proveedor del contexto
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    console.log("Favs -----------");
    console.log(favorites);
    // Función para obtener favoritos del usuario autenticado
    const fetchFavorites = async () => {
        if (auth.currentUser) {
            const docRef = doc(db, "fav", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docData = docSnap.data();
                console.log("Document data:", docData);
                return docData.favs;
            } else {
                return [];
            }
        }
        return [];
    };

    useEffect(() => {
        // Obtener favoritos al montar el componente
        const getFavorites = async () => {
            const fetchedFavorites = await fetchFavorites();
            setFavorites(fetchedFavorites);
        };
        getFavorites();
    }, []);

    // Función para agregar o quitar de favoritos
    const toggleFavorite = async (pokemonId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(pokemonId)
                ? prevFavorites.filter((id) => id !== pokemonId)
                : [...prevFavorites, pokemonId]
        );
    };

    useEffect(() => {
        if (auth.currentUser && favorites.length > 0) {
            setDoc(doc(db, "fav", auth.currentUser.uid), {
                favs: favorites,
                uid: auth.currentUser.uid
            });
        }
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
