import { SchemaImporter } from 'schemaimporter'
import fs from 'fs'

const arrayOfSchemas = await SchemaImporter
    .loadFromFolder( {
        'schemaRootFolder': "./../schemas/v1.2.0/",
        'excludeSchemasWithImports': true,
        'excludeSchemasWithRequiredServerParams': false,
        'addAdditionalMetaData': false,
        'outputType': 'onlySchema'
    } )
console.log( arrayOfSchemas[ 0 ] )
/*
        "name": "api/v1/products",
        "description": "Product catalog - Management of products, categories and search functions",
        "requiresCredential": false,
        "credentialKey": null,
        "routes
*/

const routesAsObject = arrayOfSchemas
    .map( ( { namespace, description, requiredServerParams, routes: _routes } ) => {
        const name = namespace
        const requiresCredential = requiredServerParams?.length > 0
        const routes = Object.keys( _routes )
        return { name, description, requiresCredential, routes }
    } )
    .reduce( ( acc, { name, description, requiresCredential, routes } ) => {
        if( !Object.hasOwn( acc, name ) ) {
            acc[ name ] = {
                name,
                description,
                requiresCredential,
                routes: []
            }
        }
        acc[ name ]['routes'].push( ...routes )
        return acc
    }, {} )

const routes = Object
    .entries( routesAsObject )
    .map( ( [ name, { description, requiresCredential, routes } ] ) => {
        return {
            name,
            description,
            requiresCredential,
            routes: routes.sort()
        }
    } )



fs.writeFileSync( 'routes.json', JSON.stringify( routes, null, 2 ), 'utf8' )