interface SidebarProps {
  onlineUsers: string[]
}

const Sidebar = ({ onlineUsers }: SidebarProps) => {
  return (
    <aside className="w-72 border-r bg-white">

      <div className="border-b p-6">

        <h1 className="text-2xl font-bold text-slate-800">
          💬 Socket.IO
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Real-time Chat
        </p>

      </div>

      <div className="p-6">

        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Online Users
        </h2>

        <div className="space-y-4">
          {onlineUsers.length === 0 ? (
            <p className="text-sm text-slate-400">No online Users</p>) :

            (onlineUsers.map((user: string) => (
              <div
                key={user}
                className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-100"
              >
                <div className="h-3 w-3 rounded-full bg-green-500" />

                <span className="font-medium text-slate-700">
                  {user}
                </span>

              </div>
            ))
            )}

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;