import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cron from "node-cron"
import moment from "moment"
import fetch from "node-fetch"
import fs from "fs"

import { fileURLToPath } from "url"

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/all.json")))
app.use(express.static(path.join(__dirname, "public/y.json")))
app.use(express.static(path.join(__dirname, "public/m.json")))
app.use(express.static(path.join(__dirname, "public/w.json")))
app.use(express.static(path.join(__dirname, "public/d.json")))

const getCurrentPrice = async () => {
  try {
    const response = await fetch(
      // eslint-disable-next-line max-len
      "https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd"
    )
    const { kaspa } = await response.json()
    return kaspa.usd
  } catch (error) {
    console.log(error)
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
    console.log(error)
    console.error(error)
    return []
  }
}

const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

cron.schedule("*/2 * * * *", async () => {
  console.log("---------------------")
  console.log("Data Refresh Occured.")
  console.log("Refreshing data again in one minute.")
  const dataALL = await getGraphData("ALL")
  try {
    fs.writeFileSync("./src/public/all.json", JSON.stringify(dataALL))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  // sleep(30)
  const data1D = await getGraphData("1D")
  try {
    fs.writeFileSync("./src/public/d.json", JSON.stringify(data1D))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  const data1Y = await getGraphData("1Y")
  try {
    fs.writeFileSync("./src/public/y.json", JSON.stringify(data1Y))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  // sleep(30)
  const data1M = await getGraphData("1M")
  try {
    fs.writeFileSync("./src/public/m.json", JSON.stringify(data1M))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  const data1W = await getGraphData("1W")
  try {
    fs.writeFileSync("./src/public/w.json", JSON.stringify(data1W))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
})

app.get("/api/data", async (req, res, next) => {
  const dataALL = JSON.parse(fs.readFileSync("./src/public/all.json"))
  const data1Y = JSON.parse(fs.readFileSync("./src/public/y.json"))
  const data1M = JSON.parse(fs.readFileSync("./src/public/m.json"))
  const data1W = JSON.parse(fs.readFileSync("./src/public/w.json"))
  const data1D = JSON.parse(fs.readFileSync("./src/public/d.json"))

  res.json({
    dataALL,
    data1Y,
    data1M,
    data1W,
    data1D,
  })
})

app.get("/*", function (req, res, next) {
  res.sendFile(`./src/public/index.html`)
})

export default app
