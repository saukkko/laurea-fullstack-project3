/**
 * Helper function to send consistently formatted response
 *
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {string} title
 * @param {string} message
 * @param {any} data
 */
export const sendApiResponse = (res, statusCode, message, data) => {
  let title = "unknown";
  if (statusCode >= 200 && statusCode <= 299) title = "success";
  if (statusCode >= 300 && statusCode <= 399) title = "redirect";
  if (statusCode >= 400 && statusCode <= 599) title = "error";

  res.status(statusCode).json({
    code: res.statusCode,
    title: title,
    message: message,
    data: data,
  });
};

/**
 * Middleware function to pass into main express app. This parses the Headers and
 * enforces content-type to application/json
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const validateHeaders = (req, res, next) => {
  // If Content-Type does not start with application/json...
  if (
    req.header("Content-Type") &&
    !req.header("Content-Type").startsWith("application/json")
  ) {
    // Return the error as reponse to client
    return sendApiResponse(res, 400, "Invalid Content-Type header", null);
  }
  // Otherwise go to next function
  next();
};

/**
 * Middleware function to pass into main express app. This function parses request
 * body when body is empty and the method is NOT GET, OPTIONS or DELETE
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const validateJSON = (req, res, next) => {
  // If req.body is empty and method is GET, OPTIONS or DELETE, skip JSON validation
  if (
    (req.method === "GET" ||
      req.method === "OPTIONS" ||
      req.method === "DELETE") &&
    Object.keys(req.body).length === 0
  )
    return next();
  try {
    // Try parsing req.body and if no error is thrown, go to next function
    JSON.parse(req.body);
    next();
  } catch (err) {
    // Return the error as reponse to client
    sendApiResponse(res, 400, "Invalid JSON", `${err.name}: ${err.message}`);
  }
};

export const toBase64Url = (inputString) =>
  Buffer.from(inputString).toString("base64url");
export const fromBase64Url = (inputString) =>
  Buffer.from(inputString, "base64url").toString("utf8");
