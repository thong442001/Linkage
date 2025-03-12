import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


const IncomingCallScreen = ({ route, navigation }) => {
  const { group,type } = route.params;
  const [name, setname] = useState(null);
  const [avatar, setavatar] = useState(null);
  const me = useSelector(state => state.app.user);
    console.log("canhphan",group);
    useEffect(() => {
        if(group.isPrivate==true){
            const otherUser = group.members.find(user => user._id !== me._id);
            
            if(otherUser){
                setname((otherUser.first_name + " " + otherUser.last_name));
                setavatar(otherUser.avatar);
            }else {
                console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
            }
        }else{
            if(group.avatar==null){
                setavatar('https://firebasestorage.googleapis.com/v0/b/hamstore-5c2f9.appspot.com/o/Anlene%2Flogo.png?alt=media&token=f98a4e03-1a8e-4a78-8d0e-c952b7cf94b4')
            }else{
                setavatar(group.avatar);
            }
            if(group.name==null){
                const names = group.members
                    .filter(user => user._id !== me._id)
                    .map(user => `${user.first_name} ${user.last_name}`)
                    .join(", ");
                    // Cập nhật state một lần duy nhất
                    setname(names);
            }else{
                setname(group.name);
            }
    }
    }, [])
    


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Image
        source={{ uri: avatar || 'https://example.com/default-avatar.png' }}
        style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
      />
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
        {name || "Người gọi"}
      </Text>
      <Text style={{ color: '#fff', fontSize: 18 }}>Đang gọi...</Text>

      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CallPage", { ID_group: group._id, id_user: me._id, MyUsername: me.last_name, status: type, MyAvatar: me.avatar})        }
          style={{ backgroundColor: 'green', padding: 15, borderRadius: 50, marginHorizontal: 20 }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Chấp nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: 'red', padding: 15, borderRadius: 50, marginHorizontal: 20 }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Từ chối</Text>
        </TouchableOpacity>
      </View>
          </View>
  );
};

export default IncomingCallScreen;
