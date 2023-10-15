import {
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  channelMention
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
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    if (!guild?.id) {
      return await interaction.reply({
        content: "Couldn't locate the guild id",
        ephemeral: true
      });
    }

    const roomName = interaction.options.getString("name") ?? "Unnamed room";

    const channel = await guild.channels.create({ 
      name: roomName,
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
          deny: [
            "ViewChannel"
          ]
        }
      ]
    });

    await interaction.reply({
      content: `Meeting room ${channelMention(channel.id)} created succesfully`,
      ephemeral: true
    });
  }
};