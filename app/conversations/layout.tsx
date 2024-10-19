import Sidebar from "@/components/sidebar";
import ConversationList from "./_components/conversation-list";
import getConversations from "@/actions/get-conversations";
import getUsers from "@/actions/get-users";

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} users={users!} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationsLayout;
