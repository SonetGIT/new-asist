import { route } from "navi";
import React from "react";

import { withKeycloak } from "../lib";

const LoginPage = withKeycloak(({ keycloak }) => {
  return <div>{keycloak.login()}</div>;
});
export default route({
  title: "Login",
  view: <LoginPage />,
});
