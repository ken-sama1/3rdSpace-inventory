import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";
import { prisma } from "../src/index.js";

export const seedUsers = async () => {
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  while (true) {
    const command = (await rl.question("Seed users? [y/n]: ")).toLowerCase();

    if (command !== "y" && command !== "n") continue;

    if (command === "n") {
      console.log("Skipping users...");
      break;
    }

    try {
      console.log("Seeding users...");

      const adminExist = await prisma.user.findFirst({
        where: {
          role: "ADMIN",
        },
      });

      if (adminExist) {
        console.log(
          "Failed: This script is only meant to run during initial setup"
        );
        break;
      }
      const username = await rl.question("Enter username: ");
      const password = await rl.question("Enter password: ");

      const user = await prisma.user.create({
        data: {
          username,
          password,
          role: "ADMIN",
        },
      });

      console.log("Account successfully created");
      console.log("Username:", user.username, "Role:", user.role);

      console.log("Done seeding users.");
    } catch (error) {
      console.log("Failed to create an account", error);
    }
  }

  rl.close();
};
