import { Client, ClientOptions, Collection } from "discord.js";

export interface IDiscordClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: Collection<string, any>;
}

export default class DiscordClient extends Client implements IDiscordClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public commands: Collection<string, any>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}