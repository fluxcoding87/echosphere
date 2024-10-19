import getUsers from "@/actions/get-users";
import Sidebar from "@/components/sidebar";
import UserList from "./_components/user-list";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users!} />
        {children}
      </div>
    </Sidebar>
  );
};

export default UsersLayout;
