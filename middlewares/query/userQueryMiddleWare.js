const expressAsynchError = require("express-async-handler");
const { searchHelper, paginationHelper } = require("./queryMiddleWareHelpers");

const userQueryMiddleWare = function (model, options) {
  return expressAsynchError(async function (req, res, next) {
    let query = model.find();
    query = searchHelper("name", query, req);

    const total = await model.countDocuments();
    const paginationResult = await paginationHelper(total, query, req);
    query = paginationResult.query;
    const pagination = paginationResult.pagination;

    const queryResults = await query;
    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: pagination,
      data: queryResults,
    };
    next();
  });
};

module.exports = userQueryMiddleWare;
