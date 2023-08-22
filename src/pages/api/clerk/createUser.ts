import { prisma } from "~/server/db";

export default async (req, res) => {
  if (req.method === 'POST') {
    const userData = req.body.data;

    // Extract the necessary data from the payload
    const userId = userData.id;
    const fullName = userData.first_name + " "+ userData.last_name;
    const userName = userData.username; // Note: This might be null based on the example payload
    const email = userData.email_addresses[0]?.email_address;
    const image = userData.profile_image_url;
    

    console.log(userData)

    // Check if the necessary data is present
    if (!userId || !email) {
      res.status(400).json({ message: 'Required data missing from payload' });
      return;
    }

    try {
      // Check if user already exists in your database using Prisma
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        // Create a new user in your database using Prisma
        await prisma.user.create({
          data: {
            id: userId,
            userName: userName,
            email: email,
            name: fullName,
            image: image
          }
        });
      }

      res.status(200).json({ message: 'User processed successfully' });
    } catch (error) {
      console.error('Error processing user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
