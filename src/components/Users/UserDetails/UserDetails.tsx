import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks/hooks";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { getUserById } from "../../../models/AppUserModels";
import styled from "./UserDetails.module.scss";
import { Button } from "@mui/material";
import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";

export const UserDetails = () => {
  const { id } = useParams();
  const { token } = useContext(tokenContext);

  const { userServices } = useService();
  const navigate = useNavigate();

  const userQuery = useQuery([QueryKeys.getUserById], () =>
    userServices.getUserById(id, token)
  );
  if (userQuery.isLoading) {
    <SkeletonLoading width={"100%"} />;
  }
  if (userQuery.isError) {
    <h1>Something went wrong</h1>;
  }
  return (
    <div className={styled.driverDetails}>
      <div className={styled.container}>
        <div className={styled.action}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
        <div className={styled.info}>
          <h1>Id: </h1>
          <p>{userQuery.data?.data.id}</p>
        </div>
        <div className={styled.info}>
          <h1>Full name: </h1>
          <p>{userQuery.data?.data.fullname}</p>
        </div>
        <div className={styled.info}>
          <h1>User name: </h1>
          <p>{userQuery.data?.data.userName}</p>
        </div>

        <div className={styled.info}>
          <h1>Last visit: </h1>
          <p>
            {userQuery.data?.data.lastVisit
              .substring(0, 10)
              .concat(" - ", userQuery.data?.data.lastVisit.substring(11, 16))}
          </p>
        </div>
        <div className={styled.info}>
          <h1>Email: </h1>
          <p>{userQuery.data?.data.email}</p>
        </div>
      </div>
    </div>
  );
};
