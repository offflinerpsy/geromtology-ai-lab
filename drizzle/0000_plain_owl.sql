CREATE TABLE `contact_enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`organization` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_enquiries_created_at_idx` ON `contact_enquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `contact_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_rate_limits_expiry_idx` ON `contact_rate_limits` (`expires_at`);