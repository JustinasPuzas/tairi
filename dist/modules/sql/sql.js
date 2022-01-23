"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
class sql {
    constructor() {
        this.pool = this.conntentToSqlDataBase();
    }
    conntentToSqlDataBase() {
        const details = {
            host: "91.211.247.59",
            user: "discord",
            password: "cHiRMSudhpzdeeAzF4taBxlaDdo6NAip",
            port: 3307,
            database: "lounge",
            charset: "utf8mb4_unicode_ci",
            connectionLimit: 100,
        };
        return mysql_1.default.createPool(details);
    }
    getMember(q, v) {
        return __awaiter(this, void 0, void 0, function* () {
            let stacktrace = new Error();
            return new Promise((res, rej) => {
                this.pool.query(q, v, (err, data) => {
                    //console.log(stacktrace);
                    if (err) {
                        console.log(`ERROR CONECTING TO DV O.o`);
                        //this.logger.error(Object.assign(err,{fullTrace:stacktrace}));
                        return rej(err);
                    }
                    else
                        res(data);
                });
            });
        });
    }
}
exports.default = sql;
