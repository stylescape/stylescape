var sass  = require("sass");
// var Fiber = require("fibers"); Depreciated
const fs  = require("fs");


var kyu_src_file     = "scss/main.scss";
var kyu_max_file_css = "css/kyu.css";
var kyu_max_file_map = "css/kyu.map";
var kyu_min_file_css = "css/kyu.min.css";
var kyu_min_file_map = "css/kyu.min.map";

var kyu_max_buf = sass.renderSync({
  file: kyu_src_file,
  sourceMap: true,
  outFile: kyu_max_file_css,
  outputStyle: "expanded"
});

var kyu_min_buf = sass.renderSync({
  file: kyu_src_file,
  sourceMap: true,
  outFile: "style.css",
  outputStyle: "compressed"
});

let kyu_max_str_css = kyu_max_buf.css.toString();
let kyu_max_str_map = kyu_max_buf.map.toString();
let kyu_min_str_css = kyu_min_buf.css.toString();
let kyu_min_str_map = kyu_min_buf.map.toString();


// write to new files
function writer(f, s) {
  fs.writeFile(f, s, (err) => {
    if (err) throw err;
    console.log(f + ' saved!');
  });
}
writer(kyu_max_file_css, kyu_max_str_css);
writer(kyu_max_file_map, kyu_max_str_map);
writer(kyu_min_file_css, kyu_min_str_css);
writer(kyu_min_file_map, kyu_min_str_map);