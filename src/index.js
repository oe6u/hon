const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
  ChannelType,
  ModalBuilder,
  LabelBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  EmbedBuilder,
  MessageFlags,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

if (!TOKEN || !CLIENT_ID) {
  console.error("ضع TOKEN و CLIENT_ID في ملف .env");
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "guilds.json");
fs.mkdirSync(DATA_DIR, { recursive: true });

let db = {};
try {
  db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
} catch {
  db = {};
}

function saveDB() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const MEDIA_URL =
  "https://cdn.discordapp.com/attachments/1396227600401305827/1564724947748917481/standard.gif?ex=6ae24f2a&is=6ae0fdaa&hm=76ef35adcaf5ddfbbe3644a30a1cd014c997b95ea3697ca3ddd62eaad97f7f90&";

const LANGS = {
  ar: {
    setup: "إعداد نظام الـ Honeypot",
    setupTitle: "Honeypot Setup",
    channel: "روم الطُعم",
    channelDesc: "أي رسالة هنا ستفعّل العقوبة.",
    channelPlaceholder: "اختر روم الـ Honeypot",
    dm: "نص رسالة الخاص",
    dmDesc: "الرسالة التي ستصل للعضو قبل العقوبة.",
    dmPlaceholder: "مثال: تم اتخاذ إجراء ضدك...",
    top: "النص داخل الـContainer",
    topDesc: "سيظهر فوق عداد العقوبات.",
    topPlaceholder: "مثال: هذا الروم مخصص لكشف الحسابات المخالفة.",
    punishment: "نوع العقوبة",
    punishmentDesc: "اختر Ban أو Kick.",
    punishmentPlaceholder: "اختر نوع العقوبة",
    kick: "Kick",
    ban: "Ban",
    duration: "مدة الـ Ban بالساعات",
    durationDesc: "إذا اخترت Ban اكتب عدد الساعات، وإذا اخترت Kick اتركه فارغًا.",
    durationPlaceholder: "24",
    setupDone: "تم تفعيل النظام",
    setupDoneDetails: "الروم: {channel}\nالعقوبة: {punishment}{duration}",
    onlyAdmin: "❌ هذا الأمر للإدارة فقط.",
    needKick: "❌ البوت يحتاج صلاحية Kick Members.",
    needBan: "❌ البوت يحتاج صلاحية Ban Members.",
    invalidChannel: "❌ اختر رومًا نصيًا صحيحًا.",
    invalidHours: "❌ اكتب عدد ساعات صحيح أكبر من 0.",
    dmTitleKick: "تم طردك من السيرفر",
    dmTitleBan: "تم حظرك من السيرفر",
    dmFooter: "Honeypot Protection",
    join: "دخول السيرفر",
    counterKick: "kick",
    counterBan: "ban",
    languageSet: "✅ تم تغيير لغة البوت إلى العربية.",
    noConfig: "❌ لم يتم إعداد الـHoneypot بعد. استخدم /setup.",
    punishmentSetKick: "✅ تم تعيين العقوبة: Kick.",
    punishmentSetBan: "✅ تم تعيين العقوبة: Ban لمدة {hours} ساعة.",
    logTitle: "Honeypot Log",
    logMember: "العضو",
    logAction: "العقوبة",
    logDuration: "المدة",
    logMessage: "الرسالة",
    logAttachments: "المرفقات",
    logNoText: "بدون نص",
    logKick: "Kick",
    logBan: "Ban",
  },
  en: {
    setup: "Honeypot Setup",
    setupTitle: "Honeypot Setup",
    channel: "Honeypot Channel",
    channelDesc: "Any message here will trigger the punishment.",
    channelPlaceholder: "Select the Honeypot channel",
    dm: "DM Message",
    dmDesc: "The message sent to the member before the punishment.",
    dmPlaceholder: "Example: An action has been taken against you...",
    top: "Container Text",
    topDesc: "Text displayed above the counter.",
    topPlaceholder: "Example: This channel is protected by Honeypot.",
    punishment: "Punishment",
    punishmentDesc: "Choose Ban or Kick.",
    punishmentPlaceholder: "Select punishment",
    kick: "Kick",
    ban: "Ban",
    duration: "Ban duration in hours",
    durationDesc: "If you choose Ban, enter hours. If you choose Kick, leave it empty.",
    durationPlaceholder: "24",
    setupDone: "System enabled",
    setupDoneDetails: "Channel: {channel}\nPunishment: {punishment}{duration}",
    onlyAdmin: "❌ This command is for administrators only.",
    needKick: "❌ The bot needs Kick Members permission.",
    needBan: "❌ The bot needs Ban Members permission.",
    invalidChannel: "❌ Select a valid text channel.",
    invalidHours: "❌ Enter a valid number of hours greater than 0.",
    dmTitleKick: "You were kicked from the server",
    dmTitleBan: "You were banned from the server",
    dmFooter: "Honeypot Protection",
    join: "Join the server",
    counterKick: "kick",
    counterBan: "ban",
    languageSet: "✅ Bot language changed to English.",
    noConfig: "❌ Honeypot is not configured yet. Use /setup.",
    punishmentSetKick: "✅ Punishment set to Kick.",
    punishmentSetBan: "✅ Punishment set to Ban for {hours} hour(s).",
    logTitle: "Honeypot Log",
    logMember: "Member",
    logAction: "Punishment",
    logDuration: "Duration",
    logMessage: "Message",
    logAttachments: "Attachments",
    logNoText: "No text",
    logKick: "Kick",
    logBan: "Ban",
  },
};

function getLang(guildId) {
  return db[guildId]?.language === "en" ? "en" : "ar";
}

function t(guildId, key) {
  return LANGS[getLang(guildId)][key];
}

function formatDuration(guildId, hours) {
  if (!hours) return "";
  return getLang(guildId) === "ar" ? `\nالمدة: ${hours} ساعة` : `\nDuration: ${hours} hour(s)`;
}

const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure the Honeypot messages")
    .setDMPermission(false),
  new SlashCommandBuilder()
    .setName("language")
    .setDescription("Change the bot language")
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("Bot language")
        .setRequired(true)
        .addChoices(
          { name: "العربية", value: "ar" },
          { name: "English", value: "en" }
        )
    )
    .setDMPermission(false),
  new SlashCommandBuilder()
    .setName("punishment")
    .setDescription("Set the Honeypot punishment")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Kick or Ban")
        .setRequired(true)
        .addChoices(
          { name: "Kick", value: "kick" },
          { name: "Ban", value: "ban" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Ban duration in hours (required for Ban)")
        .setMinValue(1)
        .setMaxValue(8760)
        .setRequired(false)
    )
    .setDMPermission(false),
];

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  await rest.put(Routes.applicationCommands(CLIENT_ID), {
    body: commands.map((c) => c.toJSON()),
  });
  console.log("✓ تم تسجيل /setup و /language و /punishment");
}

function isAdmin(member) {
  return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

function buildSetupModal(guildId) {
  const l = LANGS[getLang(guildId)];

  const modal = new ModalBuilder()
    .setCustomId("honeypot_setup")
    .setTitle(l.setupTitle);

  const honeypotSelect = new ChannelSelectMenuBuilder()
    .setCustomId("honeypot_channel")
    .setPlaceholder(l.channelPlaceholder)
    .setChannelTypes(ChannelType.GuildText)
    .setMinValues(1)
    .setMaxValues(1);

  const logSelect = new ChannelSelectMenuBuilder()
    .setCustomId("log_channel")
    .setPlaceholder(getLang(guildId) === "ar" ? "اختر روم الـLog" : "Select the log channel")
    .setChannelTypes(ChannelType.GuildText)
    .setMinValues(1)
    .setMaxValues(1);

  const dmInput = new TextInputBuilder()
    .setCustomId("dm_message")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(l.dmPlaceholder)
    .setRequired(true)
    .setMaxLength(4000);

  const topTextInput = new TextInputBuilder()
    .setCustomId("top_text")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(l.topPlaceholder)
    .setRequired(true)
    .setMaxLength(4000);

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel(l.channel)
      .setDescription(l.channelDesc)
      .setChannelSelectMenuComponent(honeypotSelect),
    new LabelBuilder()
      .setLabel(getLang(guildId) === "ar" ? "روم الـLog" : "Log Channel")
      .setDescription(getLang(guildId) === "ar" ? "الروم الذي يستقبل تفاصيل العقوبات والرسائل والمرفقات." : "Channel that receives punishment details, messages and attachments.")
      .setChannelSelectMenuComponent(logSelect),
    new LabelBuilder()
      .setLabel(l.dm)
      .setDescription(l.dmDesc)
      .setTextInputComponent(dmInput),
    new LabelBuilder()
      .setLabel(l.top)
      .setDescription(l.topDesc)
      .setTextInputComponent(topTextInput)
  );

  return modal;
}

function buildHoneypotMessage(config) {
  const count = Number(config.actions || 0);
  const isBan = config.punishment === "ban";
  const label = isBan ? "ban" : "kick";

  const button = new ButtonBuilder()
    .setCustomId("honeypot_counter")
    .setStyle(ButtonStyle.Success)
    .setLabel(`${label} ${count}`)
    .setDisabled(true);

  const container = new ContainerBuilder()
    .setAccentColor(isBan ? 0xed4245 : 0x57f287)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(config.topText))
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
    )
    .addActionRowComponents(new ActionRowBuilder().addComponents(button));

  if (MEDIA_URL) {
    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(MEDIA_URL))
    );
  }

  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

async function ensureBotChannels(guild) {
  const me = guild.members.me;
  if (!me) return;

  const categoryName = "Honeypot";
  const honeypotName = "・honeypot";
  const logName = "・honeypot・log";

  // Category visible to everyone so the Honeypot channel can be discovered.
  let category = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === categoryName
  );

  if (!category) {
    category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    });
  }

  // Honeypot is intentionally visible to everyone.
  let honeypot = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name === honeypotName && c.parentId === category.id
  );

  if (!honeypot) {
    honeypot = await guild.channels.create({
      name: honeypotName,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: me.id, allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ManageMessages,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.KickMembers,
          PermissionsBitField.Flags.BanMembers,
          PermissionsBitField.Flags.CreateInstantInvite,
        ] },
      ],
    });
  }

  // Keep the Honeypot channel visible to everyone and writable.
  await honeypot.permissionOverwrites.set([
    { id: guild.roles.everyone.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
    { id: me.id, allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.ManageChannels,
      PermissionsBitField.Flags.KickMembers,
      PermissionsBitField.Flags.BanMembers,
      PermissionsBitField.Flags.CreateInstantInvite,
    ] },
  ]).catch(() => {});

  // Log channel is hidden from everyone and visible to Administrator roles only.
  let log = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name === logName && c.parentId === category.id
  );

  const adminRoles = guild.roles.cache.filter((role) =>
    role.permissions.has(PermissionsBitField.Flags.Administrator)
  );

  const logOverwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: me.id, allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks,
      PermissionsBitField.Flags.AttachFiles,
    ] },
    ...adminRoles.map((role) => ({
      id: role.id,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
    })),
  ];

  if (!log) {
    log = await guild.channels.create({
      name: logName,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: logOverwrites,
    });
  } else {
    await log.permissionOverwrites.set(logOverwrites).catch(() => {});
  }

  // Keep Honeypot first, Log second, and the whole category first in the server.
  try {
    await category.setPosition(0);
  } catch (e) {
    console.warn("تعذر جعل Honeypot أول Category:", e.message);
  }

  try {
    await honeypot.setPosition(0);
    await log.setPosition(1);
  } catch (e) {
    console.warn("تعذر ترتيب رومات Honeypot:", e.message);
  }

  return { category, honeypot, log };
}

async function lockLogChannelToAdmins(channel, guild) {
  const me = guild.members.me;
  const adminRoles = guild.roles.cache.filter((role) =>
    role.permissions.has(PermissionsBitField.Flags.Administrator)
  );

  const overwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: me.id, allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks,
      PermissionsBitField.Flags.AttachFiles,
      PermissionsBitField.Flags.ReadMessageHistory,
    ] },
    ...adminRoles.map((role) => ({
      id: role.id,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
    })),
  ];

  await channel.permissionOverwrites.set(overwrites).catch(() => {});
}

async function getConfiguredChannels(guild, config) {
  const honeypot = config?.channelId ? guild.channels.cache.get(config.channelId) : null;
  const log = config?.logChannelId ? guild.channels.cache.get(config.logChannelId) : null;
  return {
    honeypot: honeypot?.type === ChannelType.GuildText ? honeypot : null,
    log: log?.type === ChannelType.GuildText ? log : null,
  };
}

function avatarUrl(member) {
  return member.displayAvatarURL({ extension: "png", size: 256, forceStatic: false });
}

async function sendDMTemplate(member, config, inviteUrl, actionText, durationHours) {
  const guildId = member.guild.id;
  const l = LANGS[getLang(guildId)];
  const isBan = config.punishment === "ban";

  const embed = new EmbedBuilder()
    .setColor(isBan ? 0xed4245 : 0x57f287)
    .setAuthor({ name: member.user.username, iconURL: avatarUrl(member) })
    .setThumbnail(avatarUrl(member))
    .setTitle(isBan ? l.dmTitleBan : l.dmTitleKick)
    .setDescription(config.dmMessage)
    .addFields(
      { name: "Server", value: member.guild.name, inline: true },
      { name: "Action", value: actionText, inline: true },
      ...(isBan
        ? [{ name: "Duration", value: `${durationHours} hour(s)`, inline: true }]
        : [])
    )
    .setFooter({ text: l.dmFooter })
    .setTimestamp();

  const components = [];
  if (inviteUrl) {
    components.push(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(l.join).setURL(inviteUrl)
    ));
  }

  await member.send({ embeds: [embed], components });
}

async function uploadImageToImgBB(imageUrl) {
  if (!IMGBB_API_KEY) return null;

  try {
    const form = new FormData();
    // ImgBB accepts a direct image URL in the `image` field.
    form.append("image", imageUrl);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_API_KEY)}`,
      { method: "POST", body: form }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(`ImgBB upload failed (${response.status}): ${body.slice(0, 300)}`);
      return null;
    }

    const data = await response.json();
    return data?.success && data?.data?.url ? data.data.url : null;
  } catch (error) {
    console.warn("ImgBB upload error:", error.message);
    return null;
  }
}

async function uploadImageAttachments(attachments) {
  const result = [];

  for (const attachment of attachments) {
    if (!attachment.contentType?.startsWith("image/")) {
      result.push({ ...attachment, uploadedUrl: null });
      continue;
    }

    const uploadedUrl = await uploadImageToImgBB(attachment.url);
    result.push({ ...attachment, uploadedUrl });
  }

  return result;
}

async function sendHoneypotLog(guild, member, config, messageContent, attachments, actionText, durationHours) {
  const channels = await getConfiguredChannels(guild, config);
  const logChannel = channels.log;
  if (!logChannel) return;

  const l = LANGS[getLang(guild.id)];
  const embed = new EmbedBuilder()
    .setColor(config.punishment === "ban" ? 0xed4245 : 0x57f287)
    .setTitle(`🚨 ${l.logTitle}`)
    .setAuthor({ name: member.user.tag, iconURL: avatarUrl(member) })
    .setThumbnail(avatarUrl(member))
    .addFields(
      { name: l.logMember, value: `${member} (${member.id})`, inline: false },
      { name: l.logAction, value: actionText, inline: true },
      ...(config.punishment === "ban" ? [{ name: l.logDuration, value: `${durationHours} hour(s)`, inline: true }] : []),
      { name: l.logMessage, value: (messageContent || l.logNoText).slice(0, 1024), inline: false },
    )
    .setTimestamp();

  const imageAttachments = attachments.filter((a) => a.contentType?.startsWith("image/"));
  const imageAttachment = imageAttachments[0];
  if (imageAttachment) embed.setImage(imageAttachment.uploadedUrl || imageAttachment.url);

  if (attachments.length) {
    const links = attachments.map((a) => {
      const url = a.uploadedUrl || a.url;
      const suffix = a.uploadedUrl ? " (ImgBB)" : " (Discord fallback)";
      return `[${a.name || "attachment"}](${url})${suffix}`;
    }).join("\n");
    embed.addFields({ name: l.logAttachments, value: links.slice(0, 1024), inline: false });
  }

  await logChannel.send({ embeds: [embed] }).catch((e) => console.warn("تعذر إرسال Honeypot Log:", e.message));
}

async function createInvite(channel) {
  try {
    const invite = await channel.createInvite({
      maxAge: 0,
      maxUses: 1,
      unique: true,
      reason: "Honeypot DM invite",
    });
    return invite.url;
  } catch (e) {
    console.warn("تعذر إنشاء الدعوة:", e.message);
    return null;
  }
}

async function scheduleUnban(guildId, userId, expiresAt) {
  const remaining = expiresAt - Date.now();
  const MAX = 2_147_000_000;

  if (remaining <= 0) {
    await performUnban(guildId, userId);
    return;
  }

  setTimeout(async () => {
    if (expiresAt > Date.now()) {
      await scheduleUnban(guildId, userId, expiresAt);
    } else {
      await performUnban(guildId, userId);
    }
  }, Math.min(remaining, MAX));
}

async function performUnban(guildId, userId) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  try {
    await guild.bans.remove(userId, "Honeypot temporary ban expired");
  } catch (e) {
    // Already unbanned / not found is harmless.
  }

  const config = db[guildId];
  if (config?.activeBans?.[userId]) {
    delete config.activeBans[userId];
    saveDB();
  }
}

function scheduleSavedBans() {
  for (const [guildId, config] of Object.entries(db)) {
    if (!config.activeBans) continue;
    for (const [userId, ban] of Object.entries(config.activeBans)) {
      scheduleUnban(guildId, userId, Number(ban.expiresAt));
    }
  }
}

client.once("ready", async () => {
  console.log(`✓ Logged in as ${client.user.tag}`);

  try { await registerCommands(); }
  catch (error) { console.error("فشل تسجيل الأوامر:", error); }

  for (const guild of client.guilds.cache.values()) {
    try { await ensureBotChannels(guild); }
    catch (error) { console.error(`فشل تجهيز ${guild.name}:`, error); }
  }

  scheduleSavedBans();
});

client.on("guildCreate", async (guild) => {
  try { await ensureBotChannels(guild); }
  catch (error) { console.error(`فشل تجهيز ${guild.name}:`, error); }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.guild) return;

    if (interaction.isChatInputCommand() && interaction.commandName === "language") {
      if (!isAdmin(interaction.member)) {
        return interaction.reply({ content: t(interaction.guild.id, "onlyAdmin"), flags: MessageFlags.Ephemeral });
      }

      const language = interaction.options.getString("language", true);
      db[interaction.guild.id] ||= {};
      db[interaction.guild.id].language = language;
      saveDB();

      return interaction.reply({
        content: language === "ar" ? LANGS.ar.languageSet : LANGS.en.languageSet,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (interaction.isChatInputCommand() && interaction.commandName === "punishment") {
      if (!isAdmin(interaction.member)) {
        return interaction.reply({ content: t(interaction.guild.id, "onlyAdmin"), flags: MessageFlags.Ephemeral });
      }

      const type = interaction.options.getString("type", true);
      const duration = interaction.options.getInteger("duration");
      const me = interaction.guild.members.me;

      if (type === "ban" && !me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: t(interaction.guild.id, "needBan"), flags: MessageFlags.Ephemeral });
      }
      if (type === "kick" && !me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: t(interaction.guild.id, "needKick"), flags: MessageFlags.Ephemeral });
      }
      if (type === "ban" && !duration) {
        return interaction.reply({
          content: getLang(interaction.guild.id) === "ar"
            ? "❌ عند اختيار Ban لازم تحدد مدة بالساعات، مثال: `/punishment type:Ban duration:24`."
            : "❌ When choosing Ban, you must provide the duration in hours, e.g. `/punishment type:Ban duration:24`. ",
          flags: MessageFlags.Ephemeral,
        });
      }

      db[interaction.guild.id] ||= {};
      db[interaction.guild.id].punishment = type;
      db[interaction.guild.id].banHours = type === "ban" ? duration : 0;
      db[interaction.guild.id].dmMessage ||= getLang(interaction.guild.id) === "ar"
        ? "تم اتخاذ إجراء ضدك بسبب إرسال رسالة في روم الـHoneypot."
        : "An action was taken against you for sending a message in the Honeypot channel.";
      db[interaction.guild.id].topText ||= getLang(interaction.guild.id) === "ar"
        ? "هذا الروم محمي بواسطة Honeypot."
        : "This channel is protected by Honeypot.";
      db[interaction.guild.id].actions = Number(db[interaction.guild.id].actions || 0);
      db[interaction.guild.id].activeBans ||= {};
      saveDB();

      const l = LANGS[getLang(interaction.guild.id)];

      // Update the existing Honeypot counter immediately when punishment changes.
      if (db[interaction.guild.id].panelMessageId) {
        const channels = await getConfiguredChannels(interaction.guild, db[interaction.guild.id]);
        const panel = channels?.honeypot
          ? await channels.honeypot.messages.fetch(db[interaction.guild.id].panelMessageId).catch(() => null)
          : null;
        if (panel) await panel.edit(buildHoneypotMessage(db[interaction.guild.id])).catch(() => {});
      }

      return interaction.reply({
        content: type === "ban"
          ? l.punishmentSetBan.replace("{hours}", String(duration))
          : l.punishmentSetKick,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (interaction.isChatInputCommand() && interaction.commandName === "setup") {
      if (!isAdmin(interaction.member)) {
        return interaction.reply({ content: t(interaction.guild.id, "onlyAdmin"), flags: MessageFlags.Ephemeral });
      }
      return interaction.showModal(buildSetupModal(interaction.guild.id));
    }

    if (interaction.isModalSubmit() && interaction.customId === "honeypot_setup") {
      if (!isAdmin(interaction.member)) {
        return interaction.reply({ content: t(interaction.guild.id, "onlyAdmin"), flags: MessageFlags.Ephemeral });
      }

      const guildId = interaction.guild.id;
      const dmMessage = interaction.fields.getTextInputValue("dm_message");
      const topText = interaction.fields.getTextInputValue("top_text");
      const selectedHoneypot = interaction.fields.getSelectedChannels("honeypot_channel")?.first();
      const selectedLog = interaction.fields.getSelectedChannels("log_channel")?.first();
      const old = db[guildId] || {};

      if (!selectedHoneypot || selectedHoneypot.type !== ChannelType.GuildText) {
        return interaction.reply({ content: t(guildId, "invalidChannel"), flags: MessageFlags.Ephemeral });
      }
      if (!selectedLog || selectedLog.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: getLang(guildId) === "ar" ? "❌ اختر روم Log نصي صحيح." : "❌ Select a valid text log channel.",
          flags: MessageFlags.Ephemeral
        });
      }
      if (selectedHoneypot.id === selectedLog.id) {
        return interaction.reply({
          content: getLang(guildId) === "ar" ? "❌ لازم تختار روم Honeypot وروم Log مختلفين." : "❌ Honeypot and Log channels must be different.",
          flags: MessageFlags.Ephemeral
        });
      }

      const autoChannels = await ensureBotChannels(interaction.guild);
      const punishment = old.punishment || "kick";
      const banHours = Number(old.banHours || 0);

      const me = interaction.guild.members.me;
      if (!me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: t(guildId, "needKick"), flags: MessageFlags.Ephemeral });
      }
      if (punishment === "ban" && !me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: t(guildId, "needBan"), flags: MessageFlags.Ephemeral });
      }
      if (punishment === "ban" && (!Number.isInteger(banHours) || banHours <= 0)) {
        return interaction.reply({ content: t(guildId, "invalidHours"), flags: MessageFlags.Ephemeral });
      }

      const config = {
        ...old,
        channelId: selectedHoneypot.id,
        logChannelId: selectedLog.id,
        dmMessage,
        topText,
        punishment,
        banHours,
        actions: Number(old.actions || 0),
        panelMessageId: null,
        activeBans: old.activeBans || {},
      };
      db[guildId] = config;
      saveDB();

      // The selected Log channel is private to Administrators + the bot.
      await lockLogChannelToAdmins(selectedLog, interaction.guild);

      try {
        const messages = await autoChannels.honeypot.messages.fetch({ limit: 50 });
        const botMessages = messages.filter((m) => m.author.id === client.user.id);
        if (botMessages.size) await autoChannels.honeypot.bulkDelete(botMessages, true);
      } catch {}

      const panel = await selectedHoneypot.send(buildHoneypotMessage(config));
      config.panelMessageId = panel.id;
      saveDB();

      const l = LANGS[getLang(guildId)];
      const punishmentLabel = punishment === "ban" ? l.ban : l.kick;
      return interaction.reply({
        content: `✅ ${l.setupDone}\n${l.setupDoneDetails.replace("{channel}", `<#${selectedHoneypot.id}>`).replace("{punishment}", punishmentLabel).replace("{duration}", punishment === "ban" ? formatDuration(guildId, banHours) : "")}`,
        flags: MessageFlags.Ephemeral,
      });
    }


  } catch (error) {
    console.error("Interaction error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ An unexpected error occurred. Check the console.", flags: MessageFlags.Ephemeral }).catch(() => {});
    }
  }
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const config = db[message.guild.id];
  if (!config) return;
  config.dmMessage ||= getLang(message.guild.id) === "ar"
    ? "تم اتخاذ إجراء ضدك بسبب إرسال رسالة في روم الـHoneypot."
    : "An action was taken against you for sending a message in the Honeypot channel.";
  config.topText ||= getLang(message.guild.id) === "ar"
    ? "هذا الروم محمي بواسطة Honeypot."
    : "This channel is protected by Honeypot.";

  const channels = await getConfiguredChannels(message.guild, config);
  const honeypotId = config.channelId || channels?.honeypot?.id;
  if (!honeypotId || message.channel.id !== honeypotId) return;

  // Capture everything before deleting the original message.
  const messageContent = message.content || "";
  const attachments = [...message.attachments.values()].map((a) => ({
    url: a.url,
    name: a.name,
    contentType: a.contentType,
  }));

  await message.delete().catch(() => {});

  const member = await message.guild.members.fetch(message.author.id).catch(() => null);
  if (!member) return;

  const me = message.guild.members.me;
  const isBan = config.punishment === "ban";

  if (isBan && !me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    console.warn(`Bot is missing Ban Members in ${message.guild.name}`);
    return;
  }
  if (!isBan && !me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
    console.warn(`Bot is missing Kick Members in ${message.guild.name}`);
    return;
  }

  if (!member.kickable && !isBan) return;
  if (!member.bannable && isBan) return;

  const inviteUrl = await createInvite(message.channel);
  const durationHours = isBan ? Number(config.banHours || 1) : 0;
  const actionText = isBan ? "Ban" : "Kick";

  // Send the avatar-based DM template before applying the punishment.
  await sendDMTemplate(member, config, inviteUrl, actionText, durationHours).catch(() => {});

  try {
    if (isBan) {
      await member.ban({ reason: "Honeypot triggered", deleteMessageSeconds: 0 });
      const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
      config.activeBans ||= {};
      config.activeBans[member.id] = {
        expiresAt,
        username: member.user.username,
      };
      config.actions = Number(config.actions || 0) + 1;
      saveDB();
      await scheduleUnban(message.guild.id, member.id, expiresAt);
    } else {
      await member.kick("Honeypot triggered");
      config.actions = Number(config.actions || 0) + 1;
      saveDB();
    }
  } catch (e) {
    console.error(`فشل تطبيق ${actionText} على ${member.user.tag}:`, e.message);
    return;
  }

  // Upload image attachments to ImgBB before writing the log.
  // Non-image files keep their original Discord URL.
  const loggedAttachments = await uploadImageAttachments(attachments);
  await sendHoneypotLog(message.guild, member, config, messageContent, loggedAttachments, actionText, durationHours);

  if (config.panelMessageId) {
    const panel = await message.channel.messages.fetch(config.panelMessageId).catch(() => null);
    if (panel) await panel.edit(buildHoneypotMessage(config)).catch(() => {});
  }
});

client.on("error", console.error);
process.on("unhandledRejection", (error) => console.error("Unhandled rejection:", error));
client.login(TOKEN);
