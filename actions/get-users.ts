import db from "@/libs/db";
import getSession from "./get-session";

const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (e) {
    console.log("GET_SESSION", e);
  }
};
export default getUsers;
