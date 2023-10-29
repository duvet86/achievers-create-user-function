import type { Connection, ResultSetHeader } from "mysql2/promise";
import type { UserForm, User, EoIProfile, Chapter, Reference } from "../models";

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

export async function createEOIUsersAsync(userForm: UserForm): Promise<number> {
  const connection = await getConnectionAsync();

  await connection.beginTransaction();

  const [chapters] = await connection.query<Chapter[]>("SELECT * FROM Chapter");

  const selectedChapter = userForm[
    "We operate out of the following locations, where would you prefer to mentor or volunteer?"
  ]
    .trim()
    .toLowerCase();

  const preferredChapter = chapters.find(
    (c) => c.name.trim().toLowerCase() === selectedChapter,
  );

  const dbUser: User = {
    azureADId: null,
    firstName: userForm["FIRST NAME:"],
    lastName: userForm["LAST NAME:"],
    mobile: userForm["MOBILE:"],
    email: userForm["EMAIL:"],
    addressState: userForm["ADDRESS - STATE:"],
    addressSuburb: userForm["ADDRESS - SUBURB:"],
    addressStreet: userForm["ADDRESS - STREET:"],
    addressPostcode: userForm["ADDRESS - POSTCODE:"],
    additionalEmail: null,
    chapterId: preferredChapter?.id ?? chapters[0].id,
    dateOfBirth: null,
    emergencyContactAddress: null,
    emergencyContactName: null,
    emergencyContactNumber: null,
    emergencyContactRelationship: null,
    endDate: null,
    profilePicturePath: null,
  };

  const [resultSetHeader] = await connection.query<ResultSetHeader>(
    `INSERT INTO user (
        azureADId,
        email,
        firstName,
        lastName,
        mobile,
        addressStreet,
        addressSuburb,
        addressState,
        addressPostcode,
        additionalEmail,
        dateOfBirth,
        emergencyContactName,
        emergencyContactNumber,
        emergencyContactAddress,
        emergencyContactRelationship,
        profilePicturePath,
        endDate,
        updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      dbUser.azureADId,
      dbUser.email,
      dbUser.firstName,
      dbUser.lastName,
      dbUser.mobile,
      dbUser.addressStreet,
      dbUser.addressSuburb,
      dbUser.addressState,
      dbUser.addressPostcode,
      dbUser.additionalEmail,
      dbUser.dateOfBirth,
      dbUser.emergencyContactName,
      dbUser.emergencyContactNumber,
      dbUser.emergencyContactAddress,
      dbUser.emergencyContactRelationship,
      dbUser.profilePicturePath,
      dbUser.endDate,
      new Date(),
    ],
  );

  const dbEoIProfile: EoIProfile = {
    bestTimeToContact: userForm["When is the best time to contact you?"],
    occupation: userForm["Current occupation:"],
    volunteerExperience:
      userForm["Relevant work/volunteer experience (if any):"],
    role: userForm["What role(s) would you be interested in?"].join(", "),
    mentoringLevel:
      userForm["What level(s) would you be comfortable mentoring at?"].join(
        ", ",
      ),
    heardAboutUs: userForm["Where did you hear about us?"].join(", "),
    preferredFrequency:
      userForm[
        "Our homework club runs from 10: 00 AM to 12: 00 PM every Saturday during school term-time. How often do you think you will be able to attend? "
      ].join(" - "),
    isOver18: userForm["I am over 18 years of age:"] === "Yes",
    comment: userForm["Why would you like to become a Mentor or Volunteer?"],
    aboutMe: userForm["TELL US ABOUT YOU:"] ?? null,
    userId: resultSetHeader.insertId,
  };

  await connection.query<ResultSetHeader>(
    `INSERT INTO eoiprofile (
        bestTimeToContact,
        occupation,
        volunteerExperience,
        role,
        mentoringLevel,
        heardAboutUs,
        preferredFrequency,
        isOver18,
        comment,
        aboutMe,
        userId,
        updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      dbEoIProfile.bestTimeToContact,
      dbEoIProfile.occupation,
      dbEoIProfile.volunteerExperience,
      dbEoIProfile.role,
      dbEoIProfile.mentoringLevel,
      dbEoIProfile.heardAboutUs,
      dbEoIProfile.preferredFrequency,
      dbEoIProfile.isOver18,
      dbEoIProfile.comment,
      dbEoIProfile.aboutMe,
      dbEoIProfile.userId,
      new Date(),
    ],
  );

  const dbReference1: Reference = {
    firstName: userForm["REFEREE 1 - First Name:"],
    lastName: userForm["REFEREE 1 - Surname:"],
    mobile: userForm["REFEREE 1 - Mobile:"],
    email: userForm["REFEREE 1 - Email:"],
    bestTimeToContact:
      userForm["REFEREE 1 - When is the best time to contact referee 1?"],
    relationship: userForm["REFEREE 1 - How they know you:"],
    generalComment: null,
    outcomeComment: null,
    hasKnowApplicantForAYear: null,
    isRelated: null,
    isMentorRecommended: null,
    calledBy: null,
    calledOndate: null,
    userId: resultSetHeader.insertId,
  };

  const dbReference2: Reference = {
    firstName: userForm["REFEREE 2 - First Name:"],
    lastName: userForm["REFEREE 2 - Surname:"],
    mobile: userForm["REFEREE 2 - Mobile:"],
    email: userForm["REFEREE 2 - Email:"],
    bestTimeToContact:
      userForm["REFEREE 2 - When is the best time to contact referee 2?"],
    relationship: userForm["REFEREE 2 - How they know you:"],
    generalComment: null,
    outcomeComment: null,
    hasKnowApplicantForAYear: null,
    isRelated: null,
    isMentorRecommended: null,
    calledBy: null,
    calledOndate: null,
    userId: resultSetHeader.insertId,
  };

  await connection.query<ResultSetHeader>(
    `INSERT INTO reference (
        firstName,
        lastName,
        mobile,
        email,
        bestTimeToContact,
        relationship,
        generalComment,
        outcomeComment,
        hasKnowApplicantForAYear,
        isRelated,
        isMentorRecommended,
        calledBy,
        calledOndate,
        userId,
        updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      dbReference1.firstName,
      dbReference1.lastName,
      dbReference1.mobile,
      dbReference1.email,
      dbReference1.bestTimeToContact,
      dbReference1.relationship,
      dbReference1.generalComment,
      dbReference1.outcomeComment,
      dbReference1.hasKnowApplicantForAYear,
      dbReference1.isRelated,
      dbReference1.isMentorRecommended,
      dbReference1.calledBy,
      dbReference1.calledOndate,
      dbReference1.userId,
      new Date(),
      // -----------
      dbReference2.firstName,
      dbReference2.lastName,
      dbReference2.mobile,
      dbReference2.email,
      dbReference2.bestTimeToContact,
      dbReference2.relationship,
      dbReference2.generalComment,
      dbReference2.outcomeComment,
      dbReference2.hasKnowApplicantForAYear,
      dbReference2.isRelated,
      dbReference2.isMentorRecommended,
      dbReference2.calledBy,
      dbReference2.calledOndate,
      dbReference2.userId,
      new Date(),
    ],
  );

  await connection.query<ResultSetHeader>(
    `INSERT INTO useratchapter (
      chapterId,
      userId,
      assignedAt,
      assignedBy)
      VALUES (?,?,?,?)`,
    [dbUser.chapterId, resultSetHeader.insertId, new Date(), "eoi-submission"],
  );

  await connection.commit();

  await connection.end();

  return resultSetHeader.insertId;
}
