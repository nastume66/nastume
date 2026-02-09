import { ActivityFeed } from "../components/ActivityFeed";
import { CalendarView } from "../components/CalendarView";
import { GlobalSearch } from "../components/GlobalSearch";

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">OpenClaw Mission Control</h1>
      <p className="text-zinc-400">Activity Feed · Calendar · Global Search</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card"><ActivityFeed /></div>
        <div className="card"><CalendarView /></div>
      </div>
      <div className="card"><GlobalSearch /></div>
    </main>
  );
}
