import { useMutation, useQuery } from "react-query";
import { useService } from "../../../hooks/hooks";
import { QueryKeys } from "../../../API/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import styled from "./DeleteDriver.module.scss";
import { getDriver } from "../../../models/DriverModels";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../../Enums/Roles";
export const DeleteDriver = () => {
  const navigate = useNavigate();
  const { driverServices } = useService();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : null;
  const { id } = useParams();
  const driverQuery = useQuery([QueryKeys.getDriverForDelete, id], () =>
    driverServices.getDriverById(id, token)
  );
  const mutate = useMutation(() => driverServices.deleteDriverById(id, token), {
    onSuccess: () => navigate("/Drivers"),
  });
  if (role !== Roles.Admin) {
    return <h1>Error</h1>;
  }

  if (driverQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }
  const driver: getDriver = driverQuery.data?.data;
  const handleDelete = () => {
    mutate.mutate();
  };

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
          <Button
            sx={{ marginLeft: 5 }}
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete Driver
          </Button>
          {mutate.isLoading ? <CircularProgress /> : ""}
        </div>
        <div className={styled.info}>
          <h1>Driver Id: </h1>
          <p>{driver?.driverId}</p>
        </div>
        <div className={styled.info}>
          <h1>Full name: </h1>
          <p>{driver?.appUser ? driver.appUser?.fullname : "No User"}</p>
        </div>
        <div className={styled.info}>
          <h1>User name: </h1>
          <p>{driver?.appUser ? driver.appUser?.userName : "No User"}</p>
        </div>

        <div className={styled.info}>
          <h1>Last visit: </h1>
          <p>
            {driver?.appUser
              ? driver.appUser?.lastVisit
                  .substring(0, 10)
                  .concat(" - ", driver.appUser?.lastVisit.substring(11, 16))
              : "No User"}
          </p>
        </div>
        <div className={styled.info}>
          <h1>Email: </h1>
          <p>{driver?.appUser ? driver.appUser.email : "No User"}</p>
        </div>
        <div className={styled.info}>
          <h1>Width: </h1>
          <p>{driver?.width}</p>
        </div>
        <div className={styled.info}>
          <h1>Height: </h1>
          <p>{driver?.height}</p>
        </div>
        <div className={styled.info}>
          <h1>Length:</h1>
          <p>{driver?.length}</p>
        </div>
      </div>
    </div>
  );
};
