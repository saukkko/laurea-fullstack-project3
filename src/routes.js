import { Router } from "express";
import { User } from "./mongo.js";

export const router = Router();

router.param("id", (req, res, next, id) => {
  try {
    if (id.length > 20 || id.length < 1)
      throw new Error("invalid parameter length");

    User.findOne({ id: id }).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    next(err.message);
  }
});

router.get("/api/getall", (req, res) => {
  User.find()
    .all()
    .then((data) => res.json(data));
});

router.get("/api/:id", (req, res) => {
  const user = req.user;
  res.json(user);
});

router.post("/api/add", (req, res) => {
  checkValidHeaders(req, res);
  checkValidJson(req, res);

  const { name, id } = JSON.parse(req.body);
  const user = new User({
    id: id,
    name: name,
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
          message: "POST OK",
          _details: user,
        });
  });
});

router.patch("/api/update/:id", (req, res) => {
  checkValidHeaders(req, res);
  checkValidJson(req, res);

  const { name, id } = JSON.parse(req.body);
  const user = req.user;

  user.name = name;
  user.id = id;

  User.findOneAndUpdate({ id: req.params.id }, user).then((doc) =>
    res.status(200).send({
      code: res.statusCode,
      status: "success",
      message: "PATCH OK",
      _details: doc,
    })
  );
});

router.delete("/api/delete/:id", (req, res) => {
  User.findOneAndDelete({ id: req.params.id }).then((doc) =>
    res.status(200).send({
      code: res.statusCode,
      status: "success",
      message: "DELETE OK",
      _details: doc,
    })
  );
});

/////////////////////////////////////////////////////

const checkValidHeaders = (req, res) => {
  if (!req.header("Content-Type").startsWith("application/json")) {
    res.status(400).send({
      code: res.statusCode,
      status: "error",
      message: "Invalid Content-Type",
    });
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
  }
};
