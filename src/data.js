// AI Model Compare - Data Loader and Renderer
(function() {
    let aiModelsData = [];
    let codingPlansData = [];
    let currentSort = { field: null, direction: 'asc' };

    // Format price with $ symbol
    function formatPrice(price) {
        if (price === null || price === undefined) return 'Custom';
        return `$${price.toFixed(2)}`;
    }

    // Format context window
    function formatContext(window) {
        return window || 'N/A';
    }

    // Get category badge color
    function getCategoryBadge(category) {
        const colors = {
            flagship: 'bg-purple-100 text-purple-800',
            balanced: 'bg-blue-100 text-blue-800',
            fast: 'bg-green-100 text-green-800',
            economy: 'bg-yellow-100 text-yellow-800',
            legacy: 'bg-gray-100 text-gray-800',
            multimodal: 'bg-pink-100 text-pink-800',
            reasoning: 'bg-indigo-100 text-indigo-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    }

    // Get provider class
    function getProviderClass(provider) {
        const classes = {
            OpenAI: 'provider-openai',
            Anthropic: 'provider-anthropic',
            Google: 'provider-google',
            DeepSeek: 'provider-deepseek',
            Cursor: 'provider-cursor',
            'Claude Code': 'provider-claude-code',
            Cline: 'provider-cline'
        };
        return classes[provider] || '';
    }

    // Render AI Models table
    function renderAIModels(data) {
        const tbody = document.getElementById('aiModelsBody');
        tbody.innerHTML = '';

        data.forEach(model => {
            const tr = document.createElement('tr');
            tr.className = `hover:bg-gray-50 ${getProviderClass(model.provider)}`;
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${model.provider}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${model.model}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatPrice(model.inputPrice)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatPrice(model.outputPrice)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatContext(model.contextWindow)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(model.category)}">
                        ${model.category}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Render Coding Plans table
    function renderCodingPlans(data) {
        const tbody = document.getElementById('codingPlansBody');
        tbody.innerHTML = '';

        data.forEach(plan => {
            const tr = document.createElement('tr');
            tr.className = `hover:bg-gray-50 ${getProviderClass(plan.provider)}`;
            const priceDisplay = plan.price === null ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`;
            const billingDisplay = plan.billing === 'custom' ? 'Custom' : plan.billing === 'free' ? 'Free' : `/${plan.billing}`;
            
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${plan.provider}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plan.plan}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${priceDisplay}${billingDisplay}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${plan.billing}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${plan.features}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${plan.limits}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Sort data
    function sortData(data, field) {
        if (currentSort.field === field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.field = field;
            currentSort.direction = 'asc';
        }

        return [...data].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (aVal === null) aVal = Infinity;
            if (bVal === null) bVal = Infinity;

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (currentSort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    // Filter data
    function filterData(data, searchTerm, searchFields) {
        if (!searchTerm) return data;
        
        const term = searchTerm.toLowerCase();
        return data.filter(item => 
            searchFields.some(field => 
                item[field] && String(item[field]).toLowerCase().includes(term)
            )
        );
    }

    // Update tables with search and sort
    function updateTables() {
        const modelSearch = document.getElementById('modelSearch').value;
        const planSearch = document.getElementById('planSearch').value;

        let filteredModels = filterData(aiModelsData, modelSearch, ['provider', 'model', 'category']);
        let filteredPlans = filterData(codingPlansData, planSearch, ['provider', 'plan', 'features']);

        renderAIModels(filteredModels);
        renderCodingPlans(filteredPlans);
    }

    // Load data from JSON
    async function loadData() {
        try {
            const response = await fetch('./data/models.json');
            const data = await response.json();

            aiModelsData = data.aiModels;
            codingPlansData = data.codingPlans;

            // Update last update time
            const lastUpdate = new Date(data.lastUpdated);
            document.getElementById('lastUpdate').textContent = lastUpdate.toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Initial render
            updateTables();

            // Setup search listeners
            document.getElementById('modelSearch').addEventListener('input', updateTables);
            document.getElementById('planSearch').addEventListener('input', updateTables);

            // Setup sort listeners
            document.querySelectorAll('th[data-sort]').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.sort;
                    aiModelsData = sortData(aiModelsData, field);
                    codingPlansData = sortData(codingPlansData, field);
                    updateTables();
                });
            });

        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('lastUpdate').textContent = '加载失败';
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', loadData);
})();
