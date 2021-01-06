const expressAsynchError = require("express-async-handler");
const {
  searchHelper,
  populateHelper,
  questionSortHelper,
  paginationHelper,
} = require("./queryMiddleWareHelpers");
const aksQuestionQueryMiddleWare = function (model, options) {
  return expressAsynchError(async function (req, res, next) {
    //initial query
    let query = model.find();

    //search
    query = searchHelper("cat", query, req);
    // if (options && options.population) {
    //   query = populateHelper(query, options.population);
    // }
    query = questionSortHelper(query, req);
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

module.exports = aksQuestionQueryMiddleWare;
