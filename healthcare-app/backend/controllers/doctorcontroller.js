const Doctor = require("../models/Doctor");
const genAI = require("../config/googleAI");

exports.searchDoctors = async (req, res) => {
  const { specialist } = req.query;

  const doctors = await Doctor.find({
    specialist,
    active: true
  });

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
  From the following doctors, return the best 3 based on rating:
  ${JSON.stringify(doctors)}
  `;

  const result = await model.generateContent(prompt);

  res.json({
    doctors,
    topDoctors: result.response.text()
  });
};
