import React from 'react'
import { BottomNavigation } from 'react-native-paper'
import QRSkanneri from './QRSkanneri'
import Otto from './Otto';

const OttoRoute = () => <Otto />
const QRRoute = () => <QRSkanneri />;

interface Route {
    key: string,
    title: string,
    focusedIcon: string,
    unfocusedIcon?: string
}

const BottomNav: React.FC = (): React.ReactElement => {
    const [index, setIndex] = React.useState<number>(0);
    const [routes] = React.useState<Route[]>([
        { key: "otto", title: "Otto", focusedIcon: "bank-transfer-out" },
        { key: "qr", title: "QR", focusedIcon: "qrcode" }
    ]);

    const renderScene = BottomNavigation.SceneMap({
        otto: OttoRoute,
        qr: QRRoute
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}

export default BottomNav;