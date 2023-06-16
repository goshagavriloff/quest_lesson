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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_1 = require("../config/database");
class BaseRepository {
    constructor(tableName) {
        this.tableExistsFlag = false;
        this.db = database_1.pgConfig.database || "";
        this.tableName = tableName;
    }
    tableExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT to_regclass('${this.db}.public.${this.tableName}');`;
            return yield this.queryIsNotNull(query);
        });
    }
    getTableName() {
        return this.tableName;
    }
    queryIsNotNull(query, check_col = "to_regclass") {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.pgPool.connect();
            const res = yield client.query(query);
            yield client.release();
            var result = null;
            if (res.rows != undefined) {
                result = res.rows[0];
            }
            return (result !== null) && (result !== undefined) && (result[check_col] != null);
        });
    }
    createTable() {
        return __awaiter(this, void 0, void 0, function* () {
            // todo
            // create sql query (foreach col=>type in cols) 
            // create SEQUENCE for id    
            // create relationships (oneToMany/BelongsToOne)     
            //
        });
    }
    ensureTableExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tableExistsFlag === false) {
                if (!(yield this.tableExists())) {
                    console.log(`Creating ${this.tableName} table`);
                    yield this.createTable();
                    console.log(`Table ${this.tableName} created`);
                }
                this.tableExistsFlag = true;
            }
        });
    }
    recordExistsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id from ${this.db}.public.${this.tableName} where id=${id};`;
            return yield this.queryIsNotNull(query);
        });
    }
}
exports.BaseRepository = BaseRepository;
