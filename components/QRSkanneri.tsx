
import { FAB, Text } from 'react-native-paper'
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import WebView from 'react-native-webview';

interface scannedQR {
    uri: string,
    valid: boolean
}

const deviceWidth = Dimensions.get('window').width;

const QRSkanneri: React.FC = (): React.ReactElement => {

    const [scannerOpen, setScannerOpen] = useState<boolean>(false)
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [scannedQR, setscannedQR] = useState<scannedQR>({ uri: "", valid: false });

    useEffect(() => {
        const getBarCodeScannerPermissions = async (): Promise<void> => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = (barcode: any) => {
        if (String(barcode.data).startsWith("https://") || String(barcode.data).startsWith("http://")) {
            setscannedQR({ uri: barcode.data, valid: true })
        } else {
            console.log("Failure")
        }
        setScannerOpen(false)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {(scannerOpen)
                ?
                <>
                    <BarCodeScanner
                        onBarCodeScanned={(barcode) => handleBarCodeScanned(barcode)}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <FAB
                        style={styles.buttonClose}
                        icon="close"
                        label="Close scanner"
                        onPress={() => setScannerOpen(false)}
                    />
                </>
                : (scannedQR.valid)
                    ?
                    <WebView
                        style={styles.webview}
                        source={{ uri: scannedQR.uri }}
                    />
                    :
                    <Button
                        color="#f194ff"
                        title="Open QR-scanner"
                        onPress={() => setScannerOpen(true)}
                    />
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    buttonClose: {
        position: "absolute",
        margin: 20,
        bottom: 0,
        right: 0
    },
    webview: {
        flex: 1,
        width: deviceWidth
    }
});

export default QRSkanneri;