import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cron from "node-cron"
import moment from "moment"
import fetch from "node-fetch"
import fs from "fs"
import JSONdb from "simple-json-db"

const env = process.env.NODE_ENV
import { fileURLToPath } from "url"

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, "public")))

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

  let arrayOfObjects = []

  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${timeValue}&to=${moment().unix()}`
    console.log(url)
    const response = await fetch(url)
    const { prices } = await response.json()
    arrayOfObjects = prices?.map((x) => ({
      date: x[0],
      value: x[1],
    }))
    return arrayOfObjects
  } catch (error) {
    console.log(error)
    console.error(error)
    return []
  }
}

const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

cron.schedule("*/1 * * * *", async () => {
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
  // sleep(30)
  const data1D = await getGraphData("1D")
  try {
    db.set("data1D", JSON.stringify(data1D))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  const data1Y = await getGraphData("1Y")
  try {
    db.set("data1Y", JSON.stringify(data1Y))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  // sleep(30)
  const data1M = await getGraphData("1M")
  try {
    db.set("data1M", JSON.stringify(data1M))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  const data1W = await getGraphData("1W")
  try {
    db.set("data1W", JSON.stringify(data1W))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
})

app.get("/api/data", async (req, res, next) => {
  const dataALL = JSON.parse(db.get("dataALL"))
  const data1Y = JSON.parse(db.get("data1Y"))
  const data1M = JSON.parse(db.get("data1M"))
  const data1W = JSON.parse(db.get("data1W"))
  const data1D = JSON.parse(db.get("data1D"))

  res.json({
    dataALL,
    data1Y,
    data1M,
    data1W,
    data1D,
  })
})

app.get("/*", function (req, res, next) {
  res.sendFile(__dirname + "/index.html")
})

export default app
