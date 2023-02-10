import { normalizePort } from "../scripts/normalizeport";

export default {
  jwtsecret: process.env.JWT_SECRET || "arEa-de-arquitectur4-4g1l3s0ft",
  mongodbURL: process.env.MONGODB_URL || "",
  port: normalizePort(process.env.PORT || "3000"),
};
