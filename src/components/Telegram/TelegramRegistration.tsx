import { useEffect, useRef } from "react";

export const TelegramRegistration = () => {
  const telegramWrapperRef = useRef<HTMLDivElement>(null);
  const onTelegramAuth = (user: any) => {
    console.log(user);
    alert(
      "Logged in as " +
        user.first_name +
        " " +
        user.last_name +
        " (" +
        user.id +
        (user.username ? ", @" + user.username : "") +
        ")"
    );
  };
  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "";
    scriptElement.setAttribute("data-telegram-login", "");
    scriptElement.setAttribute("data-size", "large");
    scriptElement.setAttribute("data-onauth", "onTelegramAuth");
    scriptElement.setAttribute("data-request-access", "write");
    scriptElement.async = true;
    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(scriptElement);
    }
  }, []);

  return (
    <div>
      <div ref={telegramWrapperRef}></div>
    </div>
  );
};
