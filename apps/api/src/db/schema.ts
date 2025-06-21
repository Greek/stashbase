import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export const space = pgTable('space', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('My New Space'),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const membership = pgTable('membership', {
  id: text('id').primaryKey(),
  roles: text('roles')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),

  memberId: text('member_id').references(() => user.id, {
    onDelete: 'cascade',
  }),
  spaceId: text('space_id').references(() => space.id, {
    onDelete: 'cascade',
  }),
});

export const file = pgTable(
  'file',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    s3Path: text('s3_path').notNull(),
    filename: text('filename').notNull(),

    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
    uploaderId: text('uploader_id').references(() => user.id, {
      onDelete: 'no action',
    }),
    spaceId: text('space_id').references(() => space.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('file_space_id_idx').on(table.spaceId),
    index('file_slug_idx').on(table.slug),
  ],
);

export const domain = pgTable(
  'domain',
  {
    id: text('id').primaryKey(),
    domainName: text('domain_name').notNull().unique(),
    dnsKey: text('dns_key').notNull().unique(),
    verified: boolean('verified').notNull().default(false),
    active: boolean('active').notNull().default(true),

    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
    creatorId: text('creator_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    spaceId: text('space_id').references(() => space.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('domain_space_id_idx').on(table.spaceId),
    uniqueIndex('domain_domain_name_idx').on(table.domainName),
    uniqueIndex('domain_dns_key_idx').on(table.dnsKey),
  ],
);
