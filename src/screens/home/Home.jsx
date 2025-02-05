import {
    StyleSheet,
    Text,
    View
} from 'react-native'
import React from 'react'

const Home = (props) => {
    const { navigation } = props;

    return (
        <View>

            <Text style={styles.txt}>Home</Text>
            <Text >Home</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    txt: {
        fontFamily: 'Inter-Italic-VariableFont_opsz,wght',
    },
});

export default Home
