## How it works

i used fluent-ffmpeg to separate each frames of the video to an empty folder (create the badAppleFrames directory if it didn't exist). and once it got separated there's another js file to run that convert the frames on the folder to an svg path, so it was from png -> bmp -> svg path, and then i saved it in a json file.

## Usage

to run the svg you didn't have to install the node js dependencies just run the player js. A http server will start on http://localhost:3000 and that's where you play it

```sh
npm run play
```

but if you want to turn the video to svg as well you can run these

```sh
npm run to-png
npm run to-svg
```

## Extra note

Thank you to junferno bad apple desmos video and [buzzbyte/BadApple.SVG](https://github.com/buzzbyte/BadApple.SVG) for the inspiration
