import { Router } from "express";
import { User } from "./mongo.js";

export const router = Router();

router.param("id", (req, res, next) => {
  next();
});

router.get("/api/getall", (req, res) => {
  User.find()
    .all()
    .then((data) => res.json(data));
});

router.get("/api/:id", (req, res) => {
  User.findOne({ user_id: req.params.id }).then((data) => res.json(data));
});

router.post("/api/add", (req, res) => {
  checkValidHeaders(req, res);
  checkValidJson(req, res);

  const { name, user_id, dob } = JSON.parse(req.body);
  const user = new User({
    user_id: user_id,
    name: name,
    dob: dob,
  });

  user.save((err) => {
    err
      ? res.status(400).send({
          code: res.statusCode,
          status: "error",
          message: err.message,
        })
      : res.status(200).send({
          code: res.statusCode,
          status: "success",
          message: `User '${name}' saved successfully`,
        });
  });
});

router.patch("/api/update/:id", (req, res) => {
  User.findOneAndUpdate({ user_id: req.params.id }, { dob: Date.now() }).then(
    () =>
      res.status(200).send({
        code: res.statusCode,
        status: "success",
        message: "PATCH OK",
      })
  );
});

router.delete("/api/delete/:id", (req, res) => {
  User.findOneAndDelete({ user_id: req.params.id }).then((doc) =>
    res.status(200).send({
      code: res.statusCode,
      status: "success",
      message: "DELETE OK",
      _details: doc,
    })
  );
});

const checkValidHeaders = (req, res) => {
  if (!req.header("Content-Type").startsWith("application/json")) {
    res.status(400).send({
      code: res.statusCode,
      status: "error",
      message: "Invalid Content-Type",
    });

    return;
  }
};

const checkValidJson = (req, res) => {
  try {
    JSON.parse(req.body);
  } catch (err) {
    res.status(400).send({
      code: res.statusCode,
      status: "error",
      message: `${err.name}: ${err.message}`,
    });

    return;
  }
};
