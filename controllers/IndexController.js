const RequestService = require("../services/RequestService");
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
//   console.log(`HERE ${req}`)

  return res.render("home", { 
    title: "Express-Billing",
    reqInfo: reqInfo,
    contributors: contributors,
 });
};