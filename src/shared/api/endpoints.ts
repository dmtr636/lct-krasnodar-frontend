import { url } from "src/shared/helpers/url";

export const ME_ENDPOINT = url("/api/account/me");
export const LOGIN_ENDPOINT = url("/api/auth/login");
export const LOGOUT_ENDPOINT = url("/api/auth/logout");
export const USERS_ENDPOINT = url("/api/users");
export const PROGRAMS_ENDPOINT = url("/api/programs");
export const COURSES_ENDPOINT = url("/api/courses");
export const USER_COURSES_ENDPOINT = url("/api/userCourses");
export const FILES_ENDPOINT = url("/api/files");
export const TESTS_ENDPOINT = url("/api/tests");
export const AUDIT_ENDPOINT = url("/api/audit");
export const MAILING_ENDPOINT = url("/api/mailings");
export const MESSAGES_ENDPOINT = url("/api/messages");
export const NOTIFICATIONS_ENDPOINT = url("/api/notifications");

export const SEND_CODE = url("/api/password/send-cod");
export const CHECK_CODE = url("/api/password/check-code");
export const CHANGE_PASSWORD = url("/api/password/change");
