import axios from 'axios';
import EthDater from 'ethereum-block-by-date';
import {ethers} from 'ethers';
import fetch from "node-fetch";
import moment from 'moment'

import React, {useContext} from 'react';
import { Context } from '../helper/Store'

import fs from 'fs';

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
                  fromBlock: `0x${startBlock}`,
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
                  fromBlock: `0x${startBlock}`,
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
    
      
      //uwaga  tukurwa nizej jest api key
        return await fetch('https://eth-mainnet.alchemyapi.io/v2/_ER-hutXkuR_WSDdqYb7AaHwJCLrlYBs', options)
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
                
                /*exporting to json for debugging purposes kek
                fs.writeFile('./transactions.json', transactonsJson, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
                })
                */
                return getLeaderboard(transactonsJson, parseInt(`0x${startBlock}`), parseInt(`0x${endBlock}`));
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
            tokens[tokenId].endDate = blockNumber;
            if(tokens[tokenId].endDate >= userStartDate)
            {
                if(tokens[tokenId].startDate < userStartDate) tokens[tokenId].startDate = userStartDate; 
                tokens[tokenId].endDate = blockNumber;
                //get user stats
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

                //set new owner of stake
                tokens[tokenId].startDate = blockNumber;
                tokens[tokenId].endDate = null;
                tokens[tokenId].holderAddress = toAddress;
            }    
        }
    }
    //iterate through all tokens in order to set final dates for user's endDate and assign missing points
    for(let j=0; j<tokens.length; j++)
    {
        if(tokens[j].endDate == null)
        {
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
        tableData.push({
            id: value,
            points: key.points,
            tokenVolumeCount: key.tokenVolumeCount,
            hotStreak: key.hotStreak
        })
    })


    //console.log(tableData);
    return tableData;
}

export async function chainReaderMain(){
    const startDate = moment(new Date(2015,6,30));
    const endDate = moment(new Date(2022,8,4));
    const [startBlock, endBlock] = await dateToBlock(startDate, endDate);
    
    const contractAddress = "0x00b784c0e9dd20fc865f89d05d0ce4417efb77a9";
    const txs = await getTransactions(contractAddress,startBlock,endBlock,false);
    //console.log("GIIIIIITTT", txs, "GIIIIT")
}

chainReaderMain();