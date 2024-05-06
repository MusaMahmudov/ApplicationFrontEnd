import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { DriversList } from "../components/Drivers/DriversList/DriversList";
import { DriverDetails } from "../components/Drivers/DriverDetails/DriverDetails";
import { CreateDriver } from "../components/Drivers/CreateDriver/CreateDriver";
import { UpdateDriver } from "../components/Drivers/UpdateDriver/UpdateDriver";
import { DeleteDriver } from "../components/Drivers/DeleteDriver/DeleteDriver";
import { UsersList } from "../components/Users/UsersList/UserList";
import { UserDetails } from "../components/Users/UserDetails/UserDetails";
import SignIn from "../components/SignIn/SignIn";
import { TokenContextProvider } from "../contexts/authContext";
import { CargoList } from "../components/Cargo/CargoList/CargoList";
import { ChangePassword } from "../components/ChangePassword/ChangePassword";
import { CreateUser } from "../components/Users/CreateUser/CreateUser";
import { DeleteUser } from "../components/Users/DeleteUser/DeleteUser";
import { UpdateUser } from "../components/Users/UpdateUser/UpdateUser";
import { CargoOffer } from "../components/Cargo/CargoOffer/CargoOffer";
import { OffersToCargo } from "../components/Offers/OffersToCargo/OffersToCargo";
import { OfferOfDriver } from "../components/Offers/OfferOfDriver/OfferOfDriver";
import { AllOffers } from "../components/Offers/AllOffers/AllOffers";
import { SendResponse } from "../components/Offers/SendResponse/SendResponse";
import { CargoListDriver } from "../components/Cargo/CargoListDriver/CargoListDriver";
import { ChangeDriverLocation } from "../components/Drivers/ChangeDriverLocation/ChangeDriverLocation";
import { Chats } from "../components/Chat/Chats/Chats";
import { ChangeDriverLength } from "../components/Drivers/ChangeDriverLength/ChangeDriverLength";
import { TelegramRegistration } from "../components/Telegram/TelegramRegistration";

export function MyRoutes() {
  return (
    <TokenContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="TelegramRegistration"
            element={<TelegramRegistration />}
          ></Route>
          <Route path="Drivers" element={<DriversList />}></Route>
          <Route path="Drivers/:id" element={<DriverDetails />} />
          <Route
            path="ChangeLocation/:id"
            element={<ChangeDriverLocation />}
          ></Route>
          <Route
            path="ChangeLength/:id"
            element={<ChangeDriverLength />}
          ></Route>
          <Route path="Drivers/CreateDriver" element={<CreateDriver />}></Route>
          <Route
            path="Drivers/UpdateDriver/:id"
            element={<UpdateDriver />}
          ></Route>
          <Route
            path="Drivers/DeleteDriver/:id"
            element={<DeleteDriver />}
          ></Route>
          <Route path="Chats" element={<Chats />}></Route>

          <Route path="Users" element={<UsersList />}></Route>
          <Route path="Users/:id" element={<UserDetails />}></Route>
          <Route path="Users/CreateUser" element={<CreateUser />}></Route>
          <Route path="Users/DeleteUser/:id" element={<DeleteUser />}></Route>
          <Route path="Users/UpdateUser/:id" element={<UpdateUser />}></Route>
          <Route path="/Cargos" element={<CargoList />}></Route>
          <Route path="/CargosDriver" element={<CargoListDriver />}></Route>
          <Route
            path="/CargosDriver/PostOffer/:id"
            element={<CargoOffer />}
          ></Route>

          <Route path="/Cargos/Offers/:Id" element={<OffersToCargo />}></Route>
          <Route path="/ChangePassword" element={<ChangePassword />}></Route>
          <Route path="MyOffers" element={<OfferOfDriver />}></Route>
          <Route path="AllOffers" element={<AllOffers />}></Route>
          <Route path="ResponseToOffer/:Id" element={<SendResponse />}></Route>
        </Route>
        <Route path="/SignIn" element={<SignIn />}></Route>
      </Routes>
    </TokenContextProvider>
  );
}
