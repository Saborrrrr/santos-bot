const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType
} = require("discord.js");

// 🔐 CONFIG SEGURA (Railway / env)
const TOKEN = process.env.MTQ5ODQ4NDA1MTExMDI2ODk0OA.GrAVLq.6tkAnQBuVyKceFKb-ep90yjqgIRN10N4PHbpHE;
const DONO_ID = process.env.813487177983459419;

let crimes = 0;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================= READY =================
client.once("ready", () => {
  console.log("📰 BOT ONLINE");
});

// ================= DEEPWEB =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.name !== "《💀》deepweb") return;

  const texto = msg.content.toLowerCase();

  if (
    !texto.includes("arma") &&
    !texto.includes("matar") &&
    !texto.includes("droga")
  ) return;

  const canal = msg.guild.channels.cache.find(c => c.name === "《📃》aprovacao");

  const embed = new EmbedBuilder()
    .setTitle("🧾 Nova notícia suspeita")
    .setDescription(msg.content)
    .setColor("Yellow");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("aprovar").setLabel("Aprovar").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("recusar").setLabel("Recusar").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("editar").setLabel("Editar").setStyle(ButtonStyle.Primary)
  );

  canal.send({ embeds: [embed], components: [row] });
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async (interaction) => {

  if (interaction.isButton()) {

    const jornalista = interaction.member.roles.cache.find(
      r => r.name === "📰 Jornalista Santista"
    );

    if (!jornalista)
      return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });

    const texto = interaction.message.embeds[0].description;

    if (interaction.customId === "aprovar") {

      crimes++;

      const canal = interaction.guild.channels.cache.find(c => c.name === "《📰》jornais-rp");

      const embed = new EmbedBuilder()
        .setTitle("📰 SANTOS RP NEWS")
        .setDescription(`🚨 ${texto}`)
        .setColor("Red");

      canal.send({ embeds: [embed] });

      return interaction.update({ content: "Publicado!", components: [] });
    }

    if (interaction.customId === "recusar") {
      return interaction.update({ content: "Recusado", components: [] });
    }

    if (interaction.customId === "editar") {

      const modal = new ModalBuilder()
        .setCustomId("editarModal")
        .setTitle("Editar notícia");

      const input = new TextInputBuilder()
        .setCustomId("novoTexto")
        .setLabel("Novo texto")
        .setStyle(TextInputStyle.Paragraph)
        .setValue(texto);

      modal.addComponents(new ActionRowBuilder().addComponents(input));

      return interaction.showModal(modal);
    }
  }

  if (interaction.type === InteractionType.ModalSubmit) {

    const texto = interaction.fields.getTextInputValue("novoTexto");

    const canal = interaction.guild.channels.cache.find(c => c.name === "《📰》jornais-rp");

    canal.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("📰 NOTÍCIA EDITADA")
          .setDescription(texto)
      ]
    });

    return interaction.reply({ content: "Editado!", ephemeral: true });
  }

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ranking") {
    return interaction.reply(`📊 Crimes registrados: ${crimes}`);
  }

  if (interaction.commandName === "cidade-status") {

    let status = "🟢 Calma";
    if (crimes > 5) status = "🟡 Tensa";
    if (crimes > 10) status = "🔴 Caos";

    return interaction.reply(`🌆 Cidade: ${status}`);
  }

  // DONO
  if (interaction.user.id === 813487177983459419) {

    if (interaction.commandName === "resetar-crimes") {
      crimes = 0;
      return interaction.reply("Sistema resetado");
    }

    if (interaction.commandName === "simular-crime") {
      crimes++;
      return interaction.reply("Crime simulado");
    }
  }
});

client.login(MTQ5ODQ4NDA1MTExMDI2ODk0OA.GrAVLq.6tkAnQBuVyKceFKb-ep90yjqgIRN10N4PHbpHE);
