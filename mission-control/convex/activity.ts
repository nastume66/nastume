import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMany = mutation({
  args: {
    items: v.array(v.object({ ts: v.string(), type: v.string(), source: v.string(), text: v.string() }))
  },
  handler: async (ctx, { items }) => {
    for (const x of items) await ctx.db.insert("activity", x);
    return { inserted: items.length };
  }
});

export const latest = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("activity").order("desc").take(limit ?? 100);
  }
});
