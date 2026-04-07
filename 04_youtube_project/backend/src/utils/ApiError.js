// https://nodejs.org/api/errors.html
// https://claude.ai/chat/107c4c11-3eb8-4092-adcb-b4692656a2dc  - what is call stack or stack

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null; // find on internet // Optional, always return data: null
    // this.message = message; // "Error class" already have build-in error so , you don't need to overwrite "Error class" error message instead of use super(message) to use or inherit build-in error without overwriting. 
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError}