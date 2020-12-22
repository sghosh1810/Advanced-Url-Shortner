# Advanced Url Shortner

A url shortner with user login,url logging and stats. Build on EJS,Node,MongoDB

## Build


## Usage

If your public url is example.com dashboard will be example.com/dashboard.
Other pages:
- Login
- Register
- Url History & Stats


## Deploy on your Heroku
First clone the repository or download as zip
```bash
heroku login
cd proj_dir/
git init
git add .
git commit -"Initial Conmmit"
git push heroku master
```

## ENV file/ Environment Configuration
```
PORT = 80
HOST = YOUR DOMAIN URL
DATABASE_URI = MONGODB URI
DISCORD_ID = DISCORD APP ID
DISCORD_SECRET = DISCORD APP SECRET
```

## Packages
Following dependencies are requireds to run the project.

```node
"bcryptjs": "^2.4.3",
"body-parser": "^1.19.0",
"connect-flash": "^0.1.1",
"dotenv": "^8.2.0",
"ejs": "^3.1.3",
"express": "^4.17.1",
"express-ejs-layouts": "^2.5.0",
"express-session": "^1.17.1",
"helmet": "^3.23.3",
"mongoose": "^5.9.22",
"morgan": "^1.10.0",
"nanoid": "^3.1.10",
"nodemon": "^2.0.4",
"passport": "^0.4.1",
"passport-local": "^1.0.0",
"unirest": "^0.6.0",
"yup": "^0.29.1"
```
## Frontend
![main](https://res.cloudinary.com/websway/image/upload/v1603455155/Url%20shortner/Screenshot_2020-10-23_at_5.39.44_PM.png)

## Fronend with short URL
![main](https://res.cloudinary.com/websway/image/upload/v1603455155/Url%20shortner/Screenshot_2020-10-23_at_5.39.55_PM.png)

## Dashboard
![main](https://res.cloudinary.com/websway/image/upload/v1603455155/Url%20shortner/Screenshot_2020-10-23_at_5.40.52_PM.png)

## URL History, Statistics
![main](https://res.cloudinary.com/websway/image/upload/v1603455156/Url%20shortner/Screenshot_2020-10-23_at_5.41.01_PM.png)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Contributors: 
[Shounak Ghosh](https://github.com/sghosh1810/)

## License
[MIT](https://choosealicense.com/licenses/mit/)