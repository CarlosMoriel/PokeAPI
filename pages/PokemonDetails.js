import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/Favorites';
import { getTypeImageUrl } from './Main';

const PokemonDetailsScreen = ({ route, navigation }) => {
    const { pokemonId } = route.params;
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [pokemonDetails, setPokemonDetails] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                const data = await response.json();
                setPokemonDetails(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPokemonDetails();
    }, [pokemonId]);

    if (!pokemonDetails) {
        return <Text style={styles.loadingText}>Cargando...</Text>;
    }

    const isFavorite = favorites.includes(pokemonId);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(pokemonId)}
            >
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={32}
                    color={isFavorite ? 'red' : 'gray'}
                />
            </TouchableOpacity>

            <Image
                source={{ uri: pokemonDetails.sprites.front_default }}
                style={styles.pokemonImage}
            />
            <Text style={styles.pokemonName}>{pokemonDetails.name}</Text>
            <Text style={styles.pokemonId}>ID: {pokemonDetails.id}</Text>

            <View style={styles.typesContainer}>
                {pokemonDetails.types.map((type) => (
                    <Image
                        key={type.type.name}
                        source={{ uri: getTypeImageUrl(type.type.name) }}
                        style={styles.typeImage}
                    />
                ))}
            </View>

            <Text style={styles.detailsText}>Peso: {pokemonDetails.weight}</Text>
            <Text style={styles.detailsText}>Altura: {pokemonDetails.height}</Text>
            <Text style={styles.detailsText}>
                Experiencia base: {pokemonDetails.base_experience}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    pokemonImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    pokemonName: {
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginBottom: 10,
    },
    pokemonId: {
        fontSize: 18,
        color: '#888',
        marginBottom: 20,
    },
    typesContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    typeImage: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
    },
    detailsText: {
        fontSize: 16,
        marginBottom: 5,
    },
    loadingText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default PokemonDetailsScreen;
