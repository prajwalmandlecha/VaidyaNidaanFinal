import { Send } from "react-native-gifted-chat";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const SendIcon = ({
  onImageSend,
  image,
  setImage,
  isImageSent,
  setIsImageSent,
  ...props
}) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
        <AntDesign name="paperclip" size={24} color="black" />
      </TouchableOpacity>
      <Send
        {...props}
        disabled={!props.text || !image}
        containerStyle={{
          justifyContent: "center",
          opacity: !props.text || !image ? 0.5 : 1,
        }}
      >
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#07054A" />
        </View>
      </Send>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  actionButton: {
    marginRight: 25,
  },
  sendButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});

export default SendIcon;
