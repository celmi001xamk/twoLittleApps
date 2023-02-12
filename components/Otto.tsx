import React, { useState, useEffect } from 'react'
import ottoDataFile from "../ottoData.json"
import * as Location from 'expo-location';
import { View, Button, StyleSheet, Text } from 'react-native';

interface OttoMachine {
    katuosoite: string,
    postinumero: string,
    postitoimipaikka: string,
    koordinaatti_LAT: number,
    koordinaatti_LON: number,
    distance?: number
}

const Otto: React.FC = (): React.ReactElement => {

    const [ottoData, setOttoData] = useState<OttoMachine[]>();
    const [error, setError] = useState<String>();
    const [location, setLocation] = useState<any>()
    const [nearestATM, setNearestATM] = useState<OttoMachine>();

    useEffect(() => {
        setOttoData(ottoDataFile);

        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setError('No permission to access location');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();

    }, []);

    const findNearestATM = (): void => {
        let nearest: OttoMachine;
        let shortestDistance: number = Number.MAX_SAFE_INTEGER;

        let x1: number = location.coords.latitude;
        let y1: number = location.coords.longitude;

        ottoData?.forEach(machine => {
            let x2: number = machine.koordinaatti_LAT;
            let y2: number = machine.koordinaatti_LON;

            const distance = Math.hypot(x2 - x1, y2 - y1);

            if (distance < shortestDistance) {
                shortestDistance = distance
                nearest = machine;
            };
        });

        let distanceInKilometers = shortestDistance * 111;

        setNearestATM({ ...nearest!, distance: distanceInKilometers })

    }

    return (
        <View style={styles.container}>
            {
                (nearestATM)
                    ?
                    <>
                        <Text style={styles.addressGuide}>Nearest Otto ATM is located at:</Text>
                        <Text style={styles.address}>{nearestATM.katuosoite}</Text>
                        <Text style={styles.address}>{nearestATM.postinumero}</Text>
                        <Text style={styles.address}>{nearestATM.postitoimipaikka}</Text>
                        <Text>{`${nearestATM.distance?.toFixed(2)} km`}</Text>
                    </>
                    :
                    <>
                        <Button
                            color="#f194ff"
                            title="Find nearest Otto ATM"
                            onPress={findNearestATM}
                        />
                        {
                            (error)
                                ? <Text style={styles.error}>{error}</Text>
                                : null

                        }
                    </>

            }

            {
                (error)
                    ? <Text style={styles.error}>{error}</Text>
                    : null

            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    error: {
        marginTop: 20,
        color: "red"
    },
    address: {
        fontSize: 24
    },
    addressGuide: {
        fontSize: 16
    }
});

export default Otto;