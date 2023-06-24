const { Builder, Browser, By, until } = require("selenium-webdriver");
const { elementLocated } = require("selenium-webdriver/lib/until");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("Draw button returns bots container ", async () => {
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id("draw")).click();
    await driver.sleep(1000);
    let choices = await driver.wait(elementLocated(By.id("choices")));
    console.log(choices);
  });

  test("Add to Duo displays player duo div", async () => {
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id("draw")).click();
    await driver.sleep(1000);
    await driver.wait(elementLocated(By.id("choices")));
    let playerDuo = await driver.wait(elementLocated(By.id("player-duo")));
    console.log(playerDuo);
  });
});
