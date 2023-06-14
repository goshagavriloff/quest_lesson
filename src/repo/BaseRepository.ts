import { PoolClient, QueryResult } from 'pg';
import {pgPool,pgConfig} from '../config/database';

export abstract class BaseRepository {
    private tableExistsFlag: boolean = false;
    protected tableName: string;
    protected db:string;

    constructor(tableName:string) {
        this.db=pgConfig.database||"";
        this.tableName =tableName;

    }
    private async tableExists(): Promise<boolean> {
        const client:PoolClient=await pgPool.connect();
 
        const res:QueryResult<any>=await client.query(`SELECT to_regclass('${this.db}.public.${this.tableName}');`);
        
        await client.release();
        const {to_regclass}=res.rows[0];
        
        return (to_regclass!==null);
    }
    private async createTable(): Promise<any> {
        // todo
        // create sql query (foreach col=>type in cols) 
        // create SEQUENCE for id    
        // create relationships (oneToMany/BelongsToOne)     
        //
    }

    public async ensureTableExists(): Promise<any> {
        if (this.tableExistsFlag === false) {
          if (!(await this.tableExists())) {
            console.log(`Creating ${this.tableName} table`);
            await this.createTable();
            console.log(`Table ${this.tableName} created`);
          }
          this.tableExistsFlag = true;
          
        }
      }
      

}