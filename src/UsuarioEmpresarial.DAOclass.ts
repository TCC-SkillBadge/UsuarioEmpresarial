import dotenv from 'dotenv'
import { Sequelize, DataTypes, Model } from "sequelize"

dotenv.config()
const { HOST, USER, PASSWORD, DATABASE, PORT_DATABASE_CONNECTION, SSL } = process.env

const sequelize = new Sequelize({
    database: DATABASE,
    username: USER,
    password: PASSWORD,
    host: HOST,
    port: +PORT_DATABASE_CONNECTION!,
    ssl: SSL === 'REQUIRED' ? true : false,
    dialect: 'mysql'
})

export default class UE extends Model {}

UE.init(
    {
        email_comercial:{
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        senha:{
            type: DataTypes.STRING,
            allowNull: false
        },
        razao_social:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        cnpj:{
            type: DataTypes.CHAR(18),
            allowNull: false,
            unique: true
        },
        cep:{
            type: DataTypes.CHAR(9),
            allowNull: true,
        },
        logradouro:{
            type: DataTypes.STRING(150),
            allowNull: true
        },
        bairro:{
            type: DataTypes.STRING(100),
            allowNull: true
        },
        municipio:{
            type: DataTypes.STRING(100),
            allowNull: true
        },
        suplemento:{
            type: DataTypes.STRING(200),
            allowNull: true
        },
        numero_contato: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'UE',
        tableName: 'usuarios_empresariais',
        timestamps: false
    }
)