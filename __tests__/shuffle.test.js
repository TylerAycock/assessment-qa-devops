const shuffle = require("../src/shuffle");
const botsData = require('../src/botsData')



describe("shuffle should...", () => {
  myBots = shuffle(botsData)
test(`Shuffle should retun an arr`, ()=>{
    expect(shuffle()).toEqual([])
})

test(`Shuffle should return an arr of the same length as the argument sent in`, ()=>{
  expect(myBots.length).toEqual(botsData.length)
})

test('Shuffle should return arr but in a random order', ()=>{
  console.info('the first bot from the shuffle ' + myBots[0].name)
  console.log('the first bot from the database ' + botsData[0].name)
  expect(myBots[0].id).not.toEqual(botsData[0].id)
})

});
