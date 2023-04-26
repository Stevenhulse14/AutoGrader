const nodemailer = require("nodemailer");
require("dotenv").config();
const { SERVICE, EMAIL, PASSWORD, INSTRUCTOR } = process.env;
console.log(SERVICE, EMAIL, PASSWORD, INSTRUCTOR);

const emailGrade = {
  G: "GOOD",
  P: "NEEDS IMPROVEMENT",
  AVG: "AVERAGE",
  NOSUB: "NO SUBMISSION",
};

function sendEmail(student, filename) {
  const { name, email, grade, coreC, comment1, comment2 } = student;

  //console.log("student info", name, email);
  const transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });
  const options = {
    from: EMAIL,
    to: email.replace(/\s+/g, ""),
    subject: `From ${INSTRUCTOR} Subject:${filename.split(".")[0]}`,
    text: `Project Name: ${filename.split(".")[0]}   Grade: ${
      emailGrade[`${grade}`]
    }
     
           Student : ${name}

           Comments: 
            - ${comment1}
            - ${coreC}
            - ${comment2 ? comment2 : "N/A"}

    `,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Response Info: ", info.response);
  });
}

module.exports = { sendEmail: sendEmail };
