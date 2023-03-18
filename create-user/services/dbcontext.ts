import type { UserEOIForm, UserForm } from "../models";

// import fs from "fs";
// import path from "path";

import type { Connection, ConnectionConfig } from "mysql";

import { createConnection } from "mysql";
import invariant from "tiny-invariant";

invariant(process.env.DATABASE_HOST);
invariant(process.env.DATABASE_USER);
invariant(process.env.DATABASE_PASSWORD);
invariant(process.env.DATABASE_NAME);

const config: ConnectionConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
  // ssl: {
  //   ca: fs.readFileSync(
  //     path.resolve(process.cwd(), "BaltimoreCyberTrustRoot.crt.pem")
  //   ),
  // },
};

function getConnectionAsync(): Promise<Connection> {
  const conn = createConnection(config);

  return new Promise<Connection>((resolve, reject) => {
    conn.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log("Connection established.");
        resolve(conn);
      }
    });
  });
}

export async function createEOIUsersAsync(user: UserForm): Promise<number> {
  const connection = await getConnectionAsync();

  let userEOIId = -1;

  const userEOIForm: UserEOIForm = {
    firstName: user["FIRST NAME:"],
    lastName: user["LAST NAME:"],
    mobile: user["MOBILE:"],
    email: user["EMAIL:"],
    address:
      user["ADDRESS - STATE:"] +
      ", " +
      user["ADDRESS - SUBURB:"] +
      ", " +
      user["ADDRESS - STREET:"] +
      ", " +
      user["ADDRESS - POSTCODE:"],
    bestTimeToContact: user["When is the best time to contact you?"],
    occupation: user["Current occupation:"],
    volunteerExperience: user["Relevant work/volunteer experience (if any):"],
    interestedInRole:
      user["What role(s) would you be interested in?"].join(", "),
    mentoringLevel:
      user["What level(s) would you be comfortable mentoring at?"].join(", "),
    hearAboutUs: user["Where did you hear about us?"].join(", "),
    mentorOrVolunteer:
      user["Why would you like to become a Mentor or Volunteer?"],
    preferredLocation:
      user[
        "We operate out of two locations, where would you prefer to mentor or volunteer?"
      ],
    preferredFrequency:
      user[
        "Our homework club runs from 10:00 AM to 12:00 PM every Saturday during school term-time. How often do you think you will be able to attend? "
      ].join(", "),
    isOver18: user["I am over 18 years of age:"] === "Yes",
    referee1FirstName: user["REFEREE 1 - First Name:"],
    referee1Surname: user["REFEREE 1 - Surname:"],
    referee1Mobile: user["REFEREE 1 - Mobile:"],
    referee1Email: user["REFEREE 1 - Email:"],
    referee1BestTimeToContact:
      user["REFEREE 1 - When is the best time to contact referee 1?"],
    referee1Relationship: user["REFEREE 1 - How they know you:"],
    referee2FirstName: user["REFEREE 2 - First Name:"],
    referee2Surname: user["REFEREE 2 - Surname:"],
    referee2Mobile: user["REFEREE 2 - Mobile:"],
    referee2Email: user["REFEREE 2 - Email:"],
    referee2BestTimeToContact:
      user["REFEREE 2 - When is the best time to contact referee 2?"],
    referee2Relationship: user["REFEREE 2 - How they know you:"],
  };

  return new Promise<number>((resolve, reject) => {
    connection.query(
      "INSERT INTO UserEOIForm SET ?",
      userEOIForm,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          userEOIId = results.insertId;
        }
      }
    );

    connection.end((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(userEOIId);
      }
    });
  });
}
