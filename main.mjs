
import { SchemaImporter } from 'schemaimporter'
import { Generator } from './src/index.mjs'

import fs from 'fs'


const arrayOfSchemas = await SchemaImporter
    .loadFromFolder( {
        'schemaRootFolder': "./../schemas/v1.2.0/",
        'excludeSchemasWithImports': true,
        'excludeSchemasWithRequiredServerParams': false,
        'addAdditionalMetaData': false,
        'outputType': 'onlySchema'
    } )

const { routes } = Generator.generateRoutes( { arrayOfSchemas } )
console.log( routes )


fs.writeFileSync(  'routes2.json', JSON.stringify( routes, null, 4 ), 'utf8' )