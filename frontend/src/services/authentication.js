export class Authentication {
  static setAuthData(userid, role) {
    localStorage.setItem("userId", userid);
    localStorage.setItem("role", role);
  }

  static setToken(token) {
    localStorage.setItem("token", token);
  }

  static get bearerToken() {
    return "Bearer " + localStorage.getItem("token");
  }

  static get token() {
    return localStorage.getItem("token");
  }

  static get userId() {
    return localStorage.getItem("userId");
  }

  static get role() {
    return localStorage.getItem("role");
  }

  static isUserLoggedIn() {
    return this.token && this.userId && this.role;
  }

  static isUserLoggedIntoAdminMode() {
    return this.token && this.userId && this.role === "Admin";
  }

  static isUserLoggedIntoPatientMode() {
    return this.token && this.userId && this.role === "Patient";
  }

  static logout() {
    localStorage.clear();
  }
}
