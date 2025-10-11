// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
// for response , we don't extends Error class because response usually received from Express.
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
