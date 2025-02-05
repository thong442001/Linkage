import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    dotContainer: {
        position: 'absolute',
        bottom: height * 0.05, 
        width: '100%', 
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: width * 0.06, 
        textAlign: 'center',
    }
});

export default styles;
