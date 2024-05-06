import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import { useService } from "../../../hooks/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ChangeEvent,
  InputHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { QueryKeys } from "../../../API/QueryKeys";
import { changeDriverDimensions } from "../../../models/DriverModels";
import { tokenContext } from "../../../contexts/authContext";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../../Enums/Roles";

export const ChangeDriverLength = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : null;
  const { id } = useParams();
  const [isValid, setIsValid] = useState({
    length: true,
  });
  const [initialState, setInitialSate] = useState<changeDriverDimensions>({
    length: 0,
  });

  const { driverServices } = useService();
  const mutate = useMutation(
    () => driverServices.changeDriverLength(initialState, id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.getDriverForLengthChange, id]);
        navigate("/CargosDriver");
      },
    }
  );

  const driverQuery = useQuery([QueryKeys.getDriverForLengthChange, id], () =>
    driverServices.getDriverForLengthChange(id, token)
  );
  const handleUpdate = () => {
    if (initialState.length <= 0 || !initialState) {
      setIsValid((state) => ({
        ...state,
        length: false,
      }));
    } else {
      setIsValid((state) => ({
        ...state,
        length: true,
      }));
    }
    mutate.mutate();
  };

  useEffect(() => {
    setInitialSate(() => ({
      length: driverQuery.data?.data.length,
    }));
  }, [driverQuery.isSuccess]);
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if ("target" in event) {
      if ("name" in event.target && "value" in event.target) {
        let {
          target: { name, value },
        } = event;
        setInitialSate((state) => ({
          ...state,
          [name]: value,
        }));
      }
    }
  };
  if (role !== Roles.Driver) {
    return <h1>Error</h1>;
  }

  if (driverQuery.isLoading) {
    return <SkeletonLoading width={"100%"} />;
  }

  return (
    <div className="changeLocationDriver">
      <Box
        component="form"
        sx={{
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "400px",
        }}
      >
        <BackButton sx={{ width: "100px" }} />

        <TextField
          required
          label="Length"
          name="length"
          defaultValue={driverQuery.data?.data.length ?? 0}
          onChange={handleChange}
          type="number"
          size="small"
          error={!isValid.length}
          helperText={isValid.length ? "" : "Length has to be more than 0"}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleUpdate}
          disabled={mutate.isLoading ? true : false}
        >
          Change Length
        </Button>
        <div>{mutate.isLoading ? <CircularProgress /> : ""}</div>
      </Box>
    </div>
  );
};
