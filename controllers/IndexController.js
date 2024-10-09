const RequestService = require("../services/RequestService");
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
//   console.log(`HERE ${req}`)

  return res.render("home", { 
    title: "Welcome to Alixir's Melon Liqueurs",
    reqInfo: reqInfo,
    contributors: contributors,
    description: 'Indulge in the refreshing taste of our premium melon liqueurs, crafted with a delicate blend of smooth vodka and the natural sweetness of ripe honeydew. Each sip offers a perfectly balanced flavor, bringing the essence of summer to your glass. Whether enjoyed on its own, over ice, or as the star ingredient in your favorite cocktail, our melon liqueur delivers a fresh and vibrant twist to any occasion. Elevate your drinking experience with the crisp, sweet notes of honeydew and the refined smoothness of vodka'
 });
};