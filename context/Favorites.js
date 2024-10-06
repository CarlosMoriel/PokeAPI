import React, { createContext, useEffect, useState } from 'react';
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../bd/firebase';

// Creamos el contexto
export const FavoritesContext = createContext();

// Proveedor del contexto
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Función para agregar o quitar de favoritos
    const toggleFavorite = async (pokemonId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(pokemonId)
                ? prevFavorites.filter((id) => id !== pokemonId)
                : [...prevFavorites, pokemonId]
        );
    };

    useEffect(async ()=> {
        await setDoc(doc(db, "fav", auth.currentUser.uid), {
            favs: favorites,
            uid: auth.currentUser.uid
          });
    }, [favorites])

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
