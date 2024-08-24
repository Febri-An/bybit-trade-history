import { RestClientV5 } from "bybit-api"
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const apiKey = process.env.APIKEY
const secret = process.env.SECRET


const client = new RestClientV5({
    testnet: false,
    key: apiKey,
    secret: secret,
    recv_window: 10000
})

async function fetchData(startStamp, endStamp, day7 = 7 * 24 * 60 * 60 * 1000) {
    var content = []
    var currentStartStamp = startStamp
    while (currentStartStamp < endStamp) {
        let currentEndStamp = currentStartStamp + day7 // add 7 days

        if (currentEndStamp > endStamp) {
            currentEndStamp = endStamp
        }

        try {
            const response = await client.getExecutionList({
                category: 'spot',
                startTime: currentStartStamp,
                endTime: currentEndStamp,
                limit: 100
            })
            content.push(response.result.list)

        } catch (error) {
            console.error('Error fetching data:', error)
        }

        currentStartStamp = currentEndStamp
    }
    return content
}

async function runProcess(days, timezoneOffset) {
    const endStamp = Date.now() // current timestamp
    const startStamp = endStamp - (days * 24 * 60 * 60 * 1000) // timestamp 30 days ago
    try {
        const content = await fetchData(startStamp, endStamp)
        // combine and process data
        var join = content.flat()
        var result = join.map(item => {
            return {
                symbol: item.symbol,
                qty: Number(item.execQty),
                type: item.side,
                price: Number(item.execPrice),
                stamp: item.execTime
            }})

        var sorted = result.sort((a, b) => a.stamp - b.stamp)

        var formatted = sorted.map(item => { 
            let timestampNumber = Number(item.stamp)
            let dateWIB = new Date(timestampNumber + (timezoneOffset * 60 * 60 * 1000)) // UTC to WIB(UTC+7)

            // date format
            let day = String(dateWIB.getDate()).padStart(2, '0')
            let month = String(dateWIB.getMonth() + 1).padStart(2, '0')
            let year = dateWIB.getFullYear()

            // time format
            let hours = String(dateWIB.getHours()).padStart(2, '0')
            let minutes = String(dateWIB.getMinutes()).padStart(2, '0')
            let seconds = String(dateWIB.getSeconds()).padStart(2, '0')

            let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            return {
                ...item,
                stamp: formattedDate
            }
        })

        const dataToWrite = JSON.stringify(formatted, null, 2)
        fs.writeFileSync('data.txt', dataToWrite) // write data to data.txt 

        console.log('Data is successfully written to data.txt')
    } catch(error) {
        console.log('Error:', error)
    }
}

runProcess(30, 7)
