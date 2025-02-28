import NotificationList from "../../models/NotificationList.js";

const datas = [
    {
        "name":"Лайк"
    },
    {
        "name":"Я пойду"
    },
    {
        "name":"Добавлено в избранное"
    },
    {
        "name":"Комментарий"
    },
    {
        "name":"Фото/Видео"
    }
]

const NotificationListSeeder = async () => {
    await NotificationList.deleteMany({});
    await NotificationList.insertMany(datas)
}

export {NotificationListSeeder};