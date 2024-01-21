import { verifyUserAccount } from "../../../assets/js/tools.js";

if (verifyUserAccount()) {
    console.log("ok user uy tin");
} else window.location.href = '/';