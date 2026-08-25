CREATE TABLE `questionnaire_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`alias` text NOT NULL,
	`full_name` text,
	`age` text,
	`phone` text,
	`sponsor` text,
	`answers_json` text NOT NULL,
	`profile_photo_key` text,
	`motorcycle_photo_key` text,
	`status` text DEFAULT 'nueva' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
