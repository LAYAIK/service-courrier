// src/config/sequelizeInstance.js

import { Sequelize } from 'sequelize';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', 'config', 'config.json');

// Check if the config file exists
if (!fs.existsSync(configPath)) {
    console.error(`Error: config.json not found at ${configPath}`);
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))[env];

let sequelize;

if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: config.dialect,
            port: config.port,
            logging: config.logging ? console.log : false,
            dialectOptions: {
                ssl: config.ssl ? {
                    require: config.dialectOptions?.ssl?.require ?? true,
                    rejectUnauthorized: config.dialectOptions?.ssl?.rejectUnauthorized ?? false,
                } : false,
            }
        }
    );
}

export default sequelize;