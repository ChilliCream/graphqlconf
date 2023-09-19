namespace ProductDetails.Types;

[QueryType]
public static class Query
{
    public static Product? GetProductById(
        [ID(nameof(Product))] int id, 
        ProductRepository productRepository)
        => productRepository.GetById(id);
        
}
