import axios from 'axios';
import EthDater from 'ethereum-block-by-date';
import {ethers} from 'ethers';

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

    return{
        first: startBlock,
        second: endBlock
    };
}


//get contract erc721 transactions
export function getTransactions(contractAddress, startDate, endDate){
    
    //convert dates to blocks
    
    let data = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 0,
    "method": "alchemy_getAssetTransfers",
    "params": [
    {
        "fromBlock": `${startBlock}`,
        "toBlock": `${endBlock}`,
        "contractAddresses": `${contractAddress}`,
        category: ["erc721"],
    }
    ]
    });

    var requestOptions = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: data,
    };

    const apiKey = "demo"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
    const axiosURL = `${baseURL}`;

    axios(axiosURL, requestOptions)
    .then(response => console.log(JSON.stringify(response.data, null, 2)))
    .catch(error => console.log(error));
}


export function getLeaderboard(data) {
    
    let hodlers = new Map();
    let hodlersAssets = new Map();

    
    /*
    hodlers (address => hodlerAssets)
    hodlersAssets (tokenId => Stake)
    Stake
    {
       tokenId
       startDate
       endDate 
    }
    */
    //iterate through transactions and assign each holder
    for(let i=0; i<data.result.transfers.length; i++)
    {
        let fromAddress = data.result.transfers.from;
        let toAddress = data.result.transfers.to;
        let tokenId = data.result.transfers.tokenId;
        let blockNumber = data.result.transfers.blockNum;
        //mint
        if(fromAddress == "0x0000000000000000000000000000000000000000")
        {
            
            hodlers.set(toAddress, )
        }
    }
}


function chainReaderMain(){
    const [state, setState] = useContext(Context);  

    //const {startBlock, endBlock} = dateToBlock("INPUTY TUTAJ POPROSZE DATY")

    getTransactions(contractAddress,startBlock, endBlock);
    
}

chainReaderMain();