## back-end
### 1. modify Mysql configuration
modify app/config/secure.js
```js
module.exports = {
  db: {
    database: "uwo",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    logging: false
  }
};
```
### 2. run back-end
```sh
cd back-end
npm install

npm run start:dev
```

