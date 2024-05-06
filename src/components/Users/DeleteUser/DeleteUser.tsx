import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks/hooks";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { getUserById } from "../../../models/AppUserModels";
import styled from "./DeleteUser.module.scss";
import { Button, CircularProgress } from "@mui/material";
import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";

export const DeleteUser = () => {
  const navigate = useNavigate();
  const { userServices } = useService();
  const { token } = useContext(tokenContext);
  const { id } = useParams();
  const userQuery = useQuery([QueryKeys.getUserByIdForDelete], () =>
    userServices.getUserById(id, token)
  );
  const mutate = useMutation(() => userServices.deleteUser(id, token), {
    onSuccess: () => navigate("/Users"),
  });

  if (userQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }
  const handleDelete = () => {
    mutate.mutate();
  };

  return (
    <div className={styled.userDetails}>
      <div className={styled.container}>
        <div className={styled.action}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            sx={{ marginLeft: 5 }}
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={
              userQuery.data?.data.roles.filter(
                (role: string) => role === "Admin"
              ).length > 0
                ? true
                : false
            }
          >
            Delete User
          </Button>
          {mutate.isLoading ? <CircularProgress /> : ""}
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
          <p>{userQuery.data?.data.lastVisit}</p>
        </div>
        <div className={styled.info}>
          <h1>Email: </h1>
          <p>{userQuery.data?.data.email}</p>
        </div>
      </div>
    </div>
  );
};
