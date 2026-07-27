-- CreateEnum
CREATE TYPE "media_asset_kind" AS ENUM ('image', 'video', 'icon', 'doc');

-- CreateEnum
CREATE TYPE "newsletter_subscriber_status" AS ENUM ('active', 'unsubscribed');

-- CreateEnum
CREATE TYPE "page_status" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(50) NOT NULL,
    "entity_table" VARCHAR(100) NOT NULL,
    "entity_id" INTEGER,
    "old_data" TEXT,
    "new_data" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "service" VARCHAR(120),
    "message" TEXT NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(120),
    "company" VARCHAR(150),
    "service" VARCHAR(120) NOT NULL,
    "rating" INTEGER NOT NULL,
    "rating_label" VARCHAR(20) NOT NULL,
    "message" TEXT NOT NULL,
    "avatar_url" VARCHAR(500),
    "can_publish" BOOLEAN NOT NULL,
    "publish_status" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "is_featured" BOOLEAN NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" SERIAL NOT NULL,
    "kind" "media_asset_kind" NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" VARCHAR(255),
    "caption" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_menu_items" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "label" VARCHAR(255) NOT NULL,
    "href" VARCHAR(255),
    "page_id" INTEGER,
    "order_index" INTEGER NOT NULL,
    "is_enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nav_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_menus" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nav_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(120) NOT NULL,
    "last_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "status" "newsletter_subscriber_status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_section_media" (
    "id" SERIAL NOT NULL,
    "page_section_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "role" VARCHAR(50),
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_section_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "section_key" VARCHAR(120) NOT NULL,
    "section_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255),
    "subtitle" VARCHAR(255),
    "order_index" INTEGER NOT NULL,
    "is_enabled" BOOLEAN NOT NULL,
    "data_json" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "meta_title" VARCHAR(255),
    "meta_description" VARCHAR(500),
    "status" "page_status" NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_category_association" (
    "sample_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "sample_category_association_pkey" PRIMARY KEY ("sample_id","category_id")
);

-- CreateTable
CREATE TABLE "sample_industries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_industry_association" (
    "sample_id" INTEGER NOT NULL,
    "industry_id" INTEGER NOT NULL,

    CONSTRAINT "sample_industry_association_pkey" PRIMARY KEY ("sample_id","industry_id")
);

-- CreateTable
CREATE TABLE "sample_leads" (
    "id" SERIAL NOT NULL,
    "sample_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "service_required" VARCHAR(255),
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "samples" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "short_description" VARCHAR(500) NOT NULL,
    "detailed_description" TEXT NOT NULL,
    "featured_image" VARCHAR(500),
    "video_url" VARCHAR(500),
    "status" VARCHAR(30) NOT NULL,
    "visibility" VARCHAR(30) NOT NULL,
    "password" VARCHAR(255),
    "technologies" JSON,
    "project_highlights" JSON,
    "client_outcome" TEXT,
    "tags" JSON,
    "gallery_images" JSON,
    "before_after_images" JSON,
    "screenshots" JSON,
    "download_files" JSON,
    "seo_title" VARCHAR(255),
    "seo_meta_description" VARCHAR(500),
    "seo_meta_keywords" VARCHAR(500),
    "seo_og_image" VARCHAR(500),
    "seo_canonical_url" VARCHAR(500),
    "views" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "first_name" VARCHAR(120),
    "last_name" VARCHAR(120),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_audit_logs_id" ON "audit_logs"("id");

-- CreateIndex
CREATE INDEX "ix_audit_logs_user_id" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "ix_contact_requests_email" ON "contact_requests"("email");

-- CreateIndex
CREATE INDEX "ix_contact_requests_id" ON "contact_requests"("id");

-- CreateIndex
CREATE INDEX "ix_contact_requests_status" ON "contact_requests"("status");

-- CreateIndex
CREATE INDEX "ix_feedbacks_id" ON "feedbacks"("id");

-- CreateIndex
CREATE INDEX "ix_feedbacks_publish_status" ON "feedbacks"("publish_status");

-- CreateIndex
CREATE INDEX "ix_feedbacks_rating_label" ON "feedbacks"("rating_label");

-- CreateIndex
CREATE INDEX "ix_feedbacks_service" ON "feedbacks"("service");

-- CreateIndex
CREATE INDEX "ix_feedbacks_status" ON "feedbacks"("status");

-- CreateIndex
CREATE INDEX "ix_media_assets_id" ON "media_assets"("id");

-- CreateIndex
CREATE INDEX "ix_nav_menu_items_id" ON "nav_menu_items"("id");

-- CreateIndex
CREATE INDEX "ix_nav_menu_items_menu_id" ON "nav_menu_items"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "nav_menus_key_key" ON "nav_menus"("key");

-- CreateIndex
CREATE INDEX "ix_nav_menus_id" ON "nav_menus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_newsletter_subscribers_email" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "ix_newsletter_subscribers_id" ON "newsletter_subscribers"("id");

-- CreateIndex
CREATE INDEX "ix_page_section_media_id" ON "page_section_media"("id");

-- CreateIndex
CREATE INDEX "ix_page_section_media_media_id" ON "page_section_media"("media_id");

-- CreateIndex
CREATE INDEX "ix_page_section_media_page_section_id" ON "page_section_media"("page_section_id");

-- CreateIndex
CREATE INDEX "ix_page_sections_id" ON "page_sections"("id");

-- CreateIndex
CREATE INDEX "ix_page_sections_page_id" ON "page_sections"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_pages_slug" ON "pages"("slug");

-- CreateIndex
CREATE INDEX "ix_pages_id" ON "pages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "ix_roles_id" ON "roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_sample_categories_slug" ON "sample_categories"("slug");

-- CreateIndex
CREATE INDEX "ix_sample_categories_id" ON "sample_categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_sample_industries_slug" ON "sample_industries"("slug");

-- CreateIndex
CREATE INDEX "ix_sample_industries_id" ON "sample_industries"("id");

-- CreateIndex
CREATE INDEX "ix_sample_leads_id" ON "sample_leads"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_samples_slug" ON "samples"("slug");

-- CreateIndex
CREATE INDEX "ix_samples_id" ON "samples"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "ix_users_id" ON "users"("id");

-- CreateIndex
CREATE INDEX "ix_users_role_id" ON "users"("role_id");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nav_menu_items" ADD CONSTRAINT "nav_menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "nav_menus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nav_menu_items" ADD CONSTRAINT "nav_menu_items_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nav_menu_items" ADD CONSTRAINT "nav_menu_items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "nav_menu_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page_section_media" ADD CONSTRAINT "page_section_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page_section_media" ADD CONSTRAINT "page_section_media_page_section_id_fkey" FOREIGN KEY ("page_section_id") REFERENCES "page_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sample_category_association" ADD CONSTRAINT "sample_category_association_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "sample_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sample_category_association" ADD CONSTRAINT "sample_category_association_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sample_industry_association" ADD CONSTRAINT "sample_industry_association_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "sample_industries"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sample_industry_association" ADD CONSTRAINT "sample_industry_association_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sample_leads" ADD CONSTRAINT "sample_leads_sample_id_fkey" FOREIGN KEY ("sample_id") REFERENCES "samples"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
