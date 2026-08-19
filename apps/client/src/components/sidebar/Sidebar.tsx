import { CHAT_ROOMS } from "../../types/room";

interface SidebarProps {
  onlineUsers: string[];
  currentRoom: string;
  onRoomChange: (room: string) => void;
}

const Sidebar = ({
  onlineUsers,
  currentRoom,
  onRoomChange,
}: SidebarProps) => {
  return (
    <aside className="flex w-72 flex-col border-r bg-white">

      {/* Header */}

      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          💬 Socket.IO
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Real-time Chat
        </p>
      </div>

      {/* Rooms */}

      <div className="border-b p-6">

        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Rooms
        </h2>

        <div className="space-y-2">

          {CHAT_ROOMS.map((room) => {
            const isActive =
              currentRoom === room.id;

            return (
              <button
                key={room.id}
                onClick={() =>
                  onRoomChange(room.id)
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${isActive
                    ? "bg-blue-600"
                    : "bg-slate-300"
                    }`}
                />

                <span className="font-medium">
                  {room.name}
                </span>
              </button>
            );
          })}

        </div>

      </div>

      {/* Online Users */}

      <div className="flex-1 p-6">

        <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Online Users
        </h2>

        <div className="space-y-3">

          {onlineUsers.map((user) => (
            <div
              key={user}
              className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-100"
            >
              <div className="h-3 w-3 rounded-full bg-green-500" />

              <span className="font-medium text-slate-700">
                {user}
              </span>
            </div>
          ))}

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;