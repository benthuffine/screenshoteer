#!/usr/bin/env node

const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const program = require("commander");

var urlvalue,
  emulate = "";

program
  .option("--url, [url]", "The url")
  .option("--emulate, [emulate]", "emulate device")
  .option("--fullpage, [fullpage]", "Full Page")
  .option("--pdf, [pdf]", "Generate PDF")
  .option("--w, [w]", "width")
  .option("--h, [h]", "height")
  .option("--waitfor, [waitfor]", "Wait time in milliseconds")
  .option("--el, [el]", "element css selector")
  .option("--filename, [filename]", "filename")
  .parse(process.argv);

if (program.url) urlvalue = program.url;
else
  process.exit(
    console.log(
      "Please add --url parameter. Something like this: $ screenshoteer --url http:www.example.com"
    )
  );

if (program.fullpage && program.fullpage == "true") fullPage = true;
if (program.fullpage && program.fullpage == "false") fullPage = false;
else fullPage = true;

console.log(urlvalue);
console.log(fullPage);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const d = new Date();
  if (program.w && program.h)
    await page.setViewport({
      width: Number(program.w),
      height: Number(program.h)
    });
  if (program.emulate) await page.emulate(devices[program.emulate]);
  await page.goto(urlvalue);
  const title = await page.title();
  const t = title.replace(/[/\\?%*:|"<>]/g, "-");
  const filename =
    program.filename || t + " " + program.emulate + " " + d.getTime();
  if (program.waitfor) await page.waitFor(Number(program.waitfor));
  if (program.el) {
    const el = await page.$(program.el);
    await el.screenshot({
      path: `${filename}.png`
    });
  } else {
    await page.screenshot({ path: filename + ".png", fullPage: fullPage });
  }
  await page.emulateMedia("screen");
  if (program.pdf) await page.pdf({ path: filename + ".pdf" });
  console.log(t);
  await browser.close();
})();
