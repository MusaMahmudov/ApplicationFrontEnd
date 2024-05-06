import MenuIcon from "@mui/icons-material/Menu";
import styled from "./Navbar.module.scss";
import { Box, Button, Drawer, Popover } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useContext, useEffect, useState } from "react";
import { tokenContext } from "../../contexts/authContext";
import LogoImage from "../../assets/images/logo.jpeg";
import { jwtDecode } from "jwt-decode";
import {
  DecodedToken,
  tokenIdProperty,
  tokenRoleProperty,
  tokenUserNameProperty,
} from "../../models/TokenModels";
import { UserInformationForNavbar } from "../../models/UserModels";
import { Roles } from "../../Enums/Roles";
export const Navbar = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken>();
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState(
    location.pathname.substring(location.pathname.indexOf("/") + 1)
  );
  const { token, setToken } = useContext(tokenContext);
  const [user, setUser] = useState<UserInformationForNavbar>({
    userName: "",
    role: "",
  });
  useEffect(() => {
    setPathname(
      location.pathname.substring(location.pathname.indexOf("/") + 1)
    );
  }, [location]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  useEffect(() => {
    if (token) {
      setDecodedToken(jwtDecode(token));
    }
  }, []);

  useEffect(() => {
    let roles: string, userName: string;

    if (typeof decodedToken !== "undefined") {
      userName = decodedToken[tokenUserNameProperty];

      if (!Array.isArray(decodedToken[tokenRoleProperty])) {
        roles = decodedToken[tokenRoleProperty];
        setUser({
          role: roles,
          userName: userName,
        });
      }
    }
  }, [decodedToken]);
  const handleDrawerOpen = () => {
    setDrawerOpen(!isDrawerOpen);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.PointerEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    navigate("/SignIn");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <header className={styled.navbar}>
      <div className={styled.container}>
        {window.innerWidth > 700 && (
          <section className={styled.leftNavbar}>
            <div className={styled.image}>
              <img src={LogoImage} />
            </div>
          </section>
        )}

        <section className={styled.rightNavbar}>
          {window.innerWidth > 590 ? (
            <div className={styled.navigation}>
              {Roles.Admin === user.role && (
                <button
                  onClick={() => navigate("/Drivers")}
                  className={`${
                    pathname === "Drivers" ? styled.isActive : ""
                  } `}
                >
                  Drivers
                </button>
              )}
              {Roles.Admin === user.role && (
                <button
                  onClick={() => navigate("/Users")}
                  className={`${pathname === "Users" ? styled.isActive : ""} `}
                >
                  Users
                </button>
              )}
              {Roles.Driver === user.role && (
                <button
                  className={`${
                    pathname.includes("ChangeLocation") ? styled.isActive : ""
                  } `}
                  onClick={() =>
                    navigate(
                      `/ChangeLocation/${
                        decodedToken ? decodedToken[tokenIdProperty] : ""
                      }`
                    )
                  }
                >
                  Change Location
                </button>
              )}
              {Roles.Driver === user.role && (
                <button
                  className={`${
                    pathname.includes("ChangeLength") ? styled.isActive : ""
                  } `}
                  onClick={() =>
                    navigate(
                      `/ChangeLength/${
                        decodedToken ? decodedToken[tokenIdProperty] : ""
                      }`
                    )
                  }
                >
                  Change Length
                </button>
              )}
              <button
                className={`${
                  pathname === "Cargos" || pathname === "CargosDriver"
                    ? styled.isActive
                    : ""
                } `}
                onClick={() =>
                  user.role === "Admin"
                    ? navigate("/Cargos")
                    : navigate("/CargosDriver")
                }
              >
                Cargos
              </button>
              <button
                style={{ display: `${user.role !== "Driver" ? "none" : ""}` }}
                onClick={() => navigate("/MyOffers")}
                className={`${pathname === "MyOffers" ? styled.isActive : ""} `}
              >
                My Offers
              </button>
              <button
                style={{ display: `${user.role !== "Admin" ? "none" : ""}` }}
                onClick={() => navigate("/AllOffers")}
                className={`${
                  pathname === "AllOffers" ? styled.isActive : ""
                } `}
              >
                All Offers
              </button>
              <button
                onClick={() => navigate("/Chats")}
                className={`${pathname === "Chats" ? styled.isActive : ""} `}
              >
                Chats
              </button>
            </div>
          ) : (
            <section className={styled.responsiveSection}>
              <Button className="toggleButton" onClick={handleDrawerOpen}>
                <MenuIcon />
              </Button>
              <Drawer
                anchor="left"
                onClose={handleDrawerOpen}
                open={isDrawerOpen}
              >
                <div className={styled.responsiveSectionNavigation}>
                  {Roles.Admin === user.role && (
                    <button
                      onClick={() => navigate("/Drivers")}
                      style={{
                        background: `${
                          pathname.includes("Drivers") ? "#1976d2" : ""
                        }`,
                        color: pathname.includes("Drivers") ? "#white" : "",
                      }}
                    >
                      Drivers
                    </button>
                  )}
                  {Roles.Admin === user.role && (
                    <button
                      onClick={() => navigate("/Users")}
                      style={{
                        background: `${
                          pathname.includes("Users") ? "#1976d2" : ""
                        }`,
                        color: pathname.includes("Users") ? "#white" : "",
                      }}
                    >
                      Users
                    </button>
                  )}
                  {Roles.Driver === user.role && (
                    <button
                      style={{
                        background: `${
                          pathname.includes("ChangeLocation") ? "#1976d2" : ""
                        }`,
                        color: pathname.includes("ChangeLocation")
                          ? "#white"
                          : "",
                      }}
                      onClick={() =>
                        navigate(
                          `/ChangeLocation/${
                            decodedToken ? decodedToken[tokenIdProperty] : ""
                          }`
                        )
                      }
                    >
                      Change Location
                    </button>
                  )}
                  {Roles.Driver === user.role && (
                    <button
                      style={{
                        background: `${
                          pathname.includes("Drivers") ? "#1976d2" : ""
                        }`,
                        color: pathname.includes("Drivers") ? "#white" : "",
                      }}
                      onClick={() =>
                        navigate(
                          `/ChangeLength/${
                            decodedToken ? decodedToken[tokenIdProperty] : ""
                          }`
                        )
                      }
                    >
                      Change Length
                    </button>
                  )}
                  <button
                    style={{
                      background: `${
                        pathname.includes("Cargos") ||
                        pathname.includes("/CargosDriver")
                          ? "#1976d2"
                          : ""
                      }`,
                      color:
                        pathname.includes("Cargos") ||
                        pathname.includes("/CargosDriver")
                          ? "#white"
                          : "",
                    }}
                    onClick={() =>
                      user.role === "Admin"
                        ? navigate("/Cargos")
                        : navigate("/CargosDriver")
                    }
                  >
                    Cargos
                  </button>
                  <button
                    style={{
                      display: `${user.role !== "Driver" ? "none" : ""}`,
                    }}
                    onClick={() => navigate("/MyOffers")}
                    className={`${
                      pathname === "MyOffers" ? styled.isActiveResponsive : ""
                    } `}
                  >
                    My Offers
                  </button>
                  <button
                    onClick={() => navigate("/AllOffers")}
                    className={`${
                      pathname === "AllOffers" ? styled.isActiveResponsive : ""
                    } `}
                    style={{
                      display: `${user.role !== "Admin" ? "none" : ""}`,

                      background: `${
                        pathname.includes("AllOffers") ? "#1976d2" : ""
                      }`,
                      color: pathname.includes("AllOffers") ? "#white" : "",
                    }}
                  >
                    All Offers
                  </button>
                  <button
                    onClick={() => navigate("/Chats")}
                    style={{
                      background: `${
                        pathname.includes("Chats") ? "#1976d2" : ""
                      }`,
                      color: pathname.includes("Chats") ? "#white" : "",
                    }}
                  >
                    Chats
                  </button>
                </div>
              </Drawer>
            </section>
          )}

          <div className={styled.profile}>
            <Button
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                padding: "10px 20px",
              }}
              variant="contained"
              onClick={handleClick}
            >
              <span className="user-icon">
                <SupervisorAccountIcon sx={{ fontSize: 40, marginTop: 1 }} />
              </span>
              <span>
                <h1>
                  {
                    decodedToken?.[
                      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ]
                  }
                </h1>
                <p>
                  {
                    decodedToken?.[
                      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ]
                  }
                </p>
              </span>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  zIndex: "9999",
                }}
              >
                <Button
                  sx={{ padding: "10px 10px", fontSize: "13px" }}
                  onClick={() => navigate("ChangePassword")}
                >
                  Change Password
                </Button>
                <Button
                  sx={{ padding: "10px 30px" }}
                  onClick={() => handleLogout()}
                >
                  Logout
                </Button>
              </Box>
            </Popover>
          </div>
        </section>
      </div>
    </header>
  );
};
