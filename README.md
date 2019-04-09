# [Happy Birthday, Orly!](https://happy-birthday-orly.herokuapp.com) 
Simple HTML5 game created for the birthday of my beloved girlfriend Orly.  
Built with [Phaser 3](https://phaser.io/phaser3) game framework.  
[Enjoy!](https://happy-birthday-orly.herokuapp.com) 

# Setup

## 1. Install dependencies:

Run:

```npm install```

## 2. Run the development server:

Run:

```npm start```

This will run a server so you can run the game in a browser.

Open your browser and enter [localhost:8080](http://localhost:8080) into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser


## Build for deployment:

Run:

```npm run build```

This will optimize and minimize the compiled bundle.

## Production web server:

Run:

```npm run server```

This will start production web server on port `process.env.PORT || 5000`. It serves static files and
can stream `.ogg` audio files.

