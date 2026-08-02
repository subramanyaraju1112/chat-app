const Sidebar = () => {
    return (
      <aside className="w-72 border-r bg-white">
  
        <div className="border-b p-6">
  
          <h1 className="text-2xl font-bold">
            Socket.IO Chat
          </h1>
  
        </div>
  
        <div className="p-4">
  
          <h2 className="mb-4 text-lg font-semibold">
            Online Users
          </h2>
  
          <div className="space-y-3">
  
            <div className="flex items-center gap-3">
  
              <div className="h-3 w-3 rounded-full bg-green-500" />
  
              Alice
  
            </div>
  
            <div className="flex items-center gap-3">
  
              <div className="h-3 w-3 rounded-full bg-green-500" />
  
              Bob
  
            </div>
  
          </div>
  
        </div>
  
      </aside>
    );
  };
  
  export default Sidebar;