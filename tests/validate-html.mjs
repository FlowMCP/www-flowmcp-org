import { readFileSync } from 'fs'
import { parse } from 'node-html-parser'

function validateHTML() {
    console.log('Validating HTML structure...')
    
    try {
        const htmlContent = readFileSync('./index.html', 'utf8')
        const root = parse(htmlContent)
        
        // Basic HTML structure validation
        const html = root.querySelector('html')
        const head = root.querySelector('head')
        const body = root.querySelector('body')
        
        if (!html) throw new Error('Missing <html> tag')
        if (!head) throw new Error('Missing <head> tag')
        if (!body) throw new Error('Missing <body> tag')
        
        // Check for title
        const title = root.querySelector('title')
        if (!title) throw new Error('Missing <title> tag')
        
        // Check for meta charset
        const charset = root.querySelector('meta[charset]')
        if (!charset) throw new Error('Missing charset meta tag')
        
        // Check for viewport meta
        const viewport = root.querySelector('meta[name="viewport"]')
        if (!viewport) throw new Error('Missing viewport meta tag')
        
        // Check main containers exist
        const container = root.querySelector('.container')
        if (!container) throw new Error('Missing main container')
        
        const header = root.querySelector('.sticky-header')
        if (!header) throw new Error('Missing header section')
        
        console.log('✅ HTML validation passed')
        return true
        
    } catch (error) {
        console.error('❌ HTML validation failed:', error.message)
        process.exit(1)
    }
}

validateHTML()