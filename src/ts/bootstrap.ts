declare const window: any;
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.withCredentials = true;

/**
 * Sweetalert provide beautiful simpler alert support
 */

import Swal from "@nathanaelytj/sweetalert2/dist/sweetalert2.all";
window.Swal = Swal;
