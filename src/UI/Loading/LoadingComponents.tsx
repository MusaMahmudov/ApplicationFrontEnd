import { Box, Skeleton } from "@mui/material";
import React from "react";

export const SkeletonLoading: React.FC<{
  width: number | string;
}> = (props) => {
  return (
    <Box sx={{ ...props }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );
};
