import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

const appID = 1765636844; // Thay bằng App ID của bạn
const appSign = "af8071fe64fe73a7ae9dc9a4abb0787739588c433b2598d10804d983d65f319e"; // Thay bằng App Sign của bạn

export const onUserLogin = async (userID, userName) => {
  if (!userID || !userName) {
    console.error("❌ UserID hoặc UserName không hợp lệ.");
    return;
  }
  try {
    await ZegoUIKitPrebuiltCallService.init(
      appID,
      appSign,
      userID,
      userName,
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        androidNotificationConfig: {
          channelID: "ZegoUIKit",
          channelName: "ZegoUIKit",
        },
      }
    );
    console.log("✅ Zego Call Service initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing Zego Call Service:", error);
  }
};

export const onUserLogout = async () => {
  try {
    await ZegoUIKitPrebuiltCallService.uninit();
    console.log("✅ Zego Call Service uninitialized successfully.");
  } catch (error) {
    console.error("❌ Error uninitializing Zego Call Service:", error);
  }
};
