
declare module 'sqlite' {
  export interface Statement {
    readonly sql: string;
    readonly lastID: number;
    readonly changes: number;

    bind(): Promise<Statement>;
    bind(...params: any[]): Promise<Statement>;

    reset(): Promise<Statement>;

    finalize(): Promise<void>;

    run(): Promise<Statement>;
    run(...params: any[]): Promise<Statement>;

    get(): Promise<any>;
    get(...params: any[]): Promise<any>;

    all(): Promise<any[]>;
    all(...params: any[]): Promise<any[]>;

    each(callback?: (err: Error, row: any) => void): Promise<number>;
    each(...params: any[]): Promise<number>;
  }

  export interface Database {
    close(): Promise<void>;

    run(sql: string): Promise<Statement>;
    run(sql: string, ...params: any[]): Promise<Statement>;

    get(sql: string): Promise<any>;
    get(sql: string, ...params: any[]): Promise<any>;

    all(sql: string): Promise<any[]>;
    all(sql: string, ...params: any[]): Promise<any[]>;

    exec(sql: string): Promise<Database>;

    each(sql: string, callback?: (err: Error, row: any) => void): Promise<number>;
    each(sql: string, ...params: any[]): Promise<number>;

    prepare(sql: string): Promise<Statement>;
    prepare(sql: string, ...params: any[]): Promise<Statement>;

    migrate(options: { force?: boolean, table?: string, migrationsPath?: string }): Promise<Database>;
  }

  export function open(filename: string, options?: { mode?: number, verbose?: boolean, promise?: typeof Promise }): Promise<Database>;
}