// 储存优化工具
export class StorageOptimizer {
  private static readonly COMPRESSION_THRESHOLD = 1000; // 1KB 开始压缩
  private static readonly CHUNK_SIZE = 1024 * 50; // 50KB 分块大小
  private static readonly EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000; // 30天过期时间

  // 压缩文本数据
  static compress(data: string): string {
    if (!data || data.length < this.COMPRESSION_THRESHOLD) return data;
    
    // 移除多余空白字符
    return data
      .replace(/\s+/g, ' ') // 多个空白字符替换为单个空格
      .replace(/^\s+|\s+$/gm, '') // 移除每行首尾空白
      .replace(/\n\s*\n/g, '\n') // 移除空行
      .trim();
  }

  // 解压缩数据
  static decompress(data: string): string {
    return data; // 简单压缩是可逆的，不需要特殊解压缩
  }

  // 检查是否应该压缩
  static shouldCompress(data: string): boolean {
    return !!(data && data.length > this.COMPRESSION_THRESHOLD);
  }

  // 分块存储大文本
  static saveLargeText(key: string, data: string): void {
    if (typeof window === 'undefined') return;
    
    const chunks = Math.ceil(data.length / this.CHUNK_SIZE);
    
    // 存储分块信息
    localStorage.setItem(`${key}_chunks`, chunks.toString());
    localStorage.setItem(`${key}_compressed`, 'true');
    
    // 存储每个分块
    for (let i = 0; i < chunks; i++) {
      const chunk = data.slice(i * this.CHUNK_SIZE, (i + 1) * this.CHUNK_SIZE);
      const compressedChunk = this.compress(chunk);
      localStorage.setItem(`${key}_chunk_${i}`, compressedChunk);
    }
  }

  // 读取分块大文本
  static loadLargeText(key: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const chunks = localStorage.getItem(`${key}_chunks`);
    if (!chunks) return null;
    
    const isCompressed = localStorage.getItem(`${key}_compressed`) === 'true';
    const chunkCount = parseInt(chunks);
    
    let result = '';
    for (let i = 0; i < chunkCount; i++) {
      const chunk = localStorage.getItem(`${key}_chunk_${i}`);
      if (chunk) {
        result += isCompressed ? this.decompress(chunk) : chunk;
      }
    }
    
    return result;
  }

  // 清理过期数据
  static cleanupExpiredData(): { cleaned: number; savedSpace: number } {
    if (typeof window === 'undefined') return { cleaned: 0, savedSpace: 0 };
    
    let cleaned = 0;
    let savedSpace = 0;
    const now = Date.now();
    
    // 检查所有 localStorage 数据
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        // 检查是否是过期数据（基于最后修改时间）
        if (key.includes('_last_modified')) {
          const lastModified = parseInt(value);
          if (now - lastModified > this.EXPIRE_TIME) {
            const dataKey = key.replace('_last_modified', '');
            const dataSize = localStorage.getItem(dataKey)?.length || 0;
            
            localStorage.removeItem(key);
            localStorage.removeItem(dataKey);
            
            // 清理相关分块数据
            if (localStorage.getItem(`${dataKey}_chunks`)) {
              const chunks = parseInt(localStorage.getItem(`${dataKey}_chunks`)!);
              for (let j = 0; j < chunks; j++) {
                localStorage.removeItem(`${dataKey}_chunk_${j}`);
              }
              localStorage.removeItem(`${dataKey}_chunks`);
              localStorage.removeItem(`${dataKey}_compressed`);
            }
            
            cleaned++;
            savedSpace += dataSize;
          }
        }
      } catch (error) {
        console.warn(`清理 key "${key}" 时出错:`, error);
      }
    }
    
    return { cleaned, savedSpace };
  }

  // 压缩大文本数据
  static compressLargeData(): { compressed: number; savedSpace: number } {
    if (typeof window === 'undefined') return { compressed: 0, savedSpace: 0 };
    
    let compressed = 0;
    let savedSpace = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key.includes('_chunks') || key.includes('_compressed')) continue;
      
      try {
        const value = localStorage.getItem(key);
        if (!value || value.length < this.COMPRESSION_THRESHOLD) continue;
        
        // 避免重复压缩
        if (localStorage.getItem(`${key}_compressed`) === 'true') continue;
        
        const compressedValue = this.compress(value);
        if (compressedValue.length < value.length) {
          const saved = value.length - compressedValue.length;
          
          // 如果是大文本，使用分块存储
          if (compressedValue.length > this.CHUNK_SIZE) {
            this.saveLargeText(key, compressedValue);
          } else {
            localStorage.setItem(key, compressedValue);
            localStorage.setItem(`${key}_compressed`, 'true');
            localStorage.setItem(`${key}_last_modified`, Date.now().toString());
          }
          
          compressed++;
          savedSpace += saved;
        }
      } catch (error) {
        console.warn(`压缩 key "${key}" 时出错:`, error);
      }
    }
    
    return { compressed, savedSpace };
  }

  // 获取储存分析
  static getStorageAnalysis(): {
    totalKeys: number;
    totalSize: number;
    compressedKeys: number;
    compressedSize: number;
    largeKeys: number;
    largeSize: number;
    expiredKeys: number;
    expiredSize: number;
    compressionOpportunities: number;
    potentialSavings: number;
  } {
    if (typeof window === 'undefined') {
      return {
        totalKeys: 0,
        totalSize: 0,
        compressedKeys: 0,
        compressedSize: 0,
        largeKeys: 0,
        largeSize: 0,
        expiredKeys: 0,
        expiredSize: 0,
        compressionOpportunities: 0,
        potentialSavings: 0
      };
    }
    
    const now = Date.now();
    let totalKeys = 0;
    let totalSize = 0;
    let compressedKeys = 0;
    let compressedSize = 0;
    let largeKeys = 0;
    let largeSize = 0;
    let expiredKeys = 0;
    let expiredSize = 0;
    let compressionOpportunities = 0;
    let potentialSavings = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        const size = value.length;
        totalKeys++;
        totalSize += size;
        
        // 检查是否已压缩
        if (localStorage.getItem(`${key}_compressed`) === 'true') {
          compressedKeys++;
          compressedSize += size;
        }
        
        // 检查是否为大文本
        if (size > this.COMPRESSION_THRESHOLD) {
          largeKeys++;
          largeSize += size;
          
          // 检查压缩机会
          if (localStorage.getItem(`${key}_compressed`) !== 'true') {
            const compressed = this.compress(value);
            if (compressed.length < size) {
              compressionOpportunities++;
              potentialSavings += (size - compressed.length);
            }
          }
        }
        
        // 检查是否过期
        const lastModified = localStorage.getItem(`${key}_last_modified`);
        if (lastModified && now - parseInt(lastModified) > this.EXPIRE_TIME) {
          expiredKeys++;
          expiredSize += size;
        }
      } catch (error) {
        console.warn(`分析 key "${key}" 时出错:`, error);
      }
    }
    
    return {
      totalKeys,
      totalSize,
      compressedKeys,
      compressedSize,
      largeKeys,
      largeSize,
      expiredKeys,
      expiredSize,
      compressionOpportunities,
      potentialSavings
    };
  }

  // 智能优化
  static optimize(): {
    cleaned: number;
    compressed: number;
    savedSpace: number;
    analysis: ReturnType<typeof StorageOptimizer.getStorageAnalysis>;
  } {
    const analysis = this.getStorageAnalysis();
    
    // 清理过期数据
    const cleanupResult = this.cleanupExpiredData();
    
    // 压缩大文本数据
    const compressionResult = this.compressLargeData();
    
    return {
      cleaned: cleanupResult.cleaned + compressionResult.compressed,
      compressed: compressionResult.compressed,
      savedSpace: cleanupResult.savedSpace + compressionResult.savedSpace,
      analysis: this.getStorageAnalysis()
    };
  }
}

// 增强版储存管理器
export class EnhancedStorageManager {
  // 智能保存（自动判断是否需要压缩）
  static smartSave(key: string, data: string): void {
    if (typeof window === 'undefined') return;
    
    if (StorageOptimizer.shouldCompress(data)) {
      StorageOptimizer.saveLargeText(key, data);
    } else {
      localStorage.setItem(key, data);
    }
    
    localStorage.setItem(`${key}_last_modified`, Date.now().toString());
  }

  // 智能加载（自动判断是否需要解压缩）
  static smartLoad(key: string): string | null {
    if (typeof window === 'undefined') return null;
    
    // 检查是否有分块数据
    if (localStorage.getItem(`${key}_chunks`)) {
      return StorageOptimizer.loadLargeText(key);
    }
    
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    // 检查是否已压缩
    if (localStorage.getItem(`${key}_compressed`) === 'true') {
      return StorageOptimizer.decompress(data);
    }
    
    return data;
  }

  // 获取优化后的储存统计
  static getOptimizedStorageStats(): {
    used: number;
    total: number;
    percentage: number;
    analysis: ReturnType<typeof StorageOptimizer.getStorageAnalysis>;
  } {
    if (typeof window === 'undefined') {
      return {
        used: 0,
        total: 0,
        percentage: 0,
        analysis: StorageOptimizer.getStorageAnalysis()
      };
    }
    
    const analysis = StorageOptimizer.getStorageAnalysis();
    const used = analysis.totalSize;
    const total = 100 * 1024 * 1024; // 100MB 估算
    const percentage = (used / total) * 100;
    
    return {
      used,
      total,
      percentage,
      analysis
    };
  }
}