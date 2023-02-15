import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import { AppDataSource } from "./data-source";
import { WinnerDto } from "./dto/WinnerDto";
import { Balance } from "./entity/Balance";
import { BalanceService } from "./service/BalanceService";
import { WinnerService } from "./service/WinnerService";

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    let jackpot = 0;
    const startBalance = parseInt(process.env.START_BALANCE || "0");
    const bet = parseInt(process.env.BET || "10");
    const balanceService = new BalanceService();
    const winnerService = new WinnerService();

    io.on("connection", (socket) => {
      socket.on("bet", async (userId, callback) => {
        const balanceEntity = await balanceService.one(userId);
        if (!balanceEntity) {
          callback({
            ok: false,
            balance: 0,
          });
          return;
        }
        if (balanceEntity.balance - bet < 0) {
          callback({
            ok: false,
            balance: balanceEntity.balance,
          });
          return;
        }

        balanceEntity.balance -= bet;
        await balanceService.save(balanceEntity);
        jackpot += bet;
        io.emit("jackpot", jackpot);
        callback({
          ok: true,
          balance: balanceEntity.balance,
        });
      });

      socket.on("winner", async (dto: WinnerDto) => {
        let balanceEntity = await balanceService.one(dto.userId);
        if (!balanceEntity) {
          return;
        }

        const winner = await winnerService.save(dto);
        io.emit("winner", winner);

        if (dto.prize.toLocaleLowerCase() === "jackpot") {
          balanceEntity.balance += jackpot;
          jackpot = 0;
          io.emit("jackpot", jackpot);
          balanceEntity = await balanceService.save(balanceEntity);
          io.emit("balance", balanceEntity.balance);
          return;
        }

        if (parseInt(dto.prize)) {
          balanceEntity.balance += +dto.prize;
          balanceEntity = await balanceService.save(balanceEntity);
          io.emit("balance", balanceEntity.balance);
        }
      });

      socket.on("jackpot:init", (callback) => {
        callback({
          jackpot,
        });
      });

      socket.on("balance:init", async (userId, callback) => {
        let balanceEntity = await balanceService.one(userId);
        if (!balanceEntity) {
          balanceEntity = new Balance(userId, startBalance);
          await balanceService.save(balanceEntity);
        }

        callback({ balance: balanceEntity.balance });
      });

      socket.on("winners:init", async (callback) => {
        const winners = await winnerService.all();
        callback({ winners });
      });
    });

    server.listen(3000, () => {
      console.log("Express server has started on http://localhost:3000");
    });
  })
  .catch((error) => console.log(error));
