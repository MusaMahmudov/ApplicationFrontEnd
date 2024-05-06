import React from "react";
import {
  chatMessage,
  currentLastMessageModel,
} from "../../../../models/MessageModels";
import { UserInformationForChat } from "../../../../models/UserModels";
import styled from "./RightSide.module.scss";
import SendIcon from "@mui/icons-material/Send";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import dayjs from "dayjs";
export const ChatsRightSide: React.FC<{
  isLastMessageRead: currentLastMessageModel | null;
  setIsLastMessageRead: React.Dispatch<
    React.SetStateAction<currentLastMessageModel | null>
  >;
  currentUser: UserInformationForChat | null;
  allMessage: chatMessage[] | null;
  userId: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => Promise<void>;
  messagesIsLoading: boolean;
}> = ({
  setIsLastMessageRead,
  isLastMessageRead,
  messagesIsLoading,
  currentUser,
  allMessage,
  userId,
  message,
  setMessage,
  sendMessage,
}) => {
  {
    if ((messagesIsLoading || allMessage === null) && currentUser !== null) {
      return (
        <section className={styled.rightSide}>
          <h1>Is loading</h1>
        </section>
      );
    }
    return (
      currentUser && (
        <section className={styled.rightSide}>
          <div className={styled.container}>
            <section className={styled.header}>
              <div className={styled.userName}>
                <h1>{currentUser.userName}</h1>
              </div>
              {/* <div className={styled.lastVisit}>
                <p>
                  {currentUser.isOnline
                    ? "Online"
                    : `Last visit: ${currentUser.lastVisit}`}
                </p>
              </div> */}
            </section>
            <section className={styled.messages}>
              <div className={styled.box}>
                {allMessage?.map((message: chatMessage, index) => {
                  return (
                    <>
                      <section className={styled.isReadArea}>
                        {(message.senderId === userId &&
                          index === 0 &&
                          message.isRead) ||
                        (isLastMessageRead?.isRead && index === 0) ? (
                          <>
                            <h1>
                              {!isLastMessageRead?.isRead
                                ? dayjs(message.isReadTime).format(
                                    "DD-MM-YYYY/HH:mm"
                                  )
                                : dayjs(isLastMessageRead?.isReadTime).format(
                                    "DD-MM-YYYY/HH:mm"
                                  )}
                            </h1>
                            <RemoveRedEyeIcon />
                          </>
                        ) : (
                          ""
                        )}
                      </section>
                      <div
                        className={`${styled.message} ${
                          message.senderId === userId ? "sended" : "received"
                        }`}
                        key={message.id}
                      >
                        <p>{message.content}</p>
                      </div>
                    </>
                  );
                })}
              </div>
            </section>
            <section className={styled.inputArea}>
              <div className={styled.input}>
                <input
                  placeholder="Send message ..."
                  value={message}
                  onKeyDown={(e) => {
                    if (message && e.key === "Enter") {
                      setIsLastMessageRead(null);
                      sendMessage();
                    }
                  }}
                  onChange={(e) => setMessage(e.target.value)}
                ></input>
                <button onClick={sendMessage}>
                  <SendIcon />
                </button>
              </div>
            </section>
          </div>
        </section>
      )
    );
  }
};
