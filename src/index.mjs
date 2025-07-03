import fs from 'fs'


/*
    {
        "name": "alternative",
        "description": "Fetches and analyzes the Crypto Fear & Greed Index from alternative.me.",
        "requiresCredentials": [ "ABC" ],
        "routes": [
            {
                "name": "analyzeFngTrend",
                "description": "...",
                "categories": [ "analysis" ]
            }
        ]
  }
*/


class Generator {
    static generateRoutes( { arrayOfSchemas } ) {
        const routes = arrayOfSchemas
            .map( ( schema ) => Generator.#generateRoute( { schema } ) )
        return { routes }
    }


    static mergeRoutes( { routes } ) {
        const mergedRoutes = Object.values( routes
                .reduce( ( acc, { namespace, name, description, requiredCredentials, routes } ) => {
                    if( !Object.hasOwn( acc, namespace ) ) {
                        acc[ namespace ] = {
                            namespace,
                            name,
                            description,
                            requiredCredentials,
                            routes: []
                        }
                    }
                    acc[ namespace ].routes.push( ...routes )
                    acc[ namespace ]['requiredCredentials'] = [
                        ...new Set( [
                            ...acc[ namespace ].requiredCredentials,
                            ...requiredCredentials
                        ] )
                    ]
                    return acc
                }, {} )
        )

        return { mergedRoutes }
    }


    static generateCategories( { routes } ) {
        const all = routes
            .reduce( ( acc, { routes } ) => {
                routes
                    .forEach( ( { categories } ) => {
                        categories
                            .forEach( ( category ) => {
                                if( !acc.includes( category ) ) {
                                    acc.push( category )
                                }
                            } )
                    } )
                return acc
            }, [] )
            .sort()
        const categories = all
            .map( ( categoryId ) => {
                const [ name, network ] = categoryId
                    .split( '_' )
                    .map( ( part ) => part[ 0 ].toUpperCase() + part.slice( 1 ).toLowerCase() )
                const count = routes
                    .reduce( ( acc, { routes } ) => {
                        acc += routes
                            .reduce( ( acc, { categories } ) => {
                                if( categories.includes( categoryId ) ) {
                                    return acc + 1
                                }
                                return acc
                            }, 0 )

                        return acc
                    }, 0 )

                return { categoryId, name, network, count }
            } )

        return { categories }
    }


    static #generateRoute( { schema } ) {
        const { name, namespace, description, requiredServerParams, routes: _routes } = schema
        const routes = Object
            .entries( _routes )
            .map( ( [ routeName, { description: _description, parameters } ] ) => {
                const name = routeName
                const description = _description
                const text = JSON.stringify( parameters )
                const categories = Generator.#findCategories( { text } )
                return { name, description, categories }
            } )
        const requiredCredentials = requiredServerParams
        const result = { namespace, name, description, requiredCredentials, routes }

        return result
    }


    static #findCategories( { text } ) {
        const regex = /(?<=[\s,(])([A-Z]+_[A-Z]+)(?=[\s,)\n])/g
        const matches = [ ...text.matchAll( regex ) ]
        return matches.map( ( match ) => match[ 1 ] ) 
    }
}


export { Generator }