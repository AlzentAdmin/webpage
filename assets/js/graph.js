// Graph module for currency devaluation visualization
const graphData = {
    'ARS': {
        val: '-98%',
        height: '2%',
        color: '#ef4444',
        desc: {
            en: "Argentine Peso catastrophic devaluation.",
            es: "Devaluación catastrófica del Peso Argentino.",
            pt: "Desvalorização catastrófica do Peso Argentino.",
            it: "Svalutazione catastrofica del Peso Argentino.",
            ru: "Катастрофическая девальвация песо.",
            zh: "阿根廷比索灾难性贬值。"
        }
    },
    'COP': {
        val: '-32%',
        height: '68%',
        color: '#eab308',
        desc: {
            en: "High regional volatility for COP.",
            es: "Alta volatilidad regional para el COP.",
            pt: "Alta volatilidade regional para o COP.",
            it: "Alta volatilità regionale per il COP.",
            ru: "Высокая волатильность колумбийского песо.",
            zh: "哥伦比亚比索的高波动性。"
        }
    },
    'BRL': {
        val: '-35%',
        height: '65%',
        color: '#22c55e',
        desc: {
            en: "Continued pressure on Brazilian Real.",
            es: "Presión continua sobre el Real Brasileño.",
            pt: "Pressão contínua sobre o Real Brasileiro.",
            it: "Continua pressione sul Real Brasiliano.",
            ru: "Давление на бразильский реал.",
            zh: "巴西雷亚尔面临持续压力。"
        }
    }
};

// Update currency devaluation graph
function updateGraph(currency) {
    // Validate currency exists in graphData
    if (!graphData[currency]) {
        return;
    }
    
    const data = graphData[currency];
    
    // Update value display
    const valEl = document.getElementById('local-val');
    if (valEl) {
        valEl.innerText = data.val;
        valEl.style.color = data.color;
    }
    
    // Update currency label
    const labelEl = document.getElementById('local-label');
    if (labelEl) {
        labelEl.innerText = currency;
    }
    
    // Update description with proper fallback
    const descEl = document.getElementById('graph-desc');
    if (descEl && data.desc) {
        // Get current language from i18n module
        const lang = window.currentLang || 'en';
        const descText = data.desc[lang] || data.desc['en'] || '';
        descEl.innerText = descText;
    }
    
    // Update bar height and color
    const barEl = document.getElementById('local-bar');
    if (barEl) {
        barEl.style.height = data.height;
        barEl.style.backgroundColor = data.color;
    }
    
    // Update currency button states
    document.querySelectorAll('.currency-btn').forEach(btn => {
        if (btn.dataset.currency === currency) {
            btn.classList.add('bg-alzent-card', 'text-white', 'border-alzent-border');
            btn.classList.remove('bg-transparent', 'text-alzent-subtext');
        } else {
            btn.classList.remove('bg-alzent-card', 'text-white', 'border-alzent-border');
            btn.classList.add('bg-transparent', 'text-alzent-subtext');
        }
    });
}

// Make function globally available
window.updateGraph = updateGraph;
window.graphData = graphData;

