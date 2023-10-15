import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  VoiceChannel,
  channelMention,
  userMention
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite an user to a private meeting room")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel where the meeting is happening")
        .setRequired(true)
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User you're inviting")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    const channel = interaction.options.getChannel("channel");

    if (!channel || !user) {
      return await interaction.reply({
        content: "Channel or user not found",
        ephemeral: true
      });
    }

    if (channel.type !== ChannelType.GuildVoice) {
      return await interaction.reply({
        content: "Selected channel is not a voice chat",
        ephemeral: true
      });
    }

    const voiceChannel = channel as VoiceChannel;
    voiceChannel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      Connect: true
    });

    user.send({
      content: `${userMention(interaction.user.id)} has invited you to join them at ${channelMention(voiceChannel.id)}`
    });

    await interaction.reply({
      content: "Invited user succesfully",
      ephemeral: true
    });
  }
};