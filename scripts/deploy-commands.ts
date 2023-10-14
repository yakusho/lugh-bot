import { readdirSync } from "fs";
import { join } from "path";

import { REST, Routes } from "discord.js";

const TOKEN = process.env.DISCORD_TOKEN as string;
const CLIENTID = process.env.CLIENTID as string;
const GUILDID = process.env.GUILDID as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands: any[] = [];
const commandsPath = join(__dirname, "../commands");
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(".ts")
);

(async () => {
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(filePath);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  rest
    .put(
      Routes.applicationGuildCommands(CLIENTID, GUILDID),
      { body: commands }
    )
    .then(() => console.log("Successfully registered application commands"))
    .catch(console.error);
})();