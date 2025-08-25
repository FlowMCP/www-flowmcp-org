import { readFileSync } from 'fs'
import { parse } from 'node-html-parser'

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = []
        this.passed = 0
        this.failed = 0
    }
    
    test(name, fn) {
        this.tests.push({ name, fn })
    }
    
    async run() {
        console.log('Running tests...\n')
        
        for (const { name, fn } of this.tests) {
            try {
                await fn()
                console.log(`✅ ${name}`)
                this.passed++
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`)
                this.failed++
            }
        }
        
        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`)
        
        if (this.failed > 0) {
            process.exit(1)
        }
    }
    
    assertEquals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} Expected: ${expected}, Got: ${actual}`)
        }
    }
    
    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(message || 'Expected condition to be true')
        }
    }
}

// Load HTML content for testing
const htmlContent = readFileSync('./index.html', 'utf8')
const root = parse(htmlContent)

// Test runner instance
const runner = new TestRunner()

// HTML Structure Tests
runner.test('HTML has basic structure', () => {
    runner.assertTrue(root.querySelector('html'), 'HTML tag missing')
    runner.assertTrue(root.querySelector('head'), 'Head tag missing')
    runner.assertTrue(root.querySelector('body'), 'Body tag missing')
})

runner.test('HTML has required meta tags', () => {
    runner.assertTrue(root.querySelector('title'), 'Title tag missing')
    runner.assertTrue(root.querySelector('meta[charset]'), 'Charset meta missing')
    runner.assertTrue(root.querySelector('meta[name="viewport"]'), 'Viewport meta missing')
})

runner.test('Page has FlowMCP content', () => {
    const title = root.querySelector('title')
    runner.assertTrue(title && title.text.includes('FlowMCP'), 'Title should contain FlowMCP')
    
    const h1 = root.querySelector('h1')
    runner.assertTrue(h1 && h1.text.includes('FlowMCP'), 'H1 should contain FlowMCP')
})

runner.test('Navigation elements exist', () => {
    runner.assertTrue(root.querySelector('.sticky-header'), 'Header section missing')
    runner.assertTrue(root.querySelector('.container'), 'Main container missing')
})

runner.test('Interactive elements exist', () => {
    runner.assertTrue(root.querySelector('input[type="text"]'), 'Search input missing')
    const scriptContent = root.querySelector('script').innerHTML
    runner.assertTrue(scriptContent.includes('namespace-card'), 'Namespace card functionality missing')
})

runner.test('Export functionality elements exist', () => {
    runner.assertTrue(root.querySelector('.export-buttons'), 'Export buttons missing')
    runner.assertTrue(root.querySelector('button'), 'Buttons missing')
})

runner.test('Statistics elements exist', () => {
    const scriptContent = root.querySelector('script').innerHTML
    runner.assertTrue(scriptContent.includes('stats'), 'Statistics functionality missing')
    // Stats elements might be dynamically created, so we check the CSS
    const cssContent = root.querySelector('style').innerHTML
    runner.assertTrue(cssContent.includes('.stats-container'), 'Statistics container styles missing')
})

runner.test('JavaScript is embedded', () => {
    const scripts = root.querySelectorAll('script')
    runner.assertTrue(scripts.length > 0, 'No JavaScript found')
    
    // Check if main functionality is present in script content
    const scriptContent = scripts.map(s => s.innerHTML).join('')
    runner.assertTrue(scriptContent.includes('namespace'), 'Namespace functionality missing')
    runner.assertTrue(scriptContent.includes('route'), 'Route functionality missing')
})

runner.test('CSS is embedded', () => {
    const styles = root.querySelectorAll('style')
    runner.assertTrue(styles.length > 0, 'No CSS found')
    
    // Check if main styles are present
    const cssContent = styles.map(s => s.innerHTML).join('')
    runner.assertTrue(cssContent.includes('.container'), 'Container styles missing')
    runner.assertTrue(cssContent.includes('.namespace-card'), 'Card styles missing')
})

// JSON data validation
runner.test('Routes JSON data is valid', () => {
    try {
        const routesContent = readFileSync('./routes.json', 'utf8')
        const routes = JSON.parse(routesContent)
        
        runner.assertTrue(Array.isArray(routes), 'Routes should be an array')
        runner.assertTrue(routes.length > 0, 'Routes array should not be empty')
        
        // Check first route structure
        if (routes[0]) {
            runner.assertTrue(typeof routes[0].name === 'string', 'Route should have name')
            runner.assertTrue(Array.isArray(routes[0].routes), 'Route should have routes array')
            runner.assertTrue(typeof routes[0].description === 'string', 'Route should have description')
        }
        
    } catch (error) {
        throw new Error(`Routes JSON validation failed: ${error.message}`)
    }
})

// Run all tests
await runner.run()