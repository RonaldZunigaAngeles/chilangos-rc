import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const collaborationRequests = sqliteTable("collaboration_requests", {
  id: text("id").primaryKey(),
  contactName: text("contact_name").notNull(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  location: text("location").notNull(),
  email: text("email"),
  phone: text("phone"),
  instagram: text("instagram"),
  proposal: text("proposal").notNull(),
  status: text("status").notNull().default("nueva"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const questionnaireSubmissions = sqliteTable("questionnaire_submissions", {
  id: text("id").primaryKey(),
  alias: text("alias").notNull(),
  fullName: text("full_name"),
  age: text("age"),
  phone: text("phone"),
  sponsor: text("sponsor"),
  answersJson: text("answers_json").notNull(),
  profilePhotoKey: text("profile_photo_key"),
  motorcyclePhotoKey: text("motorcycle_photo_key"),
  status: text("status").notNull().default("nueva"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const rideSafetySubmissions = sqliteTable("ride_safety_submissions", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  alias: text("alias").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  birthDate: text("birth_date").notNull(),
  bloodType: text("blood_type"),
  medicalNotes: text("medical_notes"),
  emergencyContactName: text("emergency_contact_name").notNull(),
  emergencyContactPhone: text("emergency_contact_phone").notNull(),
  healthInstitution: text("health_institution"),
  insuranceActive: text("insurance_active").notNull(),
  motorcycleModel: text("motorcycle_model").notNull(),
  motorcycleYear: text("motorcycle_year"),
  engineCc: text("engine_cc"),
  plates: text("plates"),
  policyDetails: text("policy_details"),
  consent: text("consent").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
