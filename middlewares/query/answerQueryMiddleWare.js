const expressAsynchError = require("express-async-handler");
const {
  populateHelper,
  paginationHelper,
} = require("./queryMiddleWareHelpers");
const answerQueryMiddleWare = function (model, options) {
  return expressAsynchError(async function (req, res, next) {
    const { id } = req.params;

    const arrayName = "answer";
    const total = (await model.findById(id))["answerCount"];

    const paginationResults = await paginationHelper(total, undefined, req);
    const startIndex = paginationResults.startIndex;
    const limit = paginationResults.limit;

    let queryObject = {};

    queryObject[arrayName] = { $slice: [startIndex, limit] };

    let query = model.find({ _id: id }, queryObject);

    query = populateHelper(query, options.population);
    queryResults = await query;

    res.queryResults = {
      success: true,
      pagination: paginationResults.pagination,
      data: queryResults,
    };

    next();
  });
};

module.exports = answerQueryMiddleWare;
