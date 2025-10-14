// Simple API response caching for Hugging Face
class APICache {
    constructor(maxSize = 100, ttl = 300000) { // 5 minutes TTL
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }
    
    generateKey(prompt, model) {
        return `${model}:${prompt.substring(0, 50)}`;
    }
    
    get(prompt, model) {
        const key = this.generateKey(prompt, model);
        const item = this.cache.get(key);
        
        if (item && Date.now() - item.timestamp < this.ttl) {
            console.log('Cache hit for:', key);
            return item.data;
        }
        
        if (item) {
            this.cache.delete(key); // Remove expired item
        }
        
        return null;
    }
    
    set(prompt, model, data) {
        const key = this.generateKey(prompt, model);
        
        // Remove oldest items if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        
        console.log('Cached response for:', key);
    }
    
    clear() {
        this.cache.clear();
        console.log('API cache cleared');
    }
    
    size() {
        return this.cache.size;
    }
}

// Global cache instance
window.apiCache = new APICache();
