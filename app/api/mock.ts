// 模拟存储 productId 的接口
export const storeProductId = async (productId: string) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      productId,
      timestamp: new Date().toISOString()
    }
  };
}; 