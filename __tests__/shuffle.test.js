const shuffle = require("../src/shuffle");
const botsData = require('../src/botsData')



describe("shuffle should...", () => {
  myBots = shuffle(botsData)
test(`Shuffle should retun an arr`, ()=>{
    expect(shuffle()).toEqual([])
})
test(`Shuffle should return an arr with all the same items from the bots DB except shuffled`, ()=>{
  console.info('the first bot from the shuffle ' + myBots[0].name)
  console.log('the first bot from the database ' + botsData[0].name)
  expect(myBots.length).toEqual(botsData.length)
})
});
