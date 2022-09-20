import EthDater from 'ethereum-block-by-date';
import {ethers} from 'ethers';
import fetch from "node-fetch";
import express from 'express'
import moment from 'moment'
import cors from 'cors'

const app = express();
app.use(cors());
const port = 8000


const provider = new ethers.providers.CloudflareProvider();
const dater = new EthDater(
    provider // Ethers provider, required.
);


//convert start and end date to block indexes
export async function dateToBlock(startDate, endDate)
{
    let startBlock = await dater.getDate(
        `${startDate}`, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        false, // Block after, optional. Search for the nearest block before or after the given date. By default true.
        false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    ); 

    let endBlock = await dater.getDate(
        `${endDate}`,
        false,
        false
    ); 
    return [
        startBlock.block.toString(16),
        endBlock.block.toString(16)];
}

let transactions = [];
let idx = 0

export async function getTransactions(contractAddress,startBlock,endBlock,pageKey){
    let options;
    //console.log("Iteration number: ", idx)
    idx += 1;
    if(pageKey){
            //console.log("Pagekey detected: ", pageKey)
            options = {
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: 1,
              jsonrpc: '2.0',
              method: 'alchemy_getAssetTransfers',
              params: [
                {
                  fromBlock: `0x0`,
                  toBlock: `0x${endBlock}`,
                  withMetadata: false,
                  excludeZeroValue: false,
                  maxCount: '0x3e8',
                  category: ['erc721'],
                  contractAddresses: [`${contractAddress}`],
                  pageKey:pageKey           
                }
              ]
            })
          }
    }
    else{   
            //console.log("Pagekey WAS NOT detected: ", pageKey)
            options = {
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: 1,
              jsonrpc: '2.0',
              method: 'alchemy_getAssetTransfers',
              params: [
                {
                  fromBlock: `0x0`,
                  toBlock: `0x${endBlock}`,
                  withMetadata: false,
                  excludeZeroValue: false,
                  maxCount: '0x3e8',
                  category: ['erc721'],
                  contractAddresses: [`${contractAddress}`],
                }
              ]
            })
          }
    }
    
      
        //yes, heres our api key. Don't care, wont use it anymore - have fun, but pls use it just for hodler testing
        return await fetch('https://eth-mainnet.g.alchemy.com/v2/pzc0ZSMrsYIYMm-_4awwAXrJRnTh0_Tn', options)
        .then(response => response.json())
        .then(async response => {
            for(let i=0; i<response.result.transfers.length; i++)
            {
                let tx = response.result.transfers[i];
                let block = tx.blockNum;
                let from = tx.from;
                let to = tx.to;
                let id = tx.tokenId;
                let hash = tx.hash;
                let transaction = {
                    block: parseInt(tx.blockNum),
                    from: tx.from,
                    to: tx.to,
                    id: parseInt(tx.tokenId)
                }
                transactions.push(transaction)
            }
            if (response.result.pageKey)
            {
                return await getTransactions(contractAddress,startBlock,endBlock,response.result.pageKey);
                //console.log(ret);
            }

            if (!response.result.pageKey && !(idx==0))
            {
                const transactonsJson = JSON.stringify(transactions);
                transactions=[];
                
                /*exporting to json for debugging purposes kek
                fs.writeFile('./transactions.json', transactonsJson, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
                })
                */
                let start = Number(transactonsJson.slice(10,18));
                return getLeaderboard(transactonsJson, start, parseInt(`0x${endBlock}`));
            }
        })
        .catch(err => console.error(err));
}


export function getLeaderboard(data1, userStartDate, userEndDate) {
    
    //mapping (address => StakeObject)
    let addressToPoints = new Map();
    //array of all tokens
    let tokens = [];
    const data = JSON.parse(data1);

    let updatedPoints;
    let updatedTokenVolumeCount;

    //iterate through transactions and assign each holder
    for(let i=0; i<data.length; i++)
    {
        let fromAddress = data[i].from;
        let toAddress = data[i].to;
        let tokenId = data[i].id;
        let blockNumber = data[i].block; 
        
        //user does not care about further records
        if(blockNumber > userEndDate) break;

        //mint
        if(fromAddress == "0x0000000000000000000000000000000000000000")
        {
            tokens[tokenId] = {
                tokenId: tokenId,
                startDate: blockNumber,
                endDate: null,
                holderAddress: toAddress,
            }
        }
        //transfer
        else 
        {
            //eliminate situation where user selected range that entirely falls out of 
            //transacion history for given contract
            if(!(((userStartDate < data[0].block && userEndDate < data[0].block) || (userStartDate > data[data.length-1].block && userEndDate > data[data.length-1].block))))
            {
                if(tokens[tokenId].startDate < userStartDate) tokens[tokenId].startDate = userStartDate; 
                tokens[tokenId].endDate = blockNumber;
                //get user stats
                if(!(userStartDate > blockNumber))
                {
                    let currStats = addressToPoints.get(fromAddress);
                    if(!currStats) //first run
                    {
                        updatedPoints = (tokens[tokenId].endDate - tokens[tokenId].startDate) * 0.01;
                        //update total ammount of tokens that user had in this timeframe
                        updatedTokenVolumeCount = 1;
                    }
                    else
                    {
                        //update points
                        updatedPoints = currStats.points + ((tokens[tokenId].endDate - tokens[tokenId].startDate) * 0.01);
                        //update total ammount of tokens that user had in this timeframe
                        updatedTokenVolumeCount = currStats.tokenVolumeCount + 1;
                    }
                    //update holder hot streak
                    let updatedStreak = tokens[tokenId].endDate - tokens[tokenId].startDate;
                    if(currStats && updatedStreak < currStats.hotStreak) updatedStreak = currStats.hotStreak;
                    
                    //assign new stats
                    addressToPoints.set(fromAddress, {
                        points: updatedPoints,
                        tokenVolumeCount: updatedTokenVolumeCount,
                        hotStreak: updatedStreak
                    });
                }
                
            }    
            

            //set new owner of stake
            tokens[tokenId].startDate = blockNumber;
            tokens[tokenId].endDate = null;
            tokens[tokenId].holderAddress = toAddress;

        }
    }
    
    //iterate through all tokens in order to set final dates for user's endDate and assign missing points
    for(let j=0; j<tokens.length; j++)
    {
        //console.log(tokens[j]);
        if(tokens[j].endDate == null)
        {
            if(tokens[j].startDate < userStartDate) tokens[j].startDate = userStartDate;
            tokens[j].endDate = userEndDate;
            //get user stats
            let currStats = addressToPoints.get(tokens[j].holderAddress);
            
            if(!currStats) //first run
            {
                updatedPoints = (tokens[j].endDate - tokens[j].startDate) * 0.01;
                //update total ammount of tokens that user had in this timeframe
                updatedTokenVolumeCount = 1;
            }
            else
            {
                //update points
                updatedPoints = currStats.points + ((tokens[j].endDate - tokens[j].startDate) * 0.01);
                //update total ammount of tokens that user had in this timeframe
                updatedTokenVolumeCount = currStats.tokenVolumeCount + 1;
            }

            //update holder hot streak
            let updatedStreak = tokens[j].endDate - tokens[j].startDate;
            if(currStats && updatedStreak < currStats.hotStreak) updatedStreak = currStats.hotStreak;

            //assign new stats
            addressToPoints.set(tokens[j].holderAddress, {
                points: updatedPoints,
                tokenVolumeCount: updatedTokenVolumeCount,
                hotStreak: updatedStreak
            });
        }
    }
    let tableData = []; 
    addressToPoints.forEach((key, value) => {
        key.points = Math.round(key.points * 100) / 100
        key.hotStreak = Math.round(((key.hotStreak * 14)/60/60/24 * 100))/100 
        tableData.push({
            id: value,
            points: key.points,
            tokenVolumeCount: key.tokenVolumeCount,
            hotStreak: key.hotStreak
        })
    })

    return tableData;
}

export async function chainReaderMain(_startDate, _endDate, _contractAddress){
    const startDate = moment(_startDate);
    const endDate = moment(_endDate);
    const [startBlock, endBlock] = await dateToBlock(startDate, endDate);
    //const contractAddress = "0x00b784c0e9dd20fc865f89d05d0ce4417efb77a9";
    const contractAddress = _contractAddress;
    const txs = await getTransactions(contractAddress,startBlock,endBlock,false);
    return txs;
}

app.get('/getHodlers', async (req, res) => {
    const data = req.query;
    
    const response = await chainReaderMain(data.startDate, data.endDate, data.contractAddress);
    res.send({hodlers: response});
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
