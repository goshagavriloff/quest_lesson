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
      const query=`SELECT to_regclass('${this.db}.public.${this.tableName}');`;
      return await this.queryIsNull(query);
    }

    private async queryIsNull(query:string): Promise<boolean> {
      const client:PoolClient=await pgPool.connect();
 
      const res:QueryResult<any>=await client.query(query);
      await client.release();
      var result=null;
      if (res.rows!=undefined){
        result=res.rows[0];
      }
      
      return (result!==null)&&(result!==undefined);

    }

    private async createTable(): Promise<any> {
        // todo
        // create sql query (foreach col=>type in cols) 
        // create SEQUENCE for id    
        // create relationships (oneToMany/BelongsToOne)     
        //
    }

    public async ensureTableExists(): Promise<void> {
        if (this.tableExistsFlag === false) {
          if (!(await this.tableExists())) {
            console.log(`Creating ${this.tableName} table`);
            await this.createTable();
            console.log(`Table ${this.tableName} created`);
          }
          this.tableExistsFlag = true;
          
        }
    }
    
    public async recordExistsById(id:number): Promise<boolean> {    
      const query=`SELECT id from ${this.db}.public.${this.tableName} where id=${id};`;

      return await this.queryIsNull(query);
    } 

}