import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const contactEnquiries = sqliteTable('contact_enquiries', {
  id: text('id').primaryKey(), name: text('name').notNull(), organization: text('organization').notNull(),
  email: text('email').notNull(), message: text('message').notNull(), type: text('type').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('contact_enquiries_created_at_idx').on(table.createdAt)]);
export const contactRateLimits = sqliteTable('contact_rate_limits', {
  key: text('key').primaryKey(), count: integer('count').notNull(), expiresAt: integer('expires_at').notNull(),
}, (table) => [index('contact_rate_limits_expiry_idx').on(table.expiresAt)]);
