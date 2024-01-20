import { verifyUserAccount } from "../../../assets/js/tools.js";

if (verifyUserAccount() == false) {
    window.location.href = '/';
}