const fetch = require("node-fetch");
const Car = require("../models/carModel");

exports.getCar = async (req, res, next) => {
  const query = await Car.findById(req.params.id);

  if (!query) {
    return next();
  }

  return res.status(200).json({
    success: "Success",
    data: { query },
  });
};

exports.getAllCars = async (req, res) => {
  const data = await fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return res.status(200).json({
    success: "Success",
    data: { data },
  });
};

exports.createCar = async (req, res, next) => {
  console.log("req.body", req.body);
  const newCar = await Car.create(req.body);

  if (!newCar) {
    return next();
  }

  res.status(200).json({
    success: "success",
    data: {
      data: { newCar },
    },
  });
};
