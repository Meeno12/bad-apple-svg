const ffmpeg = require("fluent-ffmpeg");
const config = require("../appConfig.json");

console.log(config);

ffmpeg("./src/assets/badApple.mp4")
  .outputOptions(["-r", Math.max(1, config.framerate)])
  .on("end", () => {
    console.log("finished");
  })
  .on("error", (err) => {
    throw err;
  })
  .output("./badAppleFrames/%d.png");
