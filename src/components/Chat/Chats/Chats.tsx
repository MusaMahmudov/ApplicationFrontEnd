import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useContext, useEffect, useRef, useState } from "react";
import { tokenContext } from "../../../contexts/authContext";
import styled from "./Chats.module.scss";
import { DecodedToken, tokenIdProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { useService } from "../../../hooks/hooks";
import { useQuery, useQueryClient } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import {
  chatMessage,
  currentLastMessageModel,
  lastMessageModel,
} from "../../../models/MessageModels";
import { UserInformationForChat } from "../../../models/UserModels";
import { LeftSideChats } from "./LeftSide/LeftSide";
import { ChatsRightSide } from "./RightSide/RightSide";
import { useLocation } from "react-router-dom";
import { BaseUrl } from "../../../API/BaseUrl";
export const Chats = () => {
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken = jwtDecode(token);
  const userId: string = decodedToken[tokenIdProperty];
  const { userServices, messageServices } = useService();
  const [currentUser, setCurrentUser] = useState<UserInformationForChat | null>(
    null
  );

  const [connectionGlobal, setConnectionGlobal] =
    useState<HubConnection | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isLastMessageRead, setIsLastMessageRead] =
    useState<currentLastMessageModel | null>(null);
  const [lastMessage, setLastMessage] = useState<lastMessageModel | null>(null);
  const [allMessage, setAllMessages] = useState<chatMessage[] | null>(null);
  const userQuery = useQuery([QueryKeys.getUsersForChat], () =>
    userServices.getUsersForChat(token)
  );
  const messagesQuery = useQuery(
    [QueryKeys.getMessagesForChat, currentUser?.userId, userId],
    () =>
      messageServices.getAllMessages(userId, currentUser?.userId ?? "", token),
    { enabled: false }
  );
  useEffect(() => {
    queryClient.removeQueries();
  }, []);

  useEffect(() => {
    setAllMessages(null);
    setLastMessage(null);
    if (currentUser) {
      queryClient.refetchQueries([
        QueryKeys.getMessagesForChat,
        currentUser?.userId,
        userId,
      ]);
    }
  }, [currentUser]);
  useEffect(() => {
    if (messagesQuery.isSuccess && !allMessage) {
      setAllMessages(messagesQuery.data?.data);
      setLastMessage(messagesQuery.data?.data[0]);
    }
  }, [messagesQuery]);
  useEffect(() => {
    if (lastMessage) {
      if (!lastMessage.isRead && lastMessage.senderId === currentUser?.userId) {
        connectionGlobal?.invoke(
          "ReadMessage",
          lastMessage.id,
          currentUser.userId
        );
      }
    }
  }, [lastMessage]);
  useEffect(() => {
    async function connect() {
      try {
        if (!connectionGlobal) {
          const connection = new HubConnectionBuilder()
            .withUrl(`${BaseUrl}/Hub`)
            .configureLogging(LogLevel.Information)
            .build();
          await connection.start();

          connection.invoke("JoinGroup", userId);
          connection.on("ReceiveLastMessage", (response, time) => {
            setIsLastMessageRead({ isRead: response, isReadTime: time });
          });
          connection.on("ReceivePrivate", (message, senderId) => {
            if (senderId !== userId) {
              setAllMessages((state) => [
                {
                  content: message,
                  senderId: senderId,
                  receiverId: userId,
                  id: Math.random(),
                  createdAt: new Date().toDateString(),
                  isRead: null,
                  isReadTime: null,
                },
                ...(state ?? []),
              ]);
            }
          });

          setConnectionGlobal(connection);
          setIsConnected(true);

          return () => {
            if (connection && connection.state === "Connected") {
              connection.stop();

              setIsConnected(false);
            }
          };
        }
      } catch (err) {
        setIsConnected(false);
      }
    }
    connect();
  }, [userQuery.isSuccess]);

  const sendMessage = async () => {
    setMessage("");
    setAllMessages((state) => [
      {
        content: message,
        senderId: userId,
        id: Math.random() + 1,
        receiverId: currentUser?.userId ?? "",
        createdAt: "",
        isRead: null,
        isReadTime: null,
      },
      ...(state ?? []),
    ]);
    try {
      if (connectionGlobal && message) {
        await connectionGlobal.invoke(
          "SendMessagePrivate",
          message,
          userId,
          currentUser?.userId
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (userQuery.isLoading) {
    return <h1>Loading</h1>;
  }
  return (
    <div className={styled.chat}>
      <LeftSideChats
        userId={userId}
        setCurrentUser={setCurrentUser}
        userData={userQuery.data?.data}
        currentUser={currentUser}
        setIsLastMessageRead={setIsLastMessageRead}
      />
      <ChatsRightSide
        message={message}
        sendMessage={sendMessage}
        allMessage={allMessage}
        userId={userId}
        currentUser={currentUser}
        setMessage={setMessage}
        messagesIsLoading={messagesQuery.isLoading}
        isLastMessageRead={isLastMessageRead}
        setIsLastMessageRead={setIsLastMessageRead}
      />
    </div>
  );
};
