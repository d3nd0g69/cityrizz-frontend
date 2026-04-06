CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subject` varchar(255) NOT NULL,
	`previewText` varchar(255),
	`bodyHtml` text NOT NULL,
	`bodyText` text,
	`status` enum('draft','sent') NOT NULL DEFAULT 'draft',
	`recipientCount` int DEFAULT 0,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`eventDate` varchar(10) NOT NULL,
	`eventTime` varchar(64),
	`venue` varchar(255),
	`location` varchar(255),
	`category` varchar(64),
	`price` varchar(64),
	`imageUrl` text,
	`externalUrl` text,
	`featured` boolean NOT NULL DEFAULT false,
	`status` enum('published','pending','rejected') NOT NULL DEFAULT 'pending',
	`contactName` varchar(255),
	`contactEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
