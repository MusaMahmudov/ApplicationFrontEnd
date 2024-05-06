import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const DetailsButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props} color="primary" variant="contained">
      Details
    </Button>
  );
};

export const UpdateButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button color="warning" {...props} variant="contained">
      Update
    </Button>
  );
};
export const BackButton: React.FC<ButtonProps> = (props) => {
  const navigate = useNavigate();
  return (
    <Button
      color="primary"
      {...props}
      variant="contained"
      onClick={() => navigate(-1)}
    >
      Back
    </Button>
  );
};

export const DeleteButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props} color="error" variant="contained">
      Delete
    </Button>
  );
};
