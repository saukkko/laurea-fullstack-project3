import { Router } from "express";
import { sendApiResponse } from "./utils.js";
import { createUser, userLogin } from "./auth.js";
import { User, findUserByUsername, isValidObjectId } from "./mongo.js";

// Use router middleware from express and export it
export const router = Router();

// the "id" parameter route
router.param("id", (req, res, next, id, paramName) => {
  try {
    // Check parameter length
    if (String(id).length > 26) throw new Error("ID parameter too long");

    // if parameter is number, check it's value
    if (!isNaN(id) && (Number(id) < 0 || !isFinite(Number(id))))
      throw new Error("ID parameter value out of range");

    if (!isValidObjectId(id))
      throw new Error("ID parameter provided is not valid ObjectID");
    // If none of the above checks throw an error, go to next route
    next();
  } catch (err) {
    // If any errors are thrown, send info about the error
    sendApiResponse(res, 400, err.message, {
      param_name: paramName,
      param_value: id,
      param_length: id.length,
    });
  }
});

/**
 * Return all users in collection that matches the User -schema.
 */
router.get("/api/getall", (req, res) => {
  User.find()
    .all()
    .then((data) =>
      data.length > 0
        ? sendApiResponse(res, 200, "GET OK", data)
        : sendApiResponse(res, 404, "No results", data)
    );
});

/**
 * Returns single user queried by ID
 */
router.get("/api/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) =>
      user
        ? sendApiResponse(res, 200, "GET OK", user)
        : sendApiResponse(res, 404, "Not found", user)
    )
    .catch((err) => {
      sendApiResponse(
        res,
        500,
        "Something bad happened server side. Check server error logs for details.",
        err.message
      );
      console.error(err);
    });
});

/**
 * Adds new user
 */
router.post("/api/add", async (req, res) => {
  createUser(JSON.parse(req.body))
    .then((user) =>
      user
        ? sendApiResponse(res, 201, "POST OK", user)
        : sendApiResponse(res, 400, "Unkown error", null)
    )
    .catch((err) => {
      if (err) return sendApiResponse(res, 400, err.message, null);
    });
});

/**
 * Updates the user by given ID
 */
router.patch("/api/update/:id", (req, res) => {
  const { name } = JSON.parse(req.body);
  const updateQry = { name: name };

  User.findByIdAndUpdate(req.params.id, updateQry).then((user) => {
    user
      ? sendApiResponse(res, 200, "PATCH OK", {
          document: user,
          updated: updateQry,
        })
      : sendApiResponse(res, 404, "User not found", null);
  });
});

/**
 * Deletes the user by its id
 */
router.delete("/api/delete/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id).then((user) =>
    user
      ? sendApiResponse(res, 200, "DELETE OK", user)
      : sendApiResponse(res, 404, "Not found", user)
  );
});

/**
 * This route is just extra work that I did because I find authentication interesting.
 *
 * The route sends credentials provided by client to userLogin function, which further
 * checks if user has provided correct credentials. Returns the created user from
 * database if successful or an error response.
 */
router.post("/api/login", (req, res) => {
  // Parse request as username and plaintext password
  const { username, plaintext } = JSON.parse(req.body);

  // Try logging in with provided credentials
  userLogin(username, plaintext)
    .then(async (success) => {
      success
        ? // If login succeeded, send status 200 and print the user data from database.
          // In real world application we would construct some kind of session token
          // or set signed cookie to keep user logged in.
          sendApiResponse(
            res,
            200,
            "Login successfull",
            await findUserByUsername(username)
          )
        : // Otherwise most likely incorrect password was provided so respond with status 401
          sendApiResponse(res, 401, "Invalid username or password", null);
    })
    // This catch block usually fires when user does not exist, but also when some other error happens
    .catch((err) =>
      sendApiResponse(
        res,
        401,
        "Invalid username or password",
        err.message || null
      )
    );
});
