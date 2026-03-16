import { relations } from "drizzle-orm/relations";
import { users, languages, seekerProfiles, applications, jobs, certifications, skills, education, experience, projects, achievements, employerProfiles, passwordResetTokens } from "./schema";

export const languagesRelations = relations(languages, ({one}) => ({
	user: one(users, {
		fields: [languages.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	languages: many(languages),
	seekerProfiles: many(seekerProfiles),
	applications: many(applications),
	certifications: many(certifications),
	skills: many(skills),
	educations: many(education),
	jobs: many(jobs),
	experiences: many(experience),
	projects: many(projects),
	achievements: many(achievements),
	employerProfiles: many(employerProfiles),
	passwordResetTokens: many(passwordResetTokens),
}));

export const seekerProfilesRelations = relations(seekerProfiles, ({one}) => ({
	user: one(users, {
		fields: [seekerProfiles.userId],
		references: [users.id]
	}),
}));

export const applicationsRelations = relations(applications, ({one}) => ({
	user: one(users, {
		fields: [applications.applicantId],
		references: [users.id]
	}),
	job: one(jobs, {
		fields: [applications.jobId],
		references: [jobs.id]
	}),
}));

export const jobsRelations = relations(jobs, ({one, many}) => ({
	applications: many(applications),
	user: one(users, {
		fields: [jobs.employerId],
		references: [users.id]
	}),
}));

export const certificationsRelations = relations(certifications, ({one}) => ({
	user: one(users, {
		fields: [certifications.userId],
		references: [users.id]
	}),
}));

export const skillsRelations = relations(skills, ({one}) => ({
	user: one(users, {
		fields: [skills.userId],
		references: [users.id]
	}),
}));

export const educationRelations = relations(education, ({one}) => ({
	user: one(users, {
		fields: [education.userId],
		references: [users.id]
	}),
}));

export const experienceRelations = relations(experience, ({one}) => ({
	user: one(users, {
		fields: [experience.userId],
		references: [users.id]
	}),
}));

export const projectsRelations = relations(projects, ({one}) => ({
	user: one(users, {
		fields: [projects.userId],
		references: [users.id]
	}),
}));

export const achievementsRelations = relations(achievements, ({one}) => ({
	user: one(users, {
		fields: [achievements.userId],
		references: [users.id]
	}),
}));

export const employerProfilesRelations = relations(employerProfiles, ({one}) => ({
	user: one(users, {
		fields: [employerProfiles.userId],
		references: [users.id]
	}),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({one}) => ({
	user: one(users, {
		fields: [passwordResetTokens.userId],
		references: [users.id]
	}),
}));