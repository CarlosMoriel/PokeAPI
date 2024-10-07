import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/Favorites';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../bd/firebase';

const fetchPokemons = async (offset, limit) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        const pokemonsWithDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return res.json();
            })
        );
        return pokemonsWithDetails;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const fetchFavoritePokemons = async (favoriteIds) => {
    try {
        const pokemons = await Promise.all(
            favoriteIds.map(async (id) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                return response.json();
            })
        );
        return pokemons;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Función para obtener la URL de la imagen del tipo
export const getTypeImageUrl = (type) => {
    const typeImages = {
        bug: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl73-294f6e5b-aad2-484f-bde8-1ecf082f1dfe.png/v1/fill/w_894,h_894/bug_type_symbol_galar_by_jormxdos_dffvl73-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw3My0yOTRmNmU1Yi1hYWQyLTQ4NGYtYmRlOC0xZWNmMDgyZjFkZmUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.msN6ZkYf5XuPiA27qO-1Zaow3B4iSRqp3nAHzctfBW0',
        dark: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Pok%C3%A9mon_Dark_Type_Icon.svg/1200px-Pok%C3%A9mon_Dark_Type_Icon.svg.png',
        dragon: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl4n-1942f6ac-3f08-4dbb-a761-a722f791bc37.png/v1/fill/w_894,h_894/dragon_type_symbol_galar_by_jormxdos_dffvl4n-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw0bi0xOTQyZjZhYy0zZjA4LTRkYmItYTc2MS1hNzIyZjc5MWJjMzcucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Q9B0RKlPeJSmVIrfZq75vfmVscHZ50jPWPViMQp68kc',
        electric: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl6b-dde44f5e-8bc6-4627-88dc-897d937b57ee.png/v1/fill/w_894,h_894/electric_type_symbol_galar_by_jormxdos_dffvl6b-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw2Yi1kZGU0NGY1ZS04YmM2LTQ2MjctODhkYy04OTdkOTM3YjU3ZWUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ylqFNiIPplKYSHm9NxvolhBO4PIWAn5PWX3L4iFPQXs',
        fairy: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmOLOc7DPiqIdbZYrv0GTJ_R8mr3JYwoS4A&s',
        fighting: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Pok%C3%A9mon_Fighting_Type_Icon.svg/512px-Pok%C3%A9mon_Fighting_Type_Icon.svg.png?20200511092020',
        fire: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl1m-a992d76d-bfa4-41cd-bff6-7546b47f2184.png/v1/fill/w_894,h_894/fire_type_symbol_galar_by_jormxdos_dffvl1m-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmwxbS1hOTkyZDc2ZC1iZmE0LTQxY2QtYmZmNi03NTQ2YjQ3ZjIxODQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.DBmvPsi4hX6q3f8XHGcinkRbtbV2zsh5nB-_s9wse_4',
        flying: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl6n-4e403272-f641-4ec0-a451-49061d40aef6.png/v1/fill/w_894,h_894/flying_type_symbol_galar_by_jormxdos_dffvl6n-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw2bi00ZTQwMzI3Mi1mNjQxLTRlYzAtYTQ1MS00OTA2MWQ0MGFlZjYucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.xTE63SRI89iYddks3zDYryz4UkqEFOCAOH5_feLbQHs',
        ghost: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl2d-818164a9-f8e6-41fc-ba4e-c725e2be0d66.png/v1/fill/w_894,h_894/ghost_type_symbol_galar_by_jormxdos_dffvl2d-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmwyZC04MTgxNjRhOS1mOGU2LTQxZmMtYmE0ZS1jNzI1ZTJiZTBkNjYucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.YKEzh2shCheghxM31oOkuEOOrQlMeW1axtKAyK-Iceg',
        grass: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl0s-d443a3b4-fa4e-47a6-99b4-d2a769785614.png/v1/fill/w_894,h_894/grass_type_symbol_galar_by_jormxdos_dffvl0s-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmwwcy1kNDQzYTNiNC1mYTRlLTQ3YTYtOTliNC1kMmE3Njk3ODU2MTQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.6-S1a0_YYhlP6eXW5QqrJk4jtv6b5a3MRuugxqhJ6EA',
        ground: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl6w-4d2813ab-f8b9-4680-a2b9-5cd8cba67e62.png/v1/fill/w_894,h_894/ground_type_symbol_galar_by_jormxdos_dffvl6w-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw2dy00ZDI4MTNhYi1mOGI5LTQ2ODAtYTJiOS01Y2Q4Y2JhNjdlNjIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.mi6G6qA4y9sPShd2XU7_6zc75r0f-07Wc8R2S9F-JtM',
        ice: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl40-c3b719e6-2acc-48e0-882a-ac3058a944b9.png/v1/fill/w_894,h_894/ice_type_symbol_galar_by_jormxdos_dffvl40-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw0MC1jM2I3MTllNi0yYWNjLTQ4ZTAtODgyYS1hYzMwNThhOTQ0YjkucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.OUuCZGLYjzvozAeQwII4FV6Ef9RZkVPE0Tf17C5qa2I',
        normal: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl50-eef3fc08-9339-4135-8c19-76be942c77ab.png/v1/fill/w_894,h_894/steel_type_symbol_galar_by_jormxdos_dffvl50-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw1MC1lZWYzZmMwOC05MzM5LTQxMzUtOGMxOS03NmJlOTQyYzc3YWIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ppmW3CGOkmE6wnnFeeSlv0QToZ-DiNxKFhdVizDzhck',
        poison: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl5p-899b860a-d006-4425-86fb-012844c1e8d3.png/v1/fill/w_894,h_894/poison_type_symbol_galar_by_jormxdos_dffvl5p-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw1cC04OTliODYwYS1kMDA2LTQ0MjUtODZmYi0wMTI4NDRjMWU4ZDMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.hz_DHqV4XnnzPBce9SWmcaUmx6-egrOyvj2rNqS9ywY',
        psychic: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffvl5b-bde5e34d-f803-4631-9c9d-84c7512d0254.png/v1/fill/w_894,h_894/psychic_type_symbol_galar_by_jormxdos_dffvl5b-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U4ZGRjNGRhLTIzZGQtNDUwMi1iNjViLTM3OGM5Y2ZlNWVmYVwvZGZmdmw1Yi1iZGU1ZTM0ZC1mODAzLTQ2MzEtOWM5ZC04NGM3NTEyZDAyNTQucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.GdprCZ3xkD5I-yvUUfHtmkyBpuexlOXXO_amm1s-HNk',
        rock: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx6ROFxjIS_SIq2YIiOwj4-WG7BaFG-56OyQ&s',
        steel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Pok%C3%A9mon_Steel_Type_Icon.svg/2048px-Pok%C3%A9mon_Steel_Type_Icon.svg.png',
        water: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Pok%C3%A9mon_Water_Type_Icon.svg/1200px-Pok%C3%A9mon_Water_Type_Icon.svg.png',
    };
    return typeImages[type] || '';
};


const PokemonCard = ({ pokemon, toggleFavorite, isFavorite }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PokemonDetails", { pokemonId: pokemon.id })}>
            <View style={styles.cardInter}>
                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(pokemon.id)}>
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? 'red' : 'gray'}
                    />
                </TouchableOpacity>
                <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonImage} />
                <Text style={styles.pokemonName}>{pokemon.name}</Text>
                <Text style={styles.pokemonId}>ID: {pokemon.id}</Text>
                <Image
                    source={{ uri: getTypeImageUrl(pokemon.types[0].type.name) }}
                    style={styles.pokemonTypeImage}
                />
            </View>
        </TouchableOpacity>
    );
};

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const { favorites, toggleFavorite, setFavorites } = useContext(FavoritesContext);

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


    const loadPokemons = async () => {
        if (loading) return;
        setLoading(true);
        const newPokemons = await fetchPokemons(offset, 20); // Cargar 20 Pokémon a la vez
        setPokemons((prev) => [...prev, ...newPokemons]);
        setOffset((prev) => prev + 20);
        setLoading(false);
    };

    useEffect(() => {
        loadPokemons();

        const getFavorites = async () => {
            const fetchedFavorites = await fetchFavorites();
            setFavorites(fetchedFavorites);
        };
        getFavorites();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PokemonCard
                        pokemon={item}
                        toggleFavorite={toggleFavorite}
                        isFavorite={favorites.includes(item.id)}
                    />
                )}
                numColumns={2}
                onEndReached={loadPokemons} // Cargar más Pokémon al llegar al final
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
            />
        </View>
    );
};


// Favoritos
export const FavoritesScreen = () => {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("Cargando...");

    useEffect(() => {
        if (favorites.length > 0) {
            setLoading(true);
            fetchFavoritePokemons(favorites).then((fetchedPokemons) => {
                setPokemons(fetchedPokemons);
                setLoading(false);
            });
        } else {
            setPokemons([]); // Si no hay favoritos, se limpia el estado
            setText("No tienes favoritos aún");
        }
    }, [favorites]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : pokemons.length > 0 ? (
                <FlatList
                        data={pokemons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PokemonCard
                            pokemon={item}
                            toggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(item.id)}
                        />
                    )}
                    numColumns={2}
                />
            ) : (
                        <Text style={styles.text}>{text}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 20,
        margin: 10,
        alignItems: 'center',
        flex: 1,
        elevation: 4,
        position: 'relative',
    },
    cardInter: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    pokemonImage: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    pokemonId: {
        fontSize: 14,
        color: '#888',
    },
    pokemonTypeImage: {
        width: 30,
        height: 30,
        marginTop: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PokedexScreen;
