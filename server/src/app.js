import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cron from "node-cron"
import moment from "moment"
import fetch from "node-fetch"
import fs from "fs"
import JSONdb from "simple-json-db"
import change from "percent-change"

const env = process.env.NODE_ENV
import { fileURLToPath } from "url"

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname + "/public"))

if (!fs.existsSync("./storage.json")) {
  fs.writeFileSync("./storage.json", JSON.stringify({}))
}

const db = new JSONdb("./storage.json")

app.use(express.static(__dirname + "/public"))

const getGraphData = async (timestamp) => {
  let timeValue = moment()
  switch (timestamp) {
    case "1W":
      timeValue = moment().subtract(1, "weeks").unix()
      break
    case "1M":
      timeValue = moment().subtract(1, "months").unix()
      break
    case "1Y":
      timeValue = moment().subtract(1, "years").unix()
      break
    case "ALL":
      timeValue = moment("2022-05-01").unix()
      break
    default:
      // 1D
      timeValue = moment().subtract(1, "days").unix()
      break
  }

  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${timeValue}&to=${moment().unix()}`
    console.log(url)
    const response = await fetch(url)
    const { prices } = await response.json()
    // const fixedPrices = prices.map((x) => [])
    let fixedPrices = []
    for (var i = 0; i < prices.length; i++) {
      const item = prices[i]
      fixedPrices.push([item[1], item[0]])
    }
    return fixedPrices
  } catch (error) {
    console.log(error)
    console.error(error)
    return []
  }
}

const getHighLowData = async (timestamp) => {
  let days = "1"
  switch (timestamp) {
    case "1W":
      days = "7"
      break
    case "1M":
      days = "30"
      break
    case "1Y":
      days = "365"
      break
    case "ALL":
      days = "max"
      break
    default:
      // 1D
      days = "1"
      break
  }

  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/coins/kaspa/ohlc?vs_currency=usd&days=${days}`
    console.log(url)
    const response = await fetch(url)
    const data = await response.json()
    // const fixedPrices = prices.map((x) => [])
    return data
  } catch (error) {
    console.log(error)
    console.error(error)
    return []
  }
}

const getCurrentPrice = async () => {
  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd`
    console.log(url)
    const response = await fetch(url)
    const { kaspa } = await response.json()
    // const fixedPrices = prices.map((x) => [])
    return kaspa.usd
  } catch (error) {
    console.log(error)
    console.error(error)
    return []
  }
}

const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

cron.schedule("*/10 * * * *", async () => {
  console.log("---------------------")
  console.log("Data Refresh Occured.")
  console.log("Refreshing data again in one minute.")
  const dataALL = await getGraphData("ALL")
  try {
    db.set("dataALL", JSON.stringify(dataALL))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(20)
  const data1D = await getGraphData("1D")
  try {
    db.set("data1D", JSON.stringify(data1D))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(40)
  const data1Y = await getGraphData("1Y")
  try {
    db.set("data1Y", JSON.stringify(data1Y))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(20)
  const data1M = await getGraphData("1M")
  try {
    db.set("data1M", JSON.stringify(data1M))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(20)
  const data1W = await getGraphData("1W")
  try {
    db.set("data1W", JSON.stringify(data1W))
  } catch (err) {
    console.error(err)
    console.log(err)
  }

  sleep(60)
  const hlDataALL = await getHighLowData("ALL")
  try {
    db.set("dataALL-highlow", JSON.stringify(hlDataALL))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(20)
  const hlData1Y = await getHighLowData("1Y")
  try {
    db.set("data1Y-highlow", JSON.stringify(hlData1Y))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(20)
  const hlData1M = await getHighLowData("1M")
  try {
    db.set("data1M-highlow", JSON.stringify(hlData1M))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(40)
  const hlData1W = await getHighLowData("1W")
  try {
    db.set("data1W-highlow", JSON.stringify(hlData1W))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  sleep(20)
  const hlData1D = await getHighLowData("1D")
  try {
    db.set("data1D-highlow", JSON.stringify(hlData1D))
  } catch (err) {
    console.error(err)
    console.log(err)
  }

  sleep(40)
  const val = await getCurrentPrice()
  try {
    db.set("currentPrice", val)
  } catch (err) {
    console.error(err)
    console.log(err)
  }
})

app.get("/api/data", async (req, res, next) => {
  const data1Y = JSON.parse(await db.get("data1Y"))
  const data1M = JSON.parse(await db.get("data1M"))
  const data1W = JSON.parse(await db.get("data1W"))
  const data1D = JSON.parse(await db.get("data1D"))
  const dataALL = JSON.parse(await db.get("dataALL"))

  const dataALLPercent = JSON.parse(await db.get("dataALL-highlow"))
  const data1YPercent = JSON.parse(await db.get("data1Y-highlow"))
  const data1MPercent = JSON.parse(await db.get("data1M-highlow"))
  const data1WPercent = JSON.parse(await db.get("data1W-highlow"))
  const data1DPercent = JSON.parse(await db.get("data1D-highlow"))

  const currentPrice = JSON.parse(await db.get("currentPrice"))

  res.json({
    data: {
      prices: {
        latest: currentPrice,
        latest_price: {
          amount: {
            amount: currentPrice,
            currency: "KASPA",
            scale: 2,
          },
          timestamp: new Date().toISOString(),
          percent_change: {
            day: change(data1DPercent[0][1], currentPrice, false),
            week: change(data1WPercent[0][1], currentPrice, false),
            month: change(data1MPercent[0][1], currentPrice, false),
            year: change(data1YPercent[0][1], currentPrice, false),
            all: change(dataALLPercent[0][1], currentPrice, false),
          },
        },
        day: {
          prices: data1D,
        },
        week: {
          prices: data1W,
        },
        month: {
          prices: data1M,
        },
        year: {
          prices: data1Y,
        },
        all: {
          prices: dataALL,
        },
      },
    },
  })
})

app.get("/*", function (req, res, next) {
  res.sendFile(__dirname + "/public/index.html")
})

export default app
