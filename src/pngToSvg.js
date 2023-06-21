const { PNG } = require("pngjs");
const BMP = require("bmp-js");
const fs = require("fs");
const potrace = require("potrace");
const config = require("../appConfig.json");

const inputDir = "./badAppleFrames";

const run = () => {
  const getFiles = () => {
    const fileList = fs
      .readdirSync(inputDir)
      .map(function (fileName) {
        return {
          name: fileName,
          time: fs.statSync(inputDir + "/" + fileName).mtime.getTime(),
        };
      })
      .sort(function (a, b) {
        return a.time - b.time;
      })
      .map(function (v) {
        return v.name;
      });

    return to2dArr(fileList, 1000);
  };

  const processVector = (err, svg, i, h, paths) => {
    if (err) throw err;
    const path = svg.split("\n")[1].split('"')[1];
    paths[h] = path;
    if (!paths.includes(undefined)) {
      console.log("writing json file " + i);
      fs.writeFileSync(
        "./src/assets/paths" + i + ".json",
        JSON.stringify(paths)
      );
    }
  };

  getFiles().forEach((files, i) => {
    const paths = new Array(files.length);

    files.forEach((x, h) => {
      console.log("converting file " + x + " to bmp");
      pngTo1Bmp(inputDir + "/" + x, (bmp) =>
        potrace.trace(bmp, (e, svg) => processVector(e, svg, i, h, paths))
      );
    });
  });
};

const pngTo1Bmp = (filename, fn = () => {}) => {
  fs.createReadStream(filename)
    .pipe(new PNG())
    .on("parsed", function () {
      const pngPixels = [];
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;

          const r = this.data[idx],
            g = this.data[idx + 1],
            b = this.data[idx + 2];

          if (r + g + b > config.lightSensitivity) {
            pngPixels.push(0, 255, 255, 255);
          } else {
            pngPixels.push(0, 0, 0, 0);
          }
        }
      }
      fn(
        BMP.encode({
          width: this.width,
          height: this.height,
          data: pngPixels,
        }).data
      );
    });
};

const to2dArr = (data = [], size = 5) => {
  let accumulator = [];
  const result = [];

  data.forEach((x, i) => {
    accumulator.push(x);
    if ((i + 1) % size === 0) {
      result.push(accumulator);
      accumulator = [];
    } else if (i + 1 === data.length) {
      result.push(accumulator);
    }
  });
  return result;
};

run();
