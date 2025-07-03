# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for FlowMCP (MCP Server configuration tool) hosted at www.flowmcp.org. The site provides a English-language web interface for managing FlowMCP namespaces and routes with the following key features:

### Core Functionality
- **Namespace & Route Selection**: Users can select from a hierarchical list of API namespaces, each containing multiple routes
- **Flexible Selection Modes**: 
  - Disabled (AUS): No routes selected
  - Manual (MANUELL): Individual route selection within namespace
  - Enabled (AN): All routes in namespace selected
- **Real-time Configuration Generation**: All configuration files are automatically derived from user selections
- **Search Functionality**: Built-in search to filter namespaces by name
- **Visual Overview**: Clear display of selected routes organized by namespace with statistics

### Export & Sharing Features
- **Multiple Export Formats**: JSON export, clipboard copy, downloadable config files
- **MCP Server Config Generation**: Automatic generation of MCP server configuration with required credentials
- **URL-based Sharing**: Share complete configurations via encoded URL parameters
- **State Persistence**: Configuration state maintained in browser URL for easy sharing

## Architecture

- **Single-page application**: Built as a standalone HTML file with embedded CSS and JavaScript
- **Static hosting**: Configured for GitHub Pages with CNAME file
- **No build process**: Direct HTML/CSS/JS without compilation or bundling
- **State management**: Client-side JavaScript manages namespace and route selections
- **URL-based sharing**: Configuration state encoded in URL hash for sharing

## Development Commands

Since this is a static site with no build process:

- **Local development**: Open `index.html` directly in browser or use any static file server
- **Deployment**: Push to main branch (GitHub Pages auto-deploys)

## Key Technical Details

### User Interface
- **Language**: German UI with German variable names and comments
- **Responsive design**: Mobile-friendly CSS with media queries
- **Interactive Cards**: Each namespace displayed as a card with toggle controls
- **Live Statistics**: Real-time counters showing active namespaces and routes
- **Search Integration**: Instant filtering of namespaces as user types

### Data Management
- **Namespace Structure**: Hierarchical organization with routes grouped under namespaces
- **State Management**: Three-state system (disabled/manual/enabled) with automatic state detection
- **Credential Handling**: Automatic detection and inclusion of required API credentials
- **Route Organization**: Visual grouping by HTTP methods (GET, POST, PUT, DELETE)

### Configuration Generation
- **Automatic Derivation**: All config files generated automatically from user selections
- **MCP Server Format**: Generates complete MCP server configuration with args and environment variables
- **Export Options**: JSON files, clipboard text, and downloadable configurations
- **URL Encoding**: Base64-encoded configuration state for sharing via URL hash

## Files

- `index.html`: Complete single-page application
- `CNAME`: GitHub Pages domain configuration (www.flowmcp.org)