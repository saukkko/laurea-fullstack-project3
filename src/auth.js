import { scrypt, randomBytes } from "crypto";
import { User } from "./mongo.js";

/**
 * Default options to pass to scrypt(), if none are provided as parameters.
 * Generally these should be as high as the server system can handle in reasonably
 * small time frame when it's under heavy load.
 *
 * 4096:8:8 should give fair amount of security when salt length is at least 16 bytes.
 *
 * @type {Opts}
 */
export const defaultOpts = {
  keyLen: 32,
  saltLen: 32,
  scryptOpts: {
    N: 4096,
    r: 8,
    p: 8,
  },
};

/**
 * Encrypt the provided plaintext password using scrypt key derivation function.
 * Salt can be provided as parameter or let this function generate it
 *
 * @param {string} plaintext
 * @param {Opts} opts
 * @param {Buffer?} salt
 * @returns {Promise<EncryptedData>} Encrypted data object
 */
const encryptPassword = async (plaintext, opts, salt) => {
  // If salt from parameter is nullish, generate random bytes as salt
  salt = salt ?? randomBytes(opts.saltLen || 32);
  return new Promise((resolve, reject) => {
    // Call the KDF with plaintext, salt and provided options
    scrypt(
      Buffer.from(plaintext),
      salt,
      opts.keyLen,
      opts.scryptOpts,
      (err, derivedKey) => {
        // If errors are found, reject the promise.
        if (err) {
          console.error(err);
          return reject(err.message);
        }
        // scrypt completed and we should have a unique key derived from salt and plaintext
        resolve({
          salt: salt,
          derivedKey: derivedKey,
          scryptOpts: opts.scryptOpts,
        });
      }
    );
  });
};

/**
 * create the user
 * @param {any} userData
 * @param {Opts?} opts
 * @returns {Promise<User>}
 */
export const createUser = async (userData, opts) => {
  // Destruct the payload
  const { name, username, plaintext } = userData;

  return new Promise((resolve, reject) => {
    // Reject the promise early if required fields are missing
    if (!username || !plaintext)
      return reject(new Error("Required field missing from payload"));

    encryptPassword(plaintext, opts || defaultOpts)
      .then((data) => {
        // Destruct variables from the data
        const { salt, derivedKey, scryptOpts } = data;
        const { N, r, p } = scryptOpts;

        // Construct the encoded password string
        const encodedPassword = [
          "SCRYPT",
          N,
          r,
          p,
          salt.toString("base64"),
          derivedKey.toString("base64"),
        ].join(":");

        // Create new instance of the Mongoose document model
        const user = new User({
          name: name,
          username: username,
          encodedPassword: encodedPassword,
        });

        // save the data to mongodb
        user.save((err) => {
          err ? reject(err) : resolve(user);
        });
      })
      .catch(reject);
  });
};

/**
 * Validates the user password by re-hashing the `plaintext` and
 * comparing the derived key with derived key from `encodedPassword`
 *
 * @param {string} plaintext provided plaintext password (challenge)
 * @param {string} encodedPassword base64 encoded password string
 * @returns {Promise<boolean>} `true` if derived key from plaintext matches key from `encodedPassword`
 */
const validatePassword = async (plaintext, encodedPassword) => {
  // Split the encoded string (Format: 'SCRYPT:N:r:p:base64_salt:base64_hash') with colon as separator
  const pw = encodedPassword.split(":");

  // Parse the encoded string parts
  const [kdf, N, r, p] = [pw[0], Number(pw[1]), Number(pw[2]), Number(pw[3])];
  const [salt, encrypted] = [
    Buffer.from(pw[4], "base64"),
    Buffer.from(pw[5], "base64"),
  ];

  return new Promise((resolve, reject) => {
    if (kdf !== "SCRYPT") return reject("Invalid key derivation function.");
    // Derive the key using provided plaintext as challenge and the actual users'
    // salt and parameters
    encryptPassword(
      Buffer.from(plaintext),
      {
        keyLen: encrypted.length, // target key length is the encrypted key length
        saltLen: null, // salt is already provided
        scryptOpts: { N: N, r: r, p: p }, // the scrypt options to pass for scrypt (N: cost, r: blocksize, p: parallelization)
      },
      salt
    )
      // If the derived key equals the actual stored key, then provided plaintext
      // must be correct and user has authenticated.
      .then((data) => resolve(data.derivedKey.equals(encrypted)))
      .catch(reject);
  });
};

/**
 * Function that does the following:
 * 1. Searches the database for `username`
 * 2. Fetches the users' `encodedPassword` from database
 * 3. Calls `validatePassword` with parameters `plaintext` and `encodedPassword`
 * 4. Returns `true` if successful, or `false` if validation fails
 *
 * @param {string} username
 * @param {string} plaintext
 * @returns {Promise<boolean>}
 */
export const userLogin = async (username, plaintext) => {
  return new Promise((resolve, reject) => {
    // Search for the user
    User.findOne({ username: username })
      .catch(reject)
      .then((user) => {
        // If findOne completes but returns no user, then user does not exist.
        if (!user) return reject("Invalid username or password"); // NOTE: Don't specify the exact reason. Be more generic with error message

        // Call the validate function
        validatePassword(plaintext, user.encodedPassword)
          .catch(reject)

          // We can give this resolve as parameter directly, because this function returns promise of same type as validatePassword
          .then(resolve);
      });
  });
};

/**
 * @typedef {Object} Opts
 * @property {number} keyLen
 * @property {number} saltLen
 * @property {import("crypto").ScryptOptions} scryptOpts
 */

/**
 * @typedef {Object} EncryptedData
 * @property {Buffer} salt
 * @property {Buffer} derivedKey
 * @property {import("crypto").ScryptOptions} scryptOpts
 */
