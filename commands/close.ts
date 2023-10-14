import {
  ChannelType,
  ChatInputCommandInteraction,
  Guild,
  SlashCommandBuilder,
  VoiceChannel
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Close a meeting room")
    .addChannelOption(option => 
      option
        .setName("channel")
        .setDescription("Channel to close")
        .setRequired(true)
      ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const channel = interaction.options.getChannel('channel');

    if (!channel) {
      return await interaction.reply({
        content: "Channel not found",
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
    if (voiceChannel.permissionsFor(interaction.user)?.has("ManageChannels")) {
      guild.channels.delete(voiceChannel);
      return await interaction.reply({
        content: "Meeting room deleted succesfully",
        ephemeral: true
      });
    }
    
    return await interaction.reply({
      content: "You don't have the necessary permission to delete this meeting room",
      ephemeral: true
    });
  }
};