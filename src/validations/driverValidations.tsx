import * as Yup from "yup";
export const driverCreateValidation = Yup.object().shape({
  width: Yup.number()
    .required("This field is required")
    .min(1, "Width's minumum value has to be 1"),
});
