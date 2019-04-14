# Установка Express Web Server

1. Клонируйте данный репозиторий <br /><br />
В консоли выполните следующую команду. <br /><br />
Если клонируете через ssh: <br />
`git clone git@github.com:vova111/express-es6.git adminka-google-place` <br /><br />
Если клонируете через https: <br />
`git clone https://github.com/vova111/express-es6.git adminka-google-place` <br /><br />
где 'adminka-google-place' папка в которую будет склониров репозиторий. <br /><br />
2. Откройте через консоль папку 'adminka-google-place'<br /><br />
3. Выполните следующую команду в консоли <br /><br />
`npm install` <br /><br />
4. Установите модуль cross-env <br /><br />
В консоли выполините команду<br />
`npm i cross-env`<br /><br />
5. Отредактируйте файл 'package.json'<br /><br />
Замените строчку <br />
`"start": "node ./bin/www"`<br /><br />
на строчку<br />
`"start": "cross-env NODE_PATH=. node ./bin/www"`<br /><br />
6. Проверьте работоспособность сервера<br /><br />
Запустите веб сервер командой <br />
`npm run start`<br /><br />
Откройте в браузере следующую сайт<br />
`http://localhost:3000`<br /><br />
У вас должен открыться сайт и вы должны видеть на страничке надпись 'Express'<br /><br />
Если у вас открывается сайт, переходите к следующим инструкциям, если нет, вы что-то сделали не так.<br /><br />
7. Остановите веб сервер<br /><br />
8. Удалите следующие файлы<br /><br />
Удалите папку `bin`<br />
Удалите файл `app.js`<br /><br />
9. Склонируйте слудеющий репозиторий<br /><br />
Через консоль выйдите на уровень выше из папки 'adminka-google-place'.<br /><br />
В консоли выполните следующую команду. <br /><br />
Если клонируете через ssh: <br />
`git clone git@github.com:vova111/express-server-settings.git` <br /><br />
Если клонируете через https: <br />
`git clone https://github.com/vova111/express-server-settings.git` <br /><br />
В результате у вас должна создаться папка 'express-server-settings'<br /><br />
10. Скопируйте файлы<br /><br />
Скопируйте все файлы и папки из каталога 'express-server-settings' в каталог 'adminka-google-place'<br /><br />
11. Отредактируйте файл config/db.js<br /><br />
Перейдите в консоли в папку 'adminka-google-place' и откройте файл<br />
`config/db.js`<br /><br />
В файле есть строка<br />
`uri: 'mongodb://localhost:27017/database_name',`<br /><br />
Замените название базы данных 'database_name' на свое название для вашего проекта, например:<br />
`uri: 'mongodb://localhost:27017/google_place',`<br /><br />
12. Установите следующие модули<br /><br />
В консоли перейтиде в каталог 'adminka-google-place' и выполните по очереди следующие команды:<br /><br />
`npm i nconf`<br />
`npm i fs-extra`<br />
`npm i logger`<br />
`npm i mongoose`<br /><br />
13. Проверьте работоспособность сервера<br /><br />
Запустите веб сервер командой <br />
`npm run start`<br /><br />
Откройте в браузере следующую сайт<br />
`http://localhost:8000`<br /><br />
У вас должен открыться сайт и вы должны видеть на страничке надпись 'Express'<br /><br />
**Вы установили чистий Express Web Server и настроили его для работы с базой данных через раннеры**