CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
	`newsletters` varchar(255) DEFAULT 'all',
	`token` varchar(64) NOT NULL,
	`confirmedAt` timestamp,
	`unsubscribedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`source` varchar(64) DEFAULT 'newsletter-page',
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `subscribers_token_unique` UNIQUE(`token`)
);
