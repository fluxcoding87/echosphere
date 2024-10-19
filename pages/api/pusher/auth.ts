import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]); // Explicitly allow POST
    return res.status(405).end(`Method ${req.method} Not Allowed`); // Send Method Not Allowed for anything else
  }

  // Get the session details
  const session = await getServerSession(req, res, authOptions);

  // Check if the user is authenticated
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get socketId and channelName from the request body
  const socketId = req.body.socket_id; // Make sure this matches the client-side request
  const channelName = req.body.channel_name;

  // Data to send for channel authorization
  const data = {
    user_id: session.user.email,
  };

  try {
    // Authorize the channel with Pusher
    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channelName,
      data
    );

    // Send back the authorization response
    return res.status(200).send(authResponse);
  } catch (error) {
    console.error("Error authorizing channel:", error);
    return res.status(500).json({ error: "Authorization failed" });
  }
}
