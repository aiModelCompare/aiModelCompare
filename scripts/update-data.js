#!/usr/bin/env node

/**
 * AI Model Price Data Updater
 * 
 * This script fetches the latest pricing data from various sources
 * and updates the data/models.json file.
 * 
 * For production use, you would integrate with:
 * - Official APIs (OpenAI, Anthropic, Google, etc.)
 * - Web scraping (with proper rate limiting and respect for robots.txt)
 * - Manual updates via PR
 * 
 * For now, this is a template that maintains the current data structure.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MODELS_FILE = path.join(DATA_DIR, 'models.json');

// Current pricing data (as of 2026-03-10)
// In production, this would be fetched from APIs
const pricingData = {
    lastUpdated: new Date().toISOString(),
    aiModels: [
        {
            provider: "OpenAI",
            model: "GPT-5.2",
            inputPrice: 1.75,
            outputPrice: 14.00,
            contextWindow: "128K",
            category: "flagship"
        },
        {
            provider: "OpenAI",
            model: "GPT-4o",
            inputPrice: 2.50,
            outputPrice: 10.00,
            contextWindow: "128K",
            category: "multimodal"
        },
        {
            provider: "OpenAI",
            model: "GPT-4o mini",
            inputPrice: 0.15,
            outputPrice: 0.60,
            contextWindow: "128K",
            category: "economy"
        },
        {
            provider: "OpenAI",
            model: "GPT-4 Turbo",
            inputPrice: 10.00,
            outputPrice: 30.00,
            contextWindow: "128K",
            category: "legacy"
        },
        {
            provider: "Anthropic",
            model: "Claude Opus 4.5",
            inputPrice: 5.00,
            outputPrice: 25.00,
            contextWindow: "200K",
            category: "flagship"
        },
        {
            provider: "Anthropic",
            model: "Claude Sonnet 4.5",
            inputPrice: 3.00,
            outputPrice: 15.00,
            contextWindow: "200K",
            category: "balanced"
        },
        {
            provider: "Anthropic",
            model: "Claude Haiku 4.5",
            inputPrice: 1.00,
            outputPrice: 5.00,
            contextWindow: "200K",
            category: "fast"
        },
        {
            provider: "Google",
            model: "Gemini 3 Pro",
            inputPrice: 2.00,
            outputPrice: 12.00,
            contextWindow: "2M",
            category: "flagship"
        },
        {
            provider: "Google",
            model: "Gemini 3 Flash",
            inputPrice: 0.50,
            outputPrice: 3.00,
            contextWindow: "1M",
            category: "fast"
        },
        {
            provider: "Google",
            model: "Gemini 2.5 Pro",
            inputPrice: 1.25,
            outputPrice: 10.00,
            contextWindow: "2M",
            category: "balanced"
        },
        {
            provider: "Google",
            model: "Gemini 2.5 Flash",
            inputPrice: 0.30,
            outputPrice: 2.50,
            contextWindow: "1M",
            category: "economy"
        },
        {
            provider: "DeepSeek",
            model: "DeepSeek V3.2",
            inputPrice: 0.28,
            outputPrice: 0.42,
            contextWindow: "128K",
            category: "economy"
        },
        {
            provider: "DeepSeek",
            model: "DeepSeek V2.5",
            inputPrice: 0.14,
            outputPrice: 0.28,
            contextWindow: "128K",
            category: "economy"
        },
        {
            provider: "DeepSeek",
            model: "DeepSeek R1",
            inputPrice: 0.55,
            outputPrice: 2.19,
            contextWindow: "128K",
            category: "reasoning"
        }
    ],
    codingPlans: [
        {
            provider: "Cursor",
            plan: "Hobby",
            price: 0,
            billing: "monthly",
            features: "Limited completions, slow premium requests",
            limits: "Evaluation only"
        },
        {
            provider: "Cursor",
            plan: "Pro",
            price: 20,
            billing: "monthly",
            features: "Unlimited basic completions, $20 credit for premium models",
            limits: "~225 Sonnet requests/month"
        },
        {
            provider: "Cursor",
            plan: "Pro+",
            price: 60,
            billing: "monthly",
            features: "More credits for heavy AI users",
            limits: "3x Pro credits"
        },
        {
            provider: "Cursor",
            plan: "Ultra",
            price: 200,
            billing: "monthly",
            features: "Top tier usage, priority access",
            limits: "20x Pro credits"
        },
        {
            provider: "Cursor",
            plan: "Business",
            price: 40,
            billing: "monthly/user",
            features: "Centralized billing, admin dashboard, SSO",
            limits: "Per user"
        },
        {
            provider: "Claude Code",
            plan: "Free",
            price: 0,
            billing: "monthly",
            features: "Basic chat access",
            limits: "No Claude Code access"
        },
        {
            provider: "Claude Code",
            plan: "Pro",
            price: 20,
            billing: "monthly",
            features: "Terminal access, file creation, code execution",
            limits: "40-80 hours/week"
        },
        {
            provider: "Claude Code",
            plan: "Max 5x",
            price: 100,
            billing: "monthly",
            features: "5x Pro usage, Opus access",
            limits: "200-400 hours/week"
        },
        {
            provider: "Claude Code",
            plan: "Max 20x",
            price: 200,
            billing: "monthly",
            features: "20x Pro usage, full Opus access",
            limits: "800-1600 hours/week"
        },
        {
            provider: "Cline",
            plan: "Individual",
            price: 0,
            billing: "free",
            features: "VS Code/JetBrains extension, BYO API key",
            limits: "Pay for your own API usage"
        },
        {
            provider: "Cline",
            plan: "Teams",
            price: 20,
            billing: "monthly/user",
            features: "Centralized billing, team dashboard, RBAC",
            limits: "First 10 seats free"
        },
        {
            provider: "Cline",
            plan: "Enterprise",
            price: null,
            billing: "custom",
            features: "SSO, SLA, dedicated support",
            limits: "Custom pricing"
        }
    ]
};

function updateData() {
    console.log('🔄 Updating pricing data...');
    
    // Update timestamp
    pricingData.lastUpdated = new Date().toISOString();
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Write updated data
    fs.writeFileSync(MODELS_FILE, JSON.stringify(pricingData, null, 2), 'utf-8');
    
    console.log('✅ Data updated successfully!');
    console.log(`📁 Saved to: ${MODELS_FILE}`);
    console.log(`🕐 Last updated: ${pricingData.lastUpdated}`);
    console.log(`📊 AI Models: ${pricingData.aiModels.length}`);
    console.log(`💼 Coding Plans: ${pricingData.codingPlans.length}`);
}

// Run update
updateData();
