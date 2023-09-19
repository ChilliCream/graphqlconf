namespace ProductDetails.Types;

public class ProductRepository
{
    private readonly Dictionary<int, Product> _products = new()
    {
        [1] = new Product(1, "Some description ..."),
    };  

    public Product? GetById(int id)
        => _products.TryGetValue(id, out var product) ? product : null;
}
