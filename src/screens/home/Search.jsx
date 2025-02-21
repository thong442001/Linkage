import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { CustomTextInputSearch } from '../../components/textinputs/CustomTextInput';
import SearchItem from '../../components/items/SearchItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../rtk/API';
//Thong
import Icon from 'react-native-vector-icons/Ionicons';

const Search = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const token = useSelector(state => state.app.token);

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]); 

    const getData = async () => {
        try {
            await dispatch(getAllUsers({ token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response.users);
                    setData(response.users);
                })
                .catch((error) => {
                    console.log('Error:', error);
                });

            // if (result.payload && result.payload.users) {
                
            // }
            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);


    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredProducts([]);
        } else {

            const filtered = data.filter((a) => {
                const displayName = (a.first_name + " " + a.last_name).toLowerCase();
                return displayName.includes(query.toLowerCase()) 
                //const displayName = a.first_name + a.last_name;
                //displayName.toLowerCase().includes(query.toLowerCase());
                //a.displayName.toLowerCase().includes(query.toLowerCase())
            });
            setFilteredProducts(filtered);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomColor: 'black', borderBottomWidth: 1, padding: 15 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={30} color="black" style={{ marginRight: 5 }} />
                </TouchableOpacity>

                <CustomTextInputSearch
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChangeText={handleSearch} // Update query state on text input
                />
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) =>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("TabHome", { screen: "Profile", params: { _id: item._id } })
                        }
                    >
                        <SearchItem user={item} />
                    </TouchableOpacity>
                }
            />
        </View >
    );
};

export default Search;
