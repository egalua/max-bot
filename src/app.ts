import 'dotenv/config'
import { Bot } from '@maxhub/max-bot-api';

if(process.env.USER_ID === undefined || process.env.USER_ID === null || process.env.USER_ID === "") throw new Error("Некорректное значение USER_ID")
if(process.env.CHAT_ID === undefined || process.env.USER_ID === null || process.env.USER_ID === "") throw new Error("Некорректное значение CHAT_ID")

const botToken = process.env.BOT_TOKEN ?? ""
const userID = parseInt(process.env.USER_ID)
const chatID = parseInt(process.env.CHAT_ID )
const fotoSrc = './test_data/photo_2026-02-05_12-21-01.jpg'
const message1 = `Новый Кедровый
14.02 
Заявки: 2
В работе: 2
Закрыто: 0
15.02 
Заявки: 4
В работе: 3
Закрыто: 1
Броней поставлено: 1
https://crm.01e.ru/crm/deal/details/1111693/ Халитова Татьяна, дом 2.2, кв 32, 17 220 000, по ТИ, передали на оценку. 
Броней снято: 0
Сдано в юстицию: 0
Сформировано в юстицию: 0 
Встречи (экскурсии): 5
https://crm.01e.ru/crm/deal/details/1111693/ бронь 

https://crm.01e.ru/crm/deal/details/1114753/ семейная пара в возрасте, рассматривают исключительно 2к с ремонтом. Сейчаспроживают в ЕБ, там смущает густонаселенность, хочется более тихую локацию.Покупать будут с продажи квартиры в ЕБ. Планируют еще посмотреть вторичку в Кедровом. 

https://crm.01e.ru/crm/deal/details/1111115/ клиент рассматривает 2к-3к, сам проект понравился, определили наиболееподходящие варианты. Хочет на след неделе еще приехать с девушкой. По оплатеспрашивал про рассрочку.

https://crm.01e.ru/crm/deal/details/1117135/ взрослая женщина, смотрит для себя квартиру 2к, посмотрели варианты, болеевсего заинтересовал вариант 65 кв м с выходом окон во двор. Сам комплекспонравился. Нужно продавать свою квартиру, очень большие ожидания по цене своейквартиры. Передали в ТИ на оценку

https://crm.01e.ru/crm/deal/details/1114576/ приехал с супругой, рассматривают приобретение 3с с балконами в ипотеку покакой-то особенной программе под ставку 12,5%. Ушли думать, контроль решения 
Проведенодля АН: 0`

const message2 = `(+) Устранено
Предписание по качеству (ЗВП)
Объект: НК2.2
Подрядчик: ООО "Ареан"

Квартира, секция 8, этаж 2, номер 296

Описание:
Заменить наружное полотно двери (скол)

Плановая дата устранения: 08.02.2026

Фактическая дата устранения:
04.02.2026 (4 перенос)

Инженер по качеству
Юдин Александр`
const bot = new Bot(botToken);

const file = await bot.api.uploadFile({source: fotoSrc})
const image = await bot.api.uploadImage({source: fotoSrc})

await bot.api.sendMessageToUser(userID, message1)
await bot.api.sendMessageToUser(userID, message2)
await bot.api.sendMessageToUser(userID, "тест отравки файла", {attachments: [file.toJson()]})
await bot.api.sendMessageToUser(userID, "тест отправки фото", {attachments: [image.toJson()]})

await bot.api.sendMessageToChat(chatID, message1)
await bot.api.sendMessageToChat(chatID, message2)
await bot.api.sendMessageToChat(chatID, "тест отравки файла", {attachments: [file.toJson()]})
await bot.api.sendMessageToChat(chatID, "тест отправки фото", {attachments: [image.toJson()]})


bot.start();


