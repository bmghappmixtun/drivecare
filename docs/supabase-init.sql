-- DriveCare initial database schema for Supabase PostgreSQL.
-- Paste this file in Supabase SQL Editor and run it once.

create type "Role" as enum ('USER', 'ADMIN');
create type "FuelType" as enum ('gasoline', 'diesel', 'hybrid', 'electric', 'lpg', 'other');
create type "TransmissionType" as enum ('manual', 'automatic', 'cvt', 'other');
create type "MaintenanceCategory" as enum (
  'oil_change',
  'filters',
  'tires',
  'battery',
  'brakes',
  'timing_belt',
  'air_conditioning',
  'insurance',
  'technical_inspection',
  'repair',
  'custom'
);
create type "ReminderStatus" as enum ('planned', 'sent', 'done', 'dismissed');
create type "NotificationChannel" as enum ('push', 'email', 'in_app');
create type "NotificationStatus" as enum ('unread', 'read', 'sent', 'failed');
create type "FileType" as enum ('invoice', 'image', 'registration', 'insurance', 'other');

create table if not exists "users" (
  "id" text primary key,
  "email" text not null unique,
  "passwordHash" text,
  "firstName" text,
  "lastName" text,
  "avatarUrl" text,
  "locale" text not null default 'fr',
  "role" "Role" not null default 'USER',
  "emailVerifiedAt" timestamp(3),
  "notificationPreferences" jsonb not null default '{"push":true,"email":true,"inApp":true}',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "refresh_tokens" (
  "id" text primary key,
  "tokenHash" text not null unique,
  "userId" text not null references "users"("id") on delete cascade on update cascade,
  "expiresAt" timestamp(3) not null,
  "revokedAt" timestamp(3),
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "vehicles" (
  "id" text primary key,
  "userId" text not null references "users"("id") on delete cascade on update cascade,
  "brand" text not null,
  "model" text not null,
  "year" integer not null,
  "licensePlate" text,
  "vin" text,
  "currentMileage" integer not null,
  "fuelType" "FuelType" not null,
  "transmission" "TransmissionType" not null,
  "photoUrl" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "vehicles_userId_licensePlate_key" unique ("userId", "licensePlate")
);

create table if not exists "mileage_logs" (
  "id" text primary key,
  "vehicleId" text not null references "vehicles"("id") on delete cascade on update cascade,
  "mileage" integer not null,
  "notedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "maintenance_records" (
  "id" text primary key,
  "userId" text not null,
  "vehicleId" text not null references "vehicles"("id") on delete cascade on update cascade,
  "category" "MaintenanceCategory" not null,
  "customCategory" text,
  "performedAt" timestamp(3) not null,
  "mileage" integer not null,
  "cost" decimal(12, 2) not null default 0,
  "garageName" text,
  "notes" text,
  "partsReplaced" text[] not null default array[]::text[],
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "reminders" (
  "id" text primary key,
  "userId" text not null,
  "vehicleId" text not null references "vehicles"("id") on delete cascade on update cascade,
  "maintenanceRecordId" text references "maintenance_records"("id") on delete set null on update cascade,
  "category" "MaintenanceCategory" not null,
  "title" text not null,
  "dueDate" timestamp(3),
  "dueMileage" integer,
  "status" "ReminderStatus" not null default 'planned',
  "channels" "NotificationChannel"[] not null default array['push', 'email', 'in_app']::"NotificationChannel"[],
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "expenses" (
  "id" text primary key,
  "userId" text not null,
  "vehicleId" text not null references "vehicles"("id") on delete cascade on update cascade,
  "maintenanceRecordId" text references "maintenance_records"("id") on delete set null on update cascade,
  "label" text not null,
  "amount" decimal(12, 2) not null,
  "currency" text not null default 'EUR',
  "spentAt" timestamp(3) not null
);

create table if not exists "notifications" (
  "id" text primary key,
  "userId" text not null references "users"("id") on delete cascade on update cascade,
  "title" text not null,
  "body" text not null,
  "channel" "NotificationChannel" not null,
  "status" "NotificationStatus" not null default 'unread',
  "metadata" jsonb not null default '{}',
  "createdAt" timestamp(3) not null default current_timestamp,
  "readAt" timestamp(3)
);

create table if not exists "uploaded_files" (
  "id" text primary key,
  "userId" text not null,
  "vehicleId" text references "vehicles"("id") on delete cascade on update cascade,
  "maintenanceRecordId" text references "maintenance_records"("id") on delete cascade on update cascade,
  "type" "FileType" not null,
  "fileName" text not null,
  "mimeType" text not null,
  "size" integer not null,
  "storageKey" text not null,
  "publicUrl" text,
  "createdAt" timestamp(3) not null default current_timestamp
);

create table if not exists "garages" (
  "id" text primary key,
  "name" text not null,
  "address" text,
  "city" text,
  "country" text,
  "latitude" decimal(9, 6),
  "longitude" decimal(9, 6),
  "rating" decimal(3, 2),
  "phone" text,
  "website" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists "ai_requests" (
  "id" text primary key,
  "userId" text not null references "users"("id") on delete cascade on update cascade,
  "vehicleId" text,
  "prompt" text not null,
  "response" jsonb not null,
  "createdAt" timestamp(3) not null default current_timestamp
);

create index if not exists "users_role_idx" on "users"("role");
create index if not exists "users_createdAt_idx" on "users"("createdAt");
create index if not exists "refresh_tokens_userId_idx" on "refresh_tokens"("userId");
create index if not exists "vehicles_userId_idx" on "vehicles"("userId");
create index if not exists "vehicles_vin_idx" on "vehicles"("vin");
create index if not exists "mileage_logs_vehicleId_notedAt_idx" on "mileage_logs"("vehicleId", "notedAt");
create index if not exists "maintenance_records_userId_performedAt_idx" on "maintenance_records"("userId", "performedAt");
create index if not exists "maintenance_records_vehicleId_category_idx" on "maintenance_records"("vehicleId", "category");
create index if not exists "reminders_userId_status_idx" on "reminders"("userId", "status");
create index if not exists "reminders_vehicleId_dueDate_idx" on "reminders"("vehicleId", "dueDate");
create index if not exists "reminders_vehicleId_dueMileage_idx" on "reminders"("vehicleId", "dueMileage");
create index if not exists "expenses_userId_spentAt_idx" on "expenses"("userId", "spentAt");
create index if not exists "expenses_vehicleId_idx" on "expenses"("vehicleId");
create index if not exists "notifications_userId_status_idx" on "notifications"("userId", "status");
create index if not exists "notifications_createdAt_idx" on "notifications"("createdAt");
create index if not exists "uploaded_files_userId_idx" on "uploaded_files"("userId");
create index if not exists "uploaded_files_vehicleId_idx" on "uploaded_files"("vehicleId");
create index if not exists "garages_city_country_idx" on "garages"("city", "country");
create index if not exists "ai_requests_userId_createdAt_idx" on "ai_requests"("userId", "createdAt");
