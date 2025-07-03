
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

const { routes } = Generator
    .generateRoutes( { arrayOfSchemas } )
const { mergedRoutes } = Generator
    .mergeRoutes( { routes } )

const { categories } = Generator
    .generateCategories( { routes:  mergedRoutes } )
const result = { categories, routes: mergedRoutes }


fs.writeFileSync( 
    'routes-v2.json', 
    JSON.stringify( result, null, 4 ), 
    'utf8' 
)