const connection = require('../database/config/connection');
const {
  getAllProductsQuery,
  createProductQuery,
} = require('../database/queries/queries');
const { createProductValidationSchema, CustomError } = require('../utils');

const getAllProducts = async (req, res) => {
  const products = await connection.query(getAllProductsQuery);

  res.status(200).json({
    status: 'success',
    products: products.rows,
  });
};

const createProduct = (
  { body: { name, description, petCategory, subCategory, price, image } },
  res,
  next,
) => {
  createProductValidationSchema
    .validateAsync(
      {
        name,
        description,
        petCategory,
        subCategory,
        price,
        image,
      },
      { abortEarly: false },
    )
    .then(() =>
      connection.query(createProductQuery, [
        name,
        description,
        petCategory,
        subCategory,
        price,
        image,
      ]),
    )
    .then((product) => {
      res.status(200).json({
        status: 200,
        message: 'Create Product Successfully 😉',
        data: product.rows[0],
      });
    })
    .catch((error) => {
      // Handle Error
      if (error.name === 'ValidationError') {
        const messages = error.details.map((e) => e.message);
        next(CustomError('Validation Error', 400, messages));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getAllProducts,
  createProduct,
};
