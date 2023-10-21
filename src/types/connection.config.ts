export interface ConnectionConfig {
	/**
     * The Database user to authenticate as
     */
    user?: string | undefined;

    /**
     * The Database of that MySQL user
     */
    password?: string | undefined;

    /**
     * The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci).
     * If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used.
     * (Default: 'UTF8_GENERAL_CI')
     */
    charset?: string | undefined;

    /**
     * Number of milliseconds
     */
    timeout?: number | undefined;


	/**
	 * database host
	 */
	host?: string | undefined;

	/**
	 * database port
	 * (Default: 3306)
	 */
	port?: number | undefined;

	/**
	 * database type
	 * /
	 * type?: string | undefined;
	 */
	dbType?: string | 'mysql' | 'mariadb' | 'postgres' | 'mssql' | undefined;


    /**
     * schema name 
     */
    scheme?: string | undefined;
}