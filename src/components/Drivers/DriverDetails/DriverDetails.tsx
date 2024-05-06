import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks/hooks";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { getDriver } from "../../../models/DriverModels";
import styled from "./DriverDetails.module.scss";
import { Button } from "@mui/material";
import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../../Enums/Roles";
export const DriverDetails = () => {
  const { id } = useParams();
  const { driverServices } = useService();
  const navigate = useNavigate();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : null;

  const { isLoading, isError, data } = useQuery(["GetDriver"], () =>
    driverServices.getDriverById(id, token)
  );
  if (role !== Roles.Admin) {
    return <h1>Error</h1>;
  }
  const driver: getDriver = data?.data;

  if (isLoading || driver === null) {
    <SkeletonLoading width={"100%"} />;
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
          <h1>Phone Number: </h1>
          <p>{driver?.phoneNumber}</p>
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
          <h1>Current Location: </h1>
          <p>
            {driver?.currentLocation ?? "No Info"} {driver?.zipcode}
          </p>
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
