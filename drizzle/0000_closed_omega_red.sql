CREATE TABLE "episode" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "episode_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(120) NOT NULL,
	"season" integer NOT NULL,
	"episode" integer NOT NULL,
	"slug" varchar(120) NOT NULL,
	"thumbnail_url" varchar(220),
	"video_url" varchar(220),
	"novel_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "episode_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "novels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "novels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"thumbnail_url" varchar(220),
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "novels_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "episode" ADD CONSTRAINT "episode_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;