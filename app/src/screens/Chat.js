import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { useContext, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import SendIcon from "../components/SendIcon";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { UserContext } from "../context/UserContext";
import { chatbotApi } from "../services/apiService";
import removeMarkdown from "remove-markdown";
import Markdown from "react-native-markdown-display";

const Chat = () => {
  const currentUser = useContext(UserContext);
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: "Welcome !",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: "Vaidya Nidaan",
        avatar: require("../../assets/avatar.png"),
      },
    },
  ]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isImageSent, setIsImageSent] = useState(false);
  const markdownStyles = {
    body: {
      color: "#07054A",
      fontSize: 16,
      padding: 0,
      margin: 0,
    },

    paragraph: {
      marginTop: 0,
      marginBottom: 0,
    },

    heading1: {
      marginTop: 0,
      marginBottom: 8,
    },

    bullet_list: {
      marginTop: 4,
      marginBottom: 4,
      paddingLeft: 8,
    },

    list_item: {
      marginTop: 2,
      marginBottom: 2,
    },

    code_block: {
      padding: 8,
      marginVertical: 4,
    },
  };

  const renderSend = (props) => {
    return (
      <View style={styles.sendContainer}>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        <SendIcon
          {...props}
          image={image}
          setImage={setImage}
          isImageSent={isImageSent}
          setIsImageSent={setIsImageSent}
        />
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <View
        style={[
          styles.bubble,
          props.position === "left" ? styles.bubbleLeft : styles.bubbleRight,
        ]}
      >
        {props.currentMessage.image && (
          <Image
            source={{ uri: props.currentMessage.image }}
            style={styles.image}
          />
        )}
        {props.currentMessage.text && (
          <View style={styles.messageContent}>
            {props.position === "left" ? (
              <Markdown style={markdownStyles} mergeStyle={true}>
                {props.currentMessage.text}
              </Markdown>
            ) : (
              <Text style={styles.messageTextRight}>
                {props.currentMessage.text}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const handleSend = async (newMessages = []) => {
    const text = newMessages[0]?.text?.trim();
    setLoading(true);
    if (!text || !image) {
      alert("Please provide both an image and text for analysis");
      return;
    }

    setMessages((prev) =>
      GiftedChat.append(prev, [
        {
          _id: Date.now(),
          text: text,
          image: image,
          createdAt: new Date(),
          user: {
            _id: currentUser.id,
            name: currentUser.name,
            avatar: require("../../assets/userAvatar.png"),
          },
        },
      ])
    );

    const loadingMessageId = Date.now() + 1;
    setMessages((prev) =>
      GiftedChat.append(prev, [
        {
          _id: loadingMessageId,
          text: "Analyzing...",
          createdAt: new Date(),
          user: {
            _id: 1,
            name: "Vaidya Nidaan",
            avatar: require("../../assets/avatar.png"),
          },
          isLoading: true,
        },
      ])
    );

    try {
      // Prepare multipart/form-data
      const formData = new FormData();

      // Add image file
      const filename = image.split("/").pop();
      const fileType = filename.split(".").pop();
      formData.append("file", {
        uri: image,
        name: filename,
        type: `image/${fileType}`,
      });

      // Add text
      formData.append("text", text);

      // Send to backend
      const response = await chatbotApi.post("/upload", formData);

      // Add USER message with image+text
      setMessages((prev) => prev.filter((msg) => msg._id !== loadingMessageId));

      // Add BOT response
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: Date.now() + 1,
            text: response.data.analysisResult,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: "Vaidya Nidaan",
              avatar: require("../../assets/avatar.png"),
            },
          },
        ])
      );

      // Clear image state
      //setImage(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Analysis failed - please try again");
    } finally {
      setLoading(false);
    }
  };

  // const handleQuerySend = async (newMessages = []) => {
  //   const text = newMessages[0]?.text?.trim();
  //   setLoading(true);
  //   if (!text) {
  //     alert("Please provide text for analysis");
  //     return;
  //   }

  //   setMessages((prev) =>
  //     GiftedChat.append(prev, [
  //       {
  //         _id: Date.now(),
  //         text: text,
  //         createdAt: new Date(),
  //         user: {
  //           _id: currentUser.id,
  //           name: currentUser.name,
  //           avatar: require("../../assets/userAvatar.png"),
  //         },
  //       },
  //     ])
  //   );

  //   const loadingMessageId = Date.now() + 1;
  //   setMessages((prev) =>
  //     GiftedChat.append(prev, [
  //       {
  //         _id: loadingMessageId,
  //         text: "Analyzing...",
  //         createdAt: new Date(),
  //         user: {
  //           _id: 1,
  //           name: "Vaidya Nidaan",
  //           avatar: require("../../assets/avatar.png"),
  //         },
  //         isLoading: true,
  //       },
  //     ])
  //   );

  //   try {
  //     const response = await api.post("/query", { text });

  //     setMessages((prev) => prev.filter((msg) => msg._id !== loadingMessageId));

  //     // Add BOT response
  //     setMessages((prev) =>
  //       GiftedChat.append(prev, [
  //         {
  //           _id: Date.now() + 1,
  //           text: response.data.analysisResult,
  //           createdAt: new Date(),
  //           user: {
  //             _id: 1,
  //             name: "Vaidya Nidaan",
  //             avatar: require("../../assets/avatar.png"),
  //           },
  //         },
  //       ])
  //     );
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     alert("Analysis failed - please try again");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <GiftedChat
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        messages={messages}
        onSend={(messages) => handleSend(messages)}
        renderSend={renderSend}
        showAvatarForEveryMessage={false}
        bottomOffset={tabBarHeight}
        alwaysShowSend={true}
        renderBubble={renderBubble}
        placeholder="Ask for information..."
        shouldUpdateMessage={() => true}
        isLoadingEarlier={loading}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
  },
  bubbleLeft: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginLeft: 8,
  },
  bubbleRight: {
    backgroundColor: "#07054A",
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
  },
  messageTextLeft: {
    color: "#07054A",
  },
  messageTextRight: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  sendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  messageContent: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  messageContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 0, // Reset padding here
    margin: 0, // Reset margin here
  },

  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 8,
    marginVertical: 4,
  },
});
