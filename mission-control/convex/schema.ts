import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activity: defineTable({
    ts: v.string(),
    type: v.string(),
    source: v.string(),
    text: v.string()
  }).index("by_ts", ["ts"]),
  searchIndex: defineTable({
    path: v.string(),
    line: v.optional(v.number()),
    excerpt: v.string(),
    updatedAt: v.string()
  }).index("by_path", ["path"]),
  schedules: defineTable({
    jobId: v.string(),
    name: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
    scheduleJson: v.string(),
    updatedAt: v.string()
  }).index("by_job", ["jobId"])
});
