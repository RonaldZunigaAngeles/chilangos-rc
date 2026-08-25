CREATE TABLE `collaboration_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_name` text NOT NULL,
	`business_name` text NOT NULL,
	`business_type` text NOT NULL,
	`location` text NOT NULL,
	`email` text,
	`phone` text,
	`instagram` text,
	`proposal` text NOT NULL,
	`status` text DEFAULT 'nueva' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
