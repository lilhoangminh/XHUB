import { verifyUserAccount } from '../../assets/js/tools.js';

if (verifyUserAccount() == 0) {
    window.location.href = '/';
}