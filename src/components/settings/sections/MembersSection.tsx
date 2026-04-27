import { ChevronDown, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TEAM_MEMBERS = [
  { email: "benoit@busbud.com", name: "Benoit Lemoine", status: "Active", auth: "Basic", role: "Viewer" },
  { email: "growth@busbud.com", name: "-", status: "Active", auth: "Basic", role: "Admin" },
  { email: "bruno@buson.com.br", name: "Bruno Silva", status: "Active", auth: "Basic", role: "Admin" },
  { email: "chris@deepcrawl.com", name: "Chris Spann", status: "Active", auth: "Basic", role: "Admin" },
  { email: "support@buson.com.br", name: "-", status: "Email unconfirmed", auth: "Basic", role: "Viewer" },
  { email: "james.leisy@lumar.io", name: "James Leisy", status: "Active", auth: "Basic", role: "Admin" },
  { email: "joao.pereira@busbud.com", name: "Joao Filipe Pereira", status: "Active", auth: "Basic", role: "Admin" },
  { email: "joshua.eden@deepcrawl.com", name: "Joshua Eden", status: "Active", auth: "Basic", role: "Admin" },
];

export function MembersSection() {
  return (
    <div className="-mx-6 -my-5">
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users" className="pl-9" data-lpignore="true" />
          </label>
          <p className="text-sm font-semibold">18 of 100 Users</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-surface/50 text-xs font-semibold text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Authentication</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TEAM_MEMBERS.map((member) => (
              <tr key={member.email} className="hover:bg-surface/40">
                <td className="px-5 py-4 font-medium text-foreground">{member.email}</td>
                <td className="px-5 py-4 text-foreground">{member.name}</td>
                <td className="px-5 py-4"><StatusBadge status={member.status} /></td>
                <td className="px-5 py-4"><span className="rounded-sm bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{member.auth}</span></td>
                <td className="px-5 py-4">
                  <button className="inline-flex items-center gap-2 font-medium hover:text-primary">
                    {member.role}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button variant="ghost" size="icon" aria-label={`Actions for ${member.email}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span className={`rounded-sm px-2 py-1 text-xs font-semibold ${isActive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
      {status}
    </span>
  );
}