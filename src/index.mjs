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