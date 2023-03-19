import type { Connection, ResultSetHeader } from "mysql2/promise";
import type { UserEOIForm, UserForm } from "../models";

import { createConnection } from "mysql2/promise";
import invariant from "tiny-invariant";

invariant(process.env.DATABASE_HOST);
invariant(process.env.DATABASE_USER);
invariant(process.env.DATABASE_PASSWORD);
invariant(process.env.DATABASE_NAME);

// const serverCa = [
//   fs.readFileSync(
//     path.resolve(process.cwd(), "BaltimoreCyberTrustRoot.crt.pem"),
//     "utf8"
//   ),
// ];

async function getConnectionAsync(): Promise<Connection> {
  const connection = await createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    // ssl: {
    //   rejectUnauthorized: true,
    //   ca: serverCa,
    // },
  });

  return connection;
}

export async function createEOIUsersAsync(user: UserForm): Promise<number> {
  const connection = await getConnectionAsync();

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

  const [resultSetHeader] = await connection.query<ResultSetHeader>(
    `INSERT INTO UserEOIForm (
        firstName,
        lastName,
        mobile,
        email,
        address,
        bestTimeToContact,
        occupation,
        volunteerExperience,
        interestedInRole,
        mentoringLevel,
        hearAboutUs,
        mentorOrVolunteer,
        preferredLocation,
        preferredFrequency,
        isOver18,
        referee1FirstName,
        referee1Surname,
        referee1Mobile,
        referee1Email,
        referee1BestTimeToContact,
        referee1Relationship,
        referee2FirstName,
        referee2Surname,
        referee2Mobile,
        referee2Email,
        referee2BestTimeToContact,
        referee2Relationship)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      userEOIForm.firstName,
      userEOIForm.lastName,
      userEOIForm.mobile,
      userEOIForm.email,
      userEOIForm.address,
      userEOIForm.bestTimeToContact,
      userEOIForm.occupation,
      userEOIForm.volunteerExperience,
      userEOIForm.interestedInRole,
      userEOIForm.mentoringLevel,
      userEOIForm.hearAboutUs,
      userEOIForm.mentorOrVolunteer,
      userEOIForm.preferredLocation,
      userEOIForm.preferredFrequency,
      userEOIForm.isOver18,
      userEOIForm.referee1FirstName,
      userEOIForm.referee1Surname,
      userEOIForm.referee1Mobile,
      userEOIForm.referee1Email,
      userEOIForm.referee1BestTimeToContact,
      userEOIForm.referee1Relationship,
      userEOIForm.referee2FirstName,
      userEOIForm.referee2Surname,
      userEOIForm.referee2Mobile,
      userEOIForm.referee2Email,
      userEOIForm.referee2BestTimeToContact,
      userEOIForm.referee2Relationship,
    ]
  );

  await connection.end();

  return resultSetHeader.insertId;
}
