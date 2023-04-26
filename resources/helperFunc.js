const { promises: fs } = require("fs");
const fshare = require("fs");
const { Comments, Complements } = require("./processData");
const getStream = require("get-stream");
const { parse } = require("csv-parse");

require("dotenv").config();

const { sendEmail } = require("../src/nodemailer");

const findFileName = async () => {
  try {
    const [names] = await fs.readdir("../data");
    return names;
  } catch (error) {
    console.log(error);
  }
};

const createStudent = (students) => {
  console.log(students);
  const new_students = students.map(
    ([name, email, grade, additional, coreC]) => {
      let comment1 = null;
      let comment2 = [];
      if (grade) {
        console.log(typeof Comments, Comments[`${grade}`], " comments ");
        comment1 =
          Comments[`${grade}`][
            Math.floor(Math.random() * Comments[`${grade}`].length)
          ];
      }
      if (additional.length > 2) {
        additional.split(" ").forEach((Complement) => {
          if (Complement.length > 0) {
            comment2.push(
              `${
                Complements[`${Complement}`][
                  Math.floor(
                    Math.random() * Complements[`${Complement}`].length
                  )
                ]
              }`
            );
          }
        });
      }

      return {
        name,
        email,
        grade,
        additional,
        coreC,
        comment1,
        comment2: comment2.join(" "),
      };
    }
  );
  return new_students;
};
const readStudents = async (filename) => {
  const students = await getStream.array(
    fshare
      .createReadStream(`../data/${filename}`)
      .pipe(parse({ delimiter: ",", form: 1 }))
  );

  return createStudent(students);
};

const send_Students_Email = (students, filename) => {
  students.map((student) => {
    sendEmail(student, filename);
  });
};

async function start() {
  const filename = await findFileName();
  const students = await readStudents(filename);
  send_Students_Email(students, filename);
}

module.exports = { start };
//start();
