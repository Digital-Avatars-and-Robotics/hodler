## Quick start

after downloading the hodler project folder, open terminal inside hodler folder and install required packages with command:
npm i

move to ./src/backend and run the server with command:
node chainReader.js

open another terminal inside hodler folder and run application with command:
npm start

do not mess up the order of commands - the application will not work properly without serwer running in the background in seperate terminal

youtube demo: https://youtu.be/Kt2IZECubxE

## Inspiration
We've noticed that rewarding community members, especially token holders, might be difficult for NFT collections creators. Either they have to create an nft staking contract, or gather a snapshot of specified block. Both of these approaches have their disadvantages:

- deploying a staking contract requires some amount of devpower, which could be definitely
used in more desirable way. It requires community members to make an on-chain action. NFT creators also lose an element of surprise, since everybody knows that if a staking contract walks in, there will be a reward in the future.

- taking a snapshot migh be unfair, as people who hold their assets briefly are rewarded equally to people who hold tokens for a very long period of time (and that's very rude). If you were holding a token for 1 year straight, but made a quick swap lasting 15 minutes, and meanwhile snapshot occoured - you're completely rekt. 

But Hodler comes with simple solution.

## What it does

Hodler is a web app simplifying process of gathering addresses of your token holders. Instead of taking snapshots or deploying staking contracts - gather leaderboard of holders based on erc-721 tokens holded for each block in specified timeframe.

It gets rid of a poor UX and technical complexity of staking contracts (from a user POV), while allowing creators to reward their community, in a fun, surprising way.

## How we built it
We've implemented the core algorithms in node.js with usage of alchemy api to access all transfer transactions inside specified smart contract. We've made such API requests based on user inputs - contract address, and a time range to consider during creating a hodlers leaderboard. We add 0.01 score point to wallet addres, for each block that he holds an NFT.

## What's next for Hodler
We are planning to fully deploy our application on web, so it could be accessible for any user without complex configuration and much less client-side operations. 
