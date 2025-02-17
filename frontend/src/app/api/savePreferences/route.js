import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// API Route to save preferences
export async function POST(request) {
  const { username, interests, budget, location } = await request.json();

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the preference already exists
    const existingPreference = await prisma.preferences.findUnique({
      where: { interests_budget_location: { interests, budget, location } },
    });

    // If preference doesn't exist, create it
    const preference = existingPreference
      ? existingPreference
      : await prisma.preferences.create({
          data: { interests, budget, location },
        });

        // Check if the UserPreferences relation already exists (if it exists, skip creating it)
        const existingUserPreference = await prisma.userPreferences.findUnique({
          where: {
            userUsername_preferencesInterests_preferencesBudget_preferencesLocation: {
              userUsername: user.username,
              preferencesInterests: preference.interests,
              preferencesBudget: preference.budget,
              preferencesLocation: preference.location,
            },
          },
        });
    
        // If it doesn't exist, create the UserPreferences relation
        if (!existingUserPreference) {
          await prisma.userPreferences.create({
            data: {
              userUsername: user.username,
              preferencesInterests: preference.interests,
              preferencesBudget: preference.budget,
              preferencesLocation: preference.location,
            },
          });
        }

    // Return the preference details
    return NextResponse.json(preference);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
