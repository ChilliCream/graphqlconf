namespace ProductDetails.Types;

public class Product(int id, string description)
{
    [ID(nameof(Product))]
    [Key]
    public int Id { get; } = id;

    public string Description { get; } = description;

    [ReferenceResolver]
    public static Product? GetByIdAsync(
        string id,
        IIdSerializer idSerializer,
        ProductRepository productRepository)
        => productRepository.GetById(int.Parse((string)idSerializer.Deserialize(id).Value));
}
