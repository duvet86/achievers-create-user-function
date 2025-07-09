import type { ResultSetHeader } from "mysql2/promise";
import type {
  UserForm,
  DBUser,
  DBEoIProfile,
  DBChapter,
  DBReference,
} from "../../models";

import { getConnectionAsync } from "../dbContext";

export async function createEOIMentorAsync(
  userForm: UserForm,
): Promise<number> {
  const connection = await getConnectionAsync();

  await connection.beginTransaction();

  const [chapters] = await connection.query<DBChapter[]>(
    "SELECT * FROM Chapter",
  );

  const selectedChapter = userForm[
    "We operate out of the following locations, where would you prefer to mentor or volunteer?"
  ]
    .trim()
    .toLowerCase();

  const preferredChapter = chapters.find(
    (c) => c.name.trim().toLowerCase() === selectedChapter,
  );

  const frequency =
    userForm[
      "Our homework club runs from 10:00 AM to 12:00 PM every Saturday during school term-time. How often are you able to attend? "
    ].join(" ");

  let frequencyInDays = null;
  if (frequency.includes("Fortnightly")) {
    frequencyInDays = 14;
  } else if (frequency.includes("Weekly")) {
    frequencyInDays = 7;
  }

  const dbUser: DBUser = {
    azureADId: null,
    firstName: userForm["FIRST NAME:"],
    lastName: userForm["LAST NAME:"],
    preferredName:
      !userForm["PREFERRED NAME (if different):"] ||
      userForm["PREFERRED NAME (if different):"].trim() === ""
        ? null
        : userForm["PREFERRED NAME (if different):"].trim(),
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
    frequencyInDays,
  };

  const [resultSetHeader] = await connection.query<ResultSetHeader>(
    `INSERT INTO mentor (
        azureADId,
        email,
        firstName,
        lastName,
        preferredName,
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
        frequencyInDays,
        updatedAt,
        chapterId)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      dbUser.azureADId,
      dbUser.email,
      dbUser.firstName,
      dbUser.lastName,
      dbUser.preferredName,
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
      dbUser.frequencyInDays,
      new Date(),
      dbUser.chapterId,
    ],
  );

  const dbEoIProfile: DBEoIProfile = {
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
        "Our homework club runs from 10:00 AM to 12:00 PM every Saturday during school term-time. How often are you able to attend? "
      ].join(" - "),
    preferredSubject:
      userForm[
        "If you have indicated that you are comfortable mentoring a student at year 10 or above, what subjects are you most comfortable concentrating on?"
      ].join(", "),
    isOver18: userForm["I am over 18 years of age:"] === "Yes",
    comment: userForm["Why would you like to become a Mentor or Volunteer?"],
    aboutMe: userForm["TELL US ABOUT YOU:"] ?? null,
    linkedInProfile:
      userForm["LinkedIn profile link (if you have one):"] ?? null,
    wasMentor: userForm["Have you volunteered with us before? If so, when?"],
    mentorId: resultSetHeader.insertId,
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
        preferredSubject,
        isOver18,
        comment,
        aboutMe,
        linkedInProfile,
        wasMentor,
        mentorId,
        updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      dbEoIProfile.bestTimeToContact,
      dbEoIProfile.occupation,
      dbEoIProfile.volunteerExperience,
      dbEoIProfile.role,
      dbEoIProfile.mentoringLevel,
      dbEoIProfile.heardAboutUs,
      dbEoIProfile.preferredFrequency,
      dbEoIProfile.preferredSubject,
      dbEoIProfile.isOver18,
      dbEoIProfile.comment,
      dbEoIProfile.aboutMe,
      dbEoIProfile.linkedInProfile,
      dbEoIProfile.wasMentor,
      dbEoIProfile.mentorId,
      new Date(),
    ],
  );

  const dbReference1: DBReference = {
    firstName: userForm["REFEREE 1 - First Name:"],
    lastName: userForm["REFEREE 1 - Surname:"],
    mobile: userForm["REFEREE 1 - Mobile:"],
    email: userForm["REFEREE 1 - Email:"],
    bestTimeToContact:
      userForm["REFEREE 1 - When is the best time to contact referee 1?"],
    relationship: userForm["REFEREE 1 - How do they know you?"],
    generalComment: null,
    outcomeComment: null,
    hasKnowApplicantForAYear: null,
    isRelated: null,
    isMentorRecommended: null,
    calledBy: null,
    calledOndate: null,
    mentorId: resultSetHeader.insertId,
  };

  const dbReference2: DBReference = {
    firstName: userForm["REFEREE 2 - First Name:"],
    lastName: userForm["REFEREE 2 - Surname:"],
    mobile: userForm["REFEREE 2 - Mobile:"],
    email: userForm["REFEREE 2 - Email:"],
    bestTimeToContact:
      userForm["REFEREE 2 - When is the best time to contact referee 2?"],
    relationship: userForm["REFEREE 2 - How do they know you?"],
    generalComment: null,
    outcomeComment: null,
    hasKnowApplicantForAYear: null,
    isRelated: null,
    isMentorRecommended: null,
    calledBy: null,
    calledOndate: null,
    mentorId: resultSetHeader.insertId,
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
        mentorId,
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
      dbReference1.mentorId,
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
      dbReference2.mentorId,
      new Date(),
    ],
  );

  await connection.commit();

  await connection.end();

  return resultSetHeader.insertId;
}
