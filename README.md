# Web-сервис Преподаватели API

Web-сервис для учета и хранения информации о уроках преподавателя

## Запуск сервера

Перейди в корень проекта и запусти docker-compose.yml

```bash
docker-compose up -d
```
## Настройка сервера
В файле .env находятся переменные для подключения к Postgres - по умолчанию стоят настройки docker-сервера

## Запуск приложения
Установите библиотеки
```bash
npm i
```
Запустите сборку приложения
```bash
npm run start-dev
```
## Тестирование

Данный раздел находится в разработке
## License

[MIT](https://choosealicense.com/licenses/mit/)