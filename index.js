const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./option')
const token = "6162734526:AAGaEZoQeq4EjreDtIiRCIPhJqNH8meBxWA";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

//логіка генерації нового числа
const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Зараз бот загадує цифру від 0 до 9, а ти повинен її відгадати"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, " Відгадуй)", gameOptions);
};

//реалізую функцію яка буде запускати мій бот
const start = () => {
  //пишу перелік команд
  bot.setMyCommands([
    { command: "/start", description: "Стартове привітання" },
    { command: "/info", description: "Отримати інформацію про користувача" },
    { command: "/game", description: "Гра 'Відгадай цифру'" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp"
      );
      return bot.sendMessage(chatId, "Ласкаво просимо до телеграм боту");
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебе не розумію, спробуй ще раз)");
  });

  //написав прослуховування на кнопки
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    //роблю перевіркуна те вгадав користувач цифру чи ні
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Вітаю, ти відгадав цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Нажаль ти не відгадав, бот загадав цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
