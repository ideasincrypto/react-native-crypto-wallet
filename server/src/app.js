import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cron from "node-cron"
import moment from "moment"
import fetch from "node-fetch"
import fs from "fs"

import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const port = 3000

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

if (!fs.existsSync(`${__dirname}/data`)) {
  fs.mkdirSync(`${__dirname}/data`)
}
app.use(express.static(path.join(__dirname, "data")))

const getCurrentPrice = async () => {
  try {
    const response = await fetch(
      // eslint-disable-next-line max-len
      "https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd"
    )
    const { kaspa } = await response.json()
    return kaspa.usd
  } catch (error) {
    console.error(error)
    return 0
  }
}

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

  let arrayOfObjects = []

  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${timeValue}&to=${moment().unix()}`
    console.log(url)
    const response = await fetch(url)
    const { prices } = await response.json()
    arrayOfObjects = prices?.map((x) => ({
      date: new Date(x[0]),
      value: x[1],
    }))
    return arrayOfObjects
  } catch (error) {
    console.error(error)
    return []
  }
}

const getData = async () => {
  const data = {
    currentPrice: await getCurrentPrice(),
    data1H: await getGraphData("1H"),
    data1D: await getGraphData("1D"),
    data1W: await getGraphData("1W"),
    data1M: await getGraphData("1M"),
    data1Y: await getGraphData("1M"),
    dataALL: await getGraphData("ALL"),
  }
  return data
}

// run at startup
console.log("---------------------")
console.log("Data Refresh Occured.")
console.log("Refreshing data again in one minute.")
const data = await getData()
try {
  fs.writeFileSync(`${__dirname}/data/data.json`, JSON.stringify(data))
} catch (err) {
  console.error(err)
}

cron.schedule("*/2 * * * *", async () => {
  console.log("---------------------")
  console.log("Data Refresh Occured.")
  console.log("Refreshing data again in one minute.")
  const val = await getData()
  try {
    fs.writeFileSync(`${__dirname}/data/data.json`, JSON.stringify(val))
  } catch (err) {
    console.error(err)
  }
})

app.get("/api/data", function (req, res, next) {
  res.sendFile(`${__dirname}/data/data.json`)
})

app.get("/", function (req, res, next) {
  res.sendFile(`${__dirname}/public/index.html`)
})

export default app
