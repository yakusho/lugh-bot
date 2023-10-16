import {
  ActionRowBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  ComponentType,
  Guild,
  PermissionResolvable,
  SlashCommandBuilder,
  UserSelectMenuBuilder,
  channelMention,
  userMention
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("meeting")
    .setDescription("Create a private voice channel meeting room")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Meeting room channel name")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option
        .setName("hidden")
        .setDescription("Should the room be hidden from everyone?")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    if (!guild?.id) {
      return await interaction.reply({
        content: "Couldn't locate the guild id",
        ephemeral: true
      });
    }

    const name = interaction.options.getString("name") ?? "Unnamed room";
    const hidden = interaction.options.getBoolean("hidden");

    const deny: PermissionResolvable[] = [
      "Connect"
    ];

    if (hidden) {
      deny.push("ViewChannel");
    }

    const channel = await guild.channels.create({
      name,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: [
            "ViewChannel",
            "Connect",
            "ManageChannels"
          ]
        },
        {
          id: guild.id,
          deny
        }
      ]
    });

    const menu = new UserSelectMenuBuilder()
      .setCustomId("users")
      .setPlaceholder("Select the users you wish to invite")
      .setMaxValues(25);

    const row = 
      new ActionRowBuilder()
        .addComponents(menu) as ActionRowBuilder<UserSelectMenuBuilder>;

    const message = await interaction.reply({
      components: [row],
      content: `You're all set, your meeting room ${channelMention(channel.id)} is prepared!`,
      ephemeral: true
    });

    if (interaction.channel) {
      const select = await message.awaitMessageComponent({
        filter: ({ user }) => {
          return user.id === interaction.user.id;
        },
        componentType: ComponentType.UserSelect
      });

      const users = [];
      for (const value of select.values) {
        users.push(await interaction.client.users.fetch(value));
      }

      for (const user of users) {
        channel.permissionOverwrites.edit(user.id, {
          ViewChannel: true,
          Connect: true
        });

        user.send({
          content: `${userMention(interaction.user.id)} has invited you to join them at ${channelMention(channel.id)}`
        });
      }

      await message.edit({
        components: []
      });

      const names = users.map(({ id }) => userMention(id));
      select.reply({ content: `You invited ${names.join(", ")}!`, ephemeral: true });
    }
  }
};