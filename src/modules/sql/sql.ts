import mysql from "mysql";

class sql {
  private pool = this.conntentToSqlDataBase();

  private conntentToSqlDataBase() {
    const details = {
      host: "91.211.247.59",
      user: "discord",
      password: "cHiRMSudhpzdeeAzF4taBxlaDdo6NAip",
      port: 3307,
      database: "lounge",
      charset: "utf8mb4_unicode_ci",
      connectionLimit: 100,
    };

    return mysql.createPool(details);
  }

  public async getMember(q: any, v: any): Promise<any[]> {
    let stacktrace = new Error();
    return new Promise((res, rej) => {
      this.pool.query(q, v, (err, data) => {
        //console.log(stacktrace);
        if (err) {
          console.log(`ERROR CONECTING TO DV O.o`);
          //this.logger.error(Object.assign(err,{fullTrace:stacktrace}));
          return rej(err);
        } else res(data);
      });
    });
  }
}

export default sql;
