import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: Number(process.env.PORT_DATABASE_CONNECTION),
    dialect: 'mysql',
    dialectOptions: {
        ssl: process.env.SSL === 'REQUIRED' ? { rejectUnauthorized: false } : false
    }
});

interface UEAttributes {
    email_comercial: string;
    senha: string;
    razao_social: string;
    cnpj: string;
    cep?: string;
    logradouro?: string;
    bairro?: string;
    municipio?: string;
    suplemento?: string;
    numero_contato?: string;
    api_key?: string;
}

interface UECreationAttributes extends Optional<UEAttributes, 'email_comercial'> {}

class UE extends Model<UEAttributes, UECreationAttributes> implements UEAttributes {
    public email_comercial!: string;
    public senha!: string;
    public razao_social!: string;
    public cnpj!: string;
    public cep?: string;
    public logradouro?: string;
    public bairro?: string;
    public municipio?: string;
    public suplemento?: string;
    public numero_contato?: string;
    public api_key?: string;
}

UE.init(
    {
        email_comercial: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        razao_social: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        cnpj: {
            type: DataTypes.CHAR(18),
            allowNull: false,
            unique: true
        },
        cep: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        logradouro: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        bairro: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        municipio: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        suplemento: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        numero_contato: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        api_key: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'UE',
        tableName: 'usuarios_empresariais',
        timestamps: false
    }
);

export default UE;
