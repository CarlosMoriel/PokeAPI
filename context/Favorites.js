import React, { createContext, useState } from 'react';

// Creamos el contexto
export const FavoritesContext = createContext();

// Proveedor del contexto
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Función para agregar o quitar de favoritos
    const toggleFavorite = (pokemonId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(pokemonId)
                ? prevFavorites.filter((id) => id !== pokemonId)
                : [...prevFavorites, pokemonId]
        );
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
