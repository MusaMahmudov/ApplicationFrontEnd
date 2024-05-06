import { Autocomplete, TextField } from "@mui/material";
import styled from "./LeftSide.module.scss";
import { getUsersForChat } from "../../../../models/AppUserModels";
import { SyntheticEvent, useState } from "react";
import { UserInformationForChat } from "../../../../models/UserModels";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import { currentLastMessageModel } from "../../../../models/MessageModels";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { QueryKeys } from "../../../../API/QueryKeys";
export const LeftSideChats: React.FC<{
  userId: string;
  userData: getUsersForChat[];
  currentUser: UserInformationForChat | null;
  setIsLastMessageRead: React.Dispatch<
    React.SetStateAction<currentLastMessageModel | null>
  >;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<UserInformationForChat | null>
  >;
}> = ({
  userId,
  setIsLastMessageRead,
  userData,
  setCurrentUser,
  currentUser,
}) => {
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  return (
    <section className={styled.leftSide}>
      <div className={styled.container}>
        <section className={styled.chats}>
          <div className={styled.search}>
            <Autocomplete
              id="user"
              disablePortal
              options={userData ?? []}
              getOptionLabel={(option: getUsersForChat) => option.userName}
              onChange={(
                event: SyntheticEvent,
                newValue: getUsersForChat | null
              ) => setSearch(newValue?.userName ?? "")}
              sx={{
                width: {
                  xs: 170,
                  sm: 200,
                  md: 230,
                  lg: 260,
                  xl: 300,
                },
                background: "white",
              }}
              size="small"
              renderInput={(params) => <TextField {...params} label="Search" />}
            />
          </div>
          <div className={styled.chatList}>
            {userData
              .filter((user: getUsersForChat) => {
                return search !== "" ? user.userName === search : true;
              })
              .map((user: getUsersForChat) => {
                return (
                  <div
                    className={styled.chatUser}
                    key={user.id}
                    onClick={() => {
                      if (
                        user.id !== currentUser?.userId ||
                        currentUser === null
                      )
                        setIsLastMessageRead(null);
                      setCurrentUser({
                        userId: user.id,
                        userName: user.userName,
                        lastVisit: dayjs(user.lastVisit).format("HH:MM"),
                        isOnline: user.isOnline,
                      });
                      queryClient.removeQueries([
                        QueryKeys.getMessagesForChat,
                        currentUser?.userId,
                        userId,
                      ]);
                    }}
                  >
                    <section className={styled.firstLine}>
                      <div className={styled.userName}>
                        <h1>{user.userName}</h1>
                      </div>
                      <div className={styled.lastMessageTime}></div>
                    </section>
                    <section className={styled.secondLine}>
                      <div className={styled.lastMessage}>
                        {user.lastMessage}
                      </div>
                    </section>
                    {user.lastMessage &&
                      !user.isReadLastMessage &&
                      user.senderId !== userId && (
                        <section className={styled.icon}>
                          <AnnouncementIcon />
                        </section>
                      )}
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </section>
  );
};
